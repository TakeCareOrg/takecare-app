import { useCallback, useMemo, useRef } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
    AnimatedRef,
    scrollTo,
    SharedValue,
    useFrameCallback,
    useSharedValue,
} from "react-native-reanimated";

import { useHealthDataStore } from "@app/stores/health-data";
import { useHomeLayoutStore, type WidgetId } from "@stores/home-layout";

import { DraggableWidget } from "./DraggableWidget";
import {
    CELL_GAP,
    CELL_HEIGHT,
    computeMetrics,
    findSlotIndexAtCell,
    H_PADDING,
    packGrid,
    pxToCell,
    reorderForDrop,
    slotPixelHeight,
    slotPixelWidth,
    slotPixelX,
    slotPixelY,
    totalRows,
    WIDGET_SIZES,
} from "./grid-layout";
import { renderWidget } from "./widget-registry";
import { isWidgetAvailable } from "./widget-visibility";

type Props = {
    screenWidth: number;
    horizontalPadding?: number;
    scrollRef: AnimatedRef<Animated.ScrollView>;
    scrollY: SharedValue<number>;
};

const AUTOSCROLL_EDGE_TOP = 140;
const AUTOSCROLL_EDGE_BOTTOM = 200;
const AUTOSCROLL_SPEED = 9;

export function DraggableGrid({
    screenWidth,
    horizontalPadding = H_PADDING,
    scrollRef,
    scrollY,
}: Props) {
    const { height: screenHeight } = useWindowDimensions();
    const order = useHomeLayoutStore((s) => s.order);
    const columns = useHomeLayoutStore((s) => s.columns);
    const setLayout = useHomeLayoutStore((s) => s.setLayout);
    // Subscribe to the same store slots the visibility helper reads so
    // the grid re-packs whenever new Withings/HC data lands (e.g. first
    // weight measurement after a Withings connect) — otherwise the user
    // would have to leave/return to Home for the new widget to appear.
    const todayCache = useHealthDataStore((s) => s.todayCache);
    const historicalCache = useHealthDataStore((s) => s.historicalCache);

    const visibleOrder = useMemo(
        () =>
            order.filter((id) =>
                isWidgetAvailable(id, { todayCache, historicalCache }),
            ),
        [order, todayCache, historicalCache],
    );

    const slots = useMemo(
        () => packGrid(visibleOrder, WIDGET_SIZES, columns),
        [visibleOrder, columns],
    );
    const rows = useMemo(() => totalRows(slots), [slots]);
    const metrics = useMemo(
        () => computeMetrics(screenWidth, horizontalPadding, rows),
        [screenWidth, horizontalPadding, rows],
    );

    const autoscrollDir = useSharedValue(0);
    const maxScrollY = useSharedValue(0);

    const scrollEdgeTop = AUTOSCROLL_EDGE_TOP;
    const scrollEdgeBottom = screenHeight - AUTOSCROLL_EDGE_BOTTOM;

    useFrameCallback(() => {
        if (autoscrollDir.value === 0) return;
        const next = scrollY.value + autoscrollDir.value * AUTOSCROLL_SPEED;
        const clamped = Math.max(
            0,
            maxScrollY.value > 0 ? Math.min(next, maxScrollY.value) : next,
        );
        if (clamped === scrollY.value) return;
        scrollTo(scrollRef, 0, clamped, false);
    });

    const lastTargetRef = useRef<{ x: number; y: number; after: boolean }>({
        x: -1,
        y: -1,
        after: false,
    });

    // Always-fresh snapshot of layout state, read by stable onDragMove
    const stateRef = useRef({
        order,
        columns,
        slots,
        cellWidth: metrics.cellWidth,
    });
    stateRef.current = {
        order,
        columns,
        slots,
        cellWidth: metrics.cellWidth,
    };

    const onDragMove = useCallback(
        (id: WidgetId, centerX: number, centerY: number) => {
            const { order, columns, slots, cellWidth } = stateRef.current;
            const { x, y } = pxToCell(centerX, centerY, cellWidth);

            // Compute updates without committing yet
            const size = WIDGET_SIZES[id];
            const nextColumns =
                size.w === 1 && columns[id] !== x
                    ? { ...columns, [id]: x }
                    : columns;

            const targetIdx = findSlotIndexAtCell(slots, x, y);
            if (targetIdx === -1) {
                if (nextColumns !== columns) {
                    setLayout({ columns: nextColumns });
                }
                return;
            }

            const targetSlot = slots[targetIdx];
            if (targetSlot.id === id) {
                if (nextColumns !== columns) {
                    setLayout({ columns: nextColumns });
                }
                return;
            }

            const slotMidPx =
                (targetSlot.y + targetSlot.h / 2) * (CELL_HEIGHT + CELL_GAP);
            const insertAfter = centerY >= slotMidPx;

            if (
                lastTargetRef.current.x === x &&
                lastTargetRef.current.y === y &&
                lastTargetRef.current.after === insertAfter
            ) {
                if (nextColumns !== columns) {
                    setLayout({ columns: nextColumns });
                }
                return;
            }
            lastTargetRef.current = { x, y, after: insertAfter };

            const draggedIdx = order.indexOf(id);
            if (draggedIdx === -1) {
                if (nextColumns !== columns) {
                    setLayout({ columns: nextColumns });
                }
                return;
            }

            const desiredFinalIdx = insertAfter
                ? draggedIdx > targetIdx
                    ? targetIdx + 1
                    : targetIdx
                : draggedIdx > targetIdx
                  ? targetIdx
                  : targetIdx - 1;

            const nextOrder =
                desiredFinalIdx === draggedIdx
                    ? order
                    : reorderForDrop(order, id, desiredFinalIdx);

            const orderChanged = nextOrder !== order;
            const columnsChanged = nextColumns !== columns;
            if (orderChanged || columnsChanged) {
                setLayout({
                    ...(orderChanged ? { order: nextOrder } : {}),
                    ...(columnsChanged ? { columns: nextColumns } : {}),
                });
            }
        },
        [setLayout],
    );

    const onDragEnd = useCallback(() => {
        lastTargetRef.current = { x: -1, y: -1, after: false };
        autoscrollDir.value = 0;
    }, [autoscrollDir]);

    const onGridLayout = useCallback(
        (e: { nativeEvent: { layout: { height: number } } }) => {
            const contentH = e.nativeEvent.layout.height;
            const max = contentH - screenHeight + 200;
            maxScrollY.value = Math.max(0, max);
        },
        [maxScrollY, screenHeight],
    );

    return (
        <View
            style={[styles.gridContainer, { height: metrics.totalHeight }]}
            onLayout={onGridLayout}
        >
            {slots.map((slot) => {
                const widgetWidth = slotPixelWidth(slot, metrics.cellWidth);
                const widgetHeight = slotPixelHeight(slot);
                const x = slotPixelX(slot, metrics.cellWidth);
                const y = slotPixelY(slot);
                return (
                    <DraggableWidget
                        key={slot.id}
                        slot={slot}
                        baseX={x}
                        baseY={y}
                        width={widgetWidth}
                        height={widgetHeight}
                        onDragMove={onDragMove}
                        onDragEnd={onDragEnd}
                        scrollY={scrollY}
                        autoscrollDir={autoscrollDir}
                        scrollEdgeTop={scrollEdgeTop}
                        scrollEdgeBottom={scrollEdgeBottom}
                    >
                        {renderWidget(slot.id, {
                            width: widgetWidth,
                            height: widgetHeight,
                        })}
                    </DraggableWidget>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        position: "relative",
        width: "100%",
    },
});
