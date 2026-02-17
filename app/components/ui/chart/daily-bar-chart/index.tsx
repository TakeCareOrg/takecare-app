import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    View,
} from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

import {
    ANIMATION_DURATION,
    BAR_GAP,
    BAR_WIDTH,
    CENTERING_OFFSET,
    DailyBarDataItem,
    DEFAULT_HEIGHT,
    DynamicColors,
    fillMissingDays,
    PADDING_TOP,
    ReferenceLine,
    RENDER_DELAY,
    RIGHT_PADDING_WIDTH,
    SELECTION_ZONE_WIDTH,
    useBarPosition,
    useChartDimensions,
    useReferenceLineAnimation,
    YEAR_DIVIDER_WIDTH,
} from "../shared";
import { LABEL_WIDTH_PADDING, LABEL_WIDTH_PX_PER_CHAR } from "./constants";
import { ProgressBars } from "./progress-bars";
import { ReferenceLines } from "./reference-lines";
import { SelectionZone } from "./selection-zone";

const EMPTY_REFERENCE_LINES: ReferenceLine[] = [];
const ZONE_ANIM_DURATION = 150;
const RENDER_TICK_DEBOUNCE = 100; // ms — increase for more aggressive coalescing
const ON_SELECT_THROTTLE = 150; // ms — prevent parent from re-rendering too often

// ── Pure helper: compute total bar content width ─────────────────
function computeTotalBarsWidth(
    dataLength: number,
    getPos: (i: number) => number,
): number {
    if (dataLength === 0) return 0;
    return getPos(dataLength - 1) + BAR_WIDTH + BAR_GAP;
}

// ── Pure helper: compute clamped zone left for a bar ─────────────
function computeZoneLeft(
    barIndex: number,
    getPos: (i: number) => number,
    scrollOffset: number,
    vpWidth: number,
    lblWidth: number,
): { clampedZoneLeft: number; idealZoneLeft: number } {
    const barCenter = getPos(barIndex) + BAR_WIDTH / 2;
    const barScreenPos = barCenter - scrollOffset;
    const idealZoneLeft =
        barScreenPos - SELECTION_ZONE_WIDTH / 2 + CENTERING_OFFSET;
    const maxZoneLeft = vpWidth - lblWidth - SELECTION_ZONE_WIDTH;
    const clampedZoneLeft = Math.max(0, Math.min(maxZoneLeft, idealZoneLeft));
    return { clampedZoneLeft, idealZoneLeft };
}

// ── Pure helper: compute scroll offset to center a bar in zone ───
function computeSnapScroll(
    barIndex: number,
    zoneLeft: number,
    getPos: (i: number) => number,
    dataLength: number,
    vpWidth: number,
    lblWidth: number,
): number {
    const selectionCenter =
        zoneLeft + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;
    const barCenter = getPos(barIndex) + BAR_WIDTH / 2;
    const targetScroll = barCenter - selectionCenter;
    const totalBarsWidth = computeTotalBarsWidth(dataLength, getPos);
    const maxScroll = Math.max(0, totalBarsWidth - vpWidth + lblWidth);
    return Math.max(0, Math.min(targetScroll, maxScroll));
}

interface DailyBarChartProps {
    data: DailyBarDataItem[];
    height?: number;
    emptyDayColor?: string;
    onSelect?: (selectedData: DailyBarDataItem, index: number) => void;
    dynamicColors?: DynamicColors;
    referenceLines?: ReferenceLine[];
}

export const DailyBarChart = ({
    data,
    height = DEFAULT_HEIGHT,
    emptyDayColor = "#2A2A2A",
    onSelect,
    dynamicColors,
    referenceLines = EMPTY_REFERENCE_LINES,
}: DailyBarChartProps) => {
    // ── Only TWO pieces of React state (minimal re-renders) ──────────
    const [viewportWidth, setViewportWidth] = useState(0);
    const [renderTick, setRenderTick] = useState(0);

    // ── Refs for all mutable values (callbacks read these, never deps) ─
    const selectedIndexRef = useRef<number | null>(null);
    const selectionZoneLeft = useSharedValue(0);
    const selectionZoneTargetRef = useRef<number | null>(null);

    const flatListRef = useRef<FlatList>(null);
    const scrollOffsetRef = useRef(0);
    const isAdjustingRef = useRef(false);
    const isInitializedRef = useRef(false);

    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;
    const viewportWidthRef = useRef(0);
    const labelWidthRef = useRef(0);

    // Throttle for onSelect callback to prevent parent re-renders cascading
    const lastOnSelectTimeRef = useRef(0);
    const pendingOnSelectRef = useRef<{
        data: DailyBarDataItem;
        index: number;
    } | null>(null);
    const onSelectThrottleTimeoutRef = useRef<ReturnType<
        typeof setTimeout
    > | null>(null);

    // Timer refs
    const renderTickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const adjustTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    // ── Throttled onSelect to prevent parent cascade ────────────────
    const throttledOnSelect = useCallback(
        (data: DailyBarDataItem, index: number) => {
            const now = Date.now();
            const timeSinceLastCall = now - lastOnSelectTimeRef.current;

            // Store pending call
            pendingOnSelectRef.current = { data, index };

            if (timeSinceLastCall >= ON_SELECT_THROTTLE) {
                // Execute immediately
                lastOnSelectTimeRef.current = now;
                onSelectRef.current?.(data, index);
                pendingOnSelectRef.current = null;

                // Clear any pending timeout
                if (onSelectThrottleTimeoutRef.current) {
                    clearTimeout(onSelectThrottleTimeoutRef.current);
                    onSelectThrottleTimeoutRef.current = null;
                }
            } else {
                // Schedule execution
                if (onSelectThrottleTimeoutRef.current) {
                    clearTimeout(onSelectThrottleTimeoutRef.current);
                }

                const delay = ON_SELECT_THROTTLE - timeSinceLastCall;
                onSelectThrottleTimeoutRef.current = setTimeout(() => {
                    const pending = pendingOnSelectRef.current;
                    if (pending) {
                        lastOnSelectTimeRef.current = Date.now();
                        onSelectRef.current?.(pending.data, pending.index);
                        pendingOnSelectRef.current = null;
                    }
                    onSelectThrottleTimeoutRef.current = null;
                }, delay);
            }
        },
        [], // Fully stable — all dependencies in refs
    );

    // ── Data processing (useMemo — stable if props are stable) ───────
    const processedData = useMemo(
        () =>
            fillMissingDays(data, emptyDayColor, dynamicColors, referenceLines),
        [data, emptyDayColor, dynamicColors, referenceLines],
    );
    const processedDataRef = useRef(processedData);
    processedDataRef.current = processedData;

    // ── Label width ──────────────────────────────────────────────────
    const labelWidth = useMemo(() => {
        if (!referenceLines || referenceLines.length === 0)
            return RIGHT_PADDING_WIDTH;
        const maxLength = Math.max(
            ...referenceLines.map((line) => line.label.length),
        );
        return Math.max(
            RIGHT_PADDING_WIDTH,
            maxLength * LABEL_WIDTH_PX_PER_CHAR + LABEL_WIDTH_PADDING,
        );
    }, [referenceLines]);
    labelWidthRef.current = labelWidth;

    // ── Chart dimensions & bar positions ─────────────────────────────
    const { chartHeight, paddingTop, paddingBottom } = useChartDimensions({
        height,
    });

    const { getBarPosition } = useBarPosition({
        data: processedData,
        barWidth: BAR_WIDTH,
        barGap: BAR_GAP,
        yearDividerWidth: YEAR_DIVIDER_WIDTH,
    });
    const getBarPositionRef = useRef(getBarPosition);
    getBarPositionRef.current = getBarPosition;

    const dynamicMaxValue = useMemo(
        () => Math.max(1, ...processedData.map((d) => d.value)),
        [processedData],
    );

    const { animatedPositions } = useReferenceLineAnimation({
        referenceLines,
        dynamicMaxValue,
        chartHeight,
    });

    // ── Year divider detection ───────────────────────────────────────
    const hasYearDivider = useCallback(
        (index: number) => {
            if (index === 0) return false;
            const curr = processedData[index];
            const prev = processedData[index - 1];
            return !!(
                curr?.startDate &&
                prev?.startDate &&
                new Date(curr.startDate).getFullYear() !==
                    new Date(prev.startDate).getFullYear()
            );
        },
        [processedData],
    );

    // ── Layout ───────────────────────────────────────────────────────
    const handleLayout = useCallback((event: LayoutChangeEvent) => {
        const w = event.nativeEvent.layout.width;
        viewportWidthRef.current = w;
        setViewportWidth(w);
    }, []);

    // ── Scroll tracking ──────────────────────────────────────────────
    const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
        },
        [],
    );

    // ── Cancel all pending timers ────────────────────────────────────
    const cancelTimers = useCallback(() => {
        if (scrollEndTimeoutRef.current) {
            clearTimeout(scrollEndTimeoutRef.current);
            scrollEndTimeoutRef.current = null;
        }
        if (adjustTimeoutRef.current) {
            clearTimeout(adjustTimeoutRef.current);
            adjustTimeoutRef.current = null;
        }
        if (renderTickTimeoutRef.current) {
            clearTimeout(renderTickTimeoutRef.current);
            renderTickTimeoutRef.current = null;
        }
    }, []);

    // ── Debounced render-tick flush ──────────────────────────────────
    const scheduleRenderTick = useCallback(() => {
        if (renderTickTimeoutRef.current) {
            clearTimeout(renderTickTimeoutRef.current);
        }
        renderTickTimeoutRef.current = setTimeout(() => {
            renderTickTimeoutRef.current = null;
            setRenderTick((t) => t + 1);
        }, RENDER_TICK_DEBOUNCE);
    }, []);

    // ── Find closest bar — STABLE (reads only from refs) ─────────────
    const findClosestBar = useCallback((scrollOffset: number) => {
        const zoneLeft = selectionZoneTargetRef.current;
        if (zoneLeft === null) return 0;

        const selectionCenter =
            zoneLeft + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;
        const currentData = processedDataRef.current;
        const getPos = getBarPositionRef.current;

        let closestIndex = 0;
        let minDist = Infinity;

        for (let i = 0; i < currentData.length; i++) {
            const barCenter = getPos(i) + BAR_WIDTH / 2;
            const barScreenPos = barCenter - scrollOffset;
            const dist = Math.abs(barScreenPos - selectionCenter);
            if (dist < minDist) {
                minDist = dist;
                closestIndex = i;
            }
        }
        return closestIndex;
    }, []);

    // ── Snap scroll to center a bar — STABLE ─────────────────────────
    const snapToBar = useCallback((barIndex: number) => {
        if (isAdjustingRef.current) return;
        const zoneLeft = selectionZoneTargetRef.current;
        if (zoneLeft === null) return;

        const getPos = getBarPositionRef.current;
        const currentData = processedDataRef.current;
        const vpWidth = viewportWidthRef.current;
        const lblWidth = labelWidthRef.current;

        const clampedScroll = computeSnapScroll(
            barIndex,
            zoneLeft,
            getPos,
            currentData.length,
            vpWidth,
            lblWidth,
        );

        if (Math.abs(scrollOffsetRef.current - clampedScroll) > 2) {
            isAdjustingRef.current = true;
            flatListRef.current?.scrollToOffset({
                offset: clampedScroll,
                animated: true,
            });
            if (adjustTimeoutRef.current) {
                clearTimeout(adjustTimeoutRef.current);
            }
            adjustTimeoutRef.current = setTimeout(() => {
                adjustTimeoutRef.current = null;
                isAdjustingRef.current = false;
            }, ANIMATION_DURATION + 50);
        }
    }, []); // STABLE — all values from refs

    // ── Handle scroll end — STABLE ───────────────────────────────────
    const handleScrollEnd = useCallback(
        (event?: NativeSyntheticEvent<NativeScrollEvent>) => {
            if (isAdjustingRef.current) return;
            if (selectionZoneTargetRef.current === null) return;

            const eventOffsetX = event?.nativeEvent?.contentOffset?.x;

            if (scrollEndTimeoutRef.current) {
                clearTimeout(scrollEndTimeoutRef.current);
            }

            scrollEndTimeoutRef.current = setTimeout(() => {
                scrollEndTimeoutRef.current = null;
                if (isAdjustingRef.current) return;

                const currentOffset = scrollOffsetRef.current;
                if (
                    eventOffsetX !== undefined &&
                    Math.abs(eventOffsetX - currentOffset) > 2
                ) {
                    return;
                }

                const closestIndex = findClosestBar(currentOffset);
                const currentData = processedDataRef.current;

                selectedIndexRef.current = closestIndex;
                scheduleRenderTick();

                if (onSelectRef.current && currentData[closestIndex]) {
                    throttledOnSelect(currentData[closestIndex], closestIndex);
                }

                snapToBar(closestIndex);
            }, 100);
        },
        [findClosestBar, snapToBar, scheduleRenderTick, throttledOnSelect],
    );

    // ── Handle bar press — STABLE ────────────────────────────────────
    const handleBarPress = useCallback(
        (index: number) => {
            if (!isInitializedRef.current) return;

            // Cancel all pending work
            cancelTimers();

            // Block scroll-end for the entire duration
            isAdjustingRef.current = true;

            const currentData = processedDataRef.current;
            const getPos = getBarPositionRef.current;
            const vpWidth = viewportWidthRef.current;
            const lblWidth = labelWidthRef.current;

            // Update selected index (ref now, state later via debounced tick)
            selectedIndexRef.current = index;
            scheduleRenderTick();

            if (onSelectRef.current && currentData[index]) {
                throttledOnSelect(currentData[index], index);
            }

            // Compute & animate selection zone (UI thread, no setState)
            const { clampedZoneLeft, idealZoneLeft } = computeZoneLeft(
                index,
                getPos,
                scrollOffsetRef.current,
                vpWidth,
                lblWidth,
            );

            selectionZoneTargetRef.current = clampedZoneLeft;
            selectionZoneLeft.value = withTiming(clampedZoneLeft, {
                duration: ZONE_ANIM_DURATION,
            });

            // If zone was edge-clamped, snap scroll to align
            const needsScroll = Math.abs(clampedZoneLeft - idealZoneLeft) > 1;

            if (needsScroll) {
                const clampedScroll = computeSnapScroll(
                    index,
                    clampedZoneLeft,
                    getPos,
                    currentData.length,
                    vpWidth,
                    lblWidth,
                );
                flatListRef.current?.scrollToOffset({
                    offset: clampedScroll,
                    animated: true,
                });
            }

            // Release guard after animations finish
            adjustTimeoutRef.current = setTimeout(
                () => {
                    adjustTimeoutRef.current = null;
                    isAdjustingRef.current = false;
                },
                (needsScroll ? ANIMATION_DURATION : ZONE_ANIM_DURATION) + 50,
            );
        },
        [
            cancelTimers,
            scheduleRenderTick,
            selectionZoneLeft,
            throttledOnSelect,
        ],
    );

    // ── Initialization — depends only on viewportWidth ───────────────
    useEffect(() => {
        if (viewportWidth === 0 || isInitializedRef.current) return;

        const currentData = processedDataRef.current;
        if (currentData.length === 0) return;

        isInitializedRef.current = true;

        const vpWidth = viewportWidthRef.current;
        const lblWidth = labelWidthRef.current;
        const getPos = getBarPositionRef.current;

        const rightEdge = vpWidth - lblWidth - SELECTION_ZONE_WIDTH;
        selectionZoneTargetRef.current = rightEdge;
        selectionZoneLeft.value = rightEdge;

        const targetIndex = currentData.length - 1;
        const scrollTo = computeSnapScroll(
            targetIndex,
            rightEdge,
            getPos,
            currentData.length,
            vpWidth,
            lblWidth,
        );

        isAdjustingRef.current = true;

        setTimeout(() => {
            flatListRef.current?.scrollToOffset({
                offset: scrollTo,
                animated: false,
            });
            scrollOffsetRef.current = scrollTo;

            selectedIndexRef.current = targetIndex;
            setRenderTick(1);

            if (onSelectRef.current && currentData[targetIndex]) {
                throttledOnSelect(currentData[targetIndex], targetIndex);
            }

            setTimeout(() => {
                isAdjustingRef.current = false;
            }, ANIMATION_DURATION);
        }, RENDER_DELAY);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewportWidth]);

    // ── Cleanup on unmount ───────────────────────────────────────────
    useEffect(() => cancelTimers, [cancelTimers]);

    // ── FlatList helpers — STABLE ────────────────────────────────────
    const keyExtractor = useCallback(
        (_: DailyBarDataItem, index: number) => String(index),
        [],
    );

    // renderItem reads selectedIndexRef at call time.
    // FlatList re-invokes it only when extraData (renderTick) changes.
    const renderItem = useCallback(
        ({ item, index }: { item: DailyBarDataItem; index: number }) => (
            <ProgressBars
                item={item}
                isSelected={selectedIndexRef.current === index}
                dynamicMaxValue={dynamicMaxValue}
                chartHeight={chartHeight}
                onBarPress={handleBarPress}
                index={index}
                showYearDivider={hasYearDivider(index)}
            />
        ),
        [dynamicMaxValue, chartHeight, handleBarPress, hasYearDivider],
    );

    const getItemLayout = useCallback(
        (_: unknown, index: number) => ({
            length:
                BAR_WIDTH +
                BAR_GAP +
                (hasYearDivider(index) ? YEAR_DIVIDER_WIDTH : 0),
            offset: getBarPosition(index),
            index,
        }),
        [getBarPosition, hasYearDivider],
    );

    // ── Render ───────────────────────────────────────────────────────
    return (
        <View style={[styles.container, { height }]} onLayout={handleLayout}>
            <View
                style={[
                    styles.chartAreaContainer,
                    {
                        paddingRight: labelWidth,
                        height: height - paddingTop,
                    },
                ]}
            >
                <ReferenceLines
                    referenceLines={referenceLines}
                    animatedPositions={animatedPositions}
                    labelWidth={labelWidth}
                />

                <FlatList
                    ref={flatListRef}
                    horizontal
                    data={processedData}
                    extraData={renderTick}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={handleScrollEnd}
                    onScrollEndDrag={handleScrollEnd}
                    getItemLayout={getItemLayout}
                    windowSize={7}
                    maxToRenderPerBatch={20}
                    initialNumToRender={30}
                    removeClippedSubviews={true}
                />

                <SelectionZone
                    selectionZoneLeft={selectionZoneLeft}
                    visible={selectedIndexRef.current !== null}
                    height={height}
                    paddingTop={paddingTop}
                    paddingBottom={paddingBottom}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        paddingTop: PADDING_TOP,
    },
    chartAreaContainer: {
        position: "relative",
        overflow: "hidden",
    },
});
