import { useCallback, useRef } from "react";
import { ScrollView } from "react-native";

import {
    ANIMATION_DURATION,
    BAR_WIDTH,
    CENTERING_OFFSET,
    SELECTION_ZONE_WIDTH,
} from "../constants";
import { BaseBarDataItem, ScrollEvent } from "../types/chart-types";

/**
 * Hook to manage scroll behavior and snapping for charts
 */
interface UseChartScrollProps<T extends BaseBarDataItem> {
    data: T[];
    selectionZoneLeft: number | null;
    contentWidth: number;
    viewportWidth: number;
    getBarPosition: (index: number) => number;
    onSelect?: (selectedData: T, index: number) => void;
    disableSnapping?: boolean;
    barWidth?: number;
    barGap?: number;
}

export const useChartScroll = <T extends BaseBarDataItem>({
    data,
    selectionZoneLeft,
    contentWidth,
    viewportWidth,
    getBarPosition,
    onSelect,
    disableSnapping = false,
    barWidth = BAR_WIDTH,
}: UseChartScrollProps<T>) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollOffsetRef = useRef(0);
    const isUserScrollingRef = useRef(false);
    const isAdjustingRef = useRef(false);
    const lastScrollTimeRef = useRef(0);
    const scrollVelocityRef = useRef(0);
    const lastScrollOffsetRef = useRef(0);

    // Snap to center a specific bar
    const snapToBar = useCallback(
        (barIndex: number) => {
            if (
                disableSnapping ||
                isAdjustingRef.current ||
                selectionZoneLeft === null
            ) {
                return;
            }

            const selectionZoneCenter =
                selectionZoneLeft + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;
            const selectedBarCenter = getBarPosition(barIndex) + barWidth / 2;
            const targetScrollX = selectedBarCenter - selectionZoneCenter;

            const maxScrollX = Math.max(0, contentWidth - viewportWidth);
            const clampedTargetScrollX = Math.max(
                0,
                Math.min(targetScrollX, maxScrollX),
            );

            const currentScrollX = scrollOffsetRef.current;
            const snapDistance = Math.abs(
                currentScrollX - clampedTargetScrollX,
            );

            if (snapDistance > 2) {
                isAdjustingRef.current = true;

                scrollViewRef.current?.scrollTo({
                    x: clampedTargetScrollX,
                    animated: true,
                });

                setTimeout(() => {
                    isAdjustingRef.current = false;
                }, ANIMATION_DURATION);
            }
        },
        [
            disableSnapping,
            selectionZoneLeft,
            getBarPosition,
            contentWidth,
            viewportWidth,
            barWidth,
        ],
    );

    // Handle scroll begin
    const handleScrollBeginDrag = useCallback(() => {
        isUserScrollingRef.current = true;
        lastScrollTimeRef.current = Date.now();
        lastScrollOffsetRef.current = scrollOffsetRef.current;
        scrollVelocityRef.current = 0;
    }, []);

    // Handle scroll
    const handleScroll = useCallback((event: ScrollEvent) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const currentTime = Date.now();

        if (lastScrollTimeRef.current > 0) {
            const timeDiff = currentTime - lastScrollTimeRef.current;
            const offsetDiff = Math.abs(offsetX - lastScrollOffsetRef.current);
            scrollVelocityRef.current =
                timeDiff > 0 ? offsetDiff / timeDiff : 0;
        }

        scrollOffsetRef.current = offsetX;
        lastScrollTimeRef.current = currentTime;
        lastScrollOffsetRef.current = offsetX;
        isUserScrollingRef.current = true;
    }, []);

    // Find closest bar to selection zone center
    const findClosestBarIndex = useCallback(
        (scrollOffset: number) => {
            if (selectionZoneLeft === null) {
                return 0;
            }

            const selectionZoneCenter =
                selectionZoneLeft + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;

            let closestBarIndex = 0;
            let minDistance = Infinity;

            for (let i = 0; i < data.length; i++) {
                const barPosition = getBarPosition(i) + barWidth / 2;
                const barScreenPosition = barPosition - scrollOffset;
                const distance = Math.abs(
                    barScreenPosition - selectionZoneCenter,
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    closestBarIndex = i;
                }
            }

            return Math.min(data.length - 1, Math.max(0, closestBarIndex));
        },
        [data.length, selectionZoneLeft, getBarPosition, barWidth],
    );

    // Handle momentum scroll end
    const handleMomentumScrollEnd = useCallback(
        (event?: ScrollEvent, setSelectedIndex?: (index: number) => void) => {
            const eventOffsetX = event?.nativeEvent?.contentOffset?.x;

            if (isAdjustingRef.current || selectionZoneLeft === null) {
                return;
            }

            setTimeout(() => {
                isUserScrollingRef.current = false;

                const offsetX =
                    eventOffsetX !== undefined
                        ? eventOffsetX
                        : scrollOffsetRef.current;

                const currentScrollOffset = scrollOffsetRef.current;

                if (Math.abs(offsetX - currentScrollOffset) > 2) {
                    return;
                }

                const barIndex = findClosestBarIndex(currentScrollOffset);

                // Update selected bar
                if (setSelectedIndex) {
                    setSelectedIndex(barIndex);
                }

                if (onSelect && data[barIndex]) {
                    setTimeout(() => {
                        onSelect(data[barIndex], barIndex);
                    }, 0);
                }

                // Snap if needed
                const selectedBarCenter =
                    getBarPosition(barIndex) + barWidth / 2;
                const selectionZoneCenter =
                    selectionZoneLeft +
                    SELECTION_ZONE_WIDTH / 2 -
                    CENTERING_OFFSET;
                const selectedBarScreenPosition =
                    selectedBarCenter - currentScrollOffset;
                const misalignment = Math.abs(
                    selectedBarScreenPosition - selectionZoneCenter,
                );

                if (misalignment > 3 && !isUserScrollingRef.current) {
                    setTimeout(() => {
                        if (
                            !isUserScrollingRef.current &&
                            !isAdjustingRef.current
                        ) {
                            snapToBar(barIndex);
                        }
                    }, 100);
                }

                scrollVelocityRef.current = 0;
            }, 100);
        },
        [
            data,
            selectionZoneLeft,
            getBarPosition,
            onSelect,
            snapToBar,
            findClosestBarIndex,
            barWidth,
        ],
    );

    return {
        scrollViewRef,
        scrollOffsetRef,
        isUserScrollingRef,
        isAdjustingRef,
        handleScrollBeginDrag,
        handleScroll,
        handleMomentumScrollEnd,
        snapToBar,
        findClosestBarIndex,
    };
};
