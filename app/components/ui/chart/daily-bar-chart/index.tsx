import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

import {
    // Constants
    BAR_GAP,
    BAR_WIDTH,
    CENTERING_OFFSET,
    // Types
    DailyBarDataItem,
    DEFAULT_BUFFER,
    DEFAULT_HEIGHT,
    DynamicColors,
    // Utils
    fillMissingDays,
    PADDING_TOP,
    ReferenceLine,
    RENDER_DELAY,
    RIGHT_PADDING_WIDTH,
    ScrollEvent,
    SELECTION_ZONE_WIDTH,
    // Hooks
    useBarPosition,
    useChartDimensions,
    useChartScroll,
    useChartSelection,
    useDynamicMaxValue,
    useReferenceLineAnimation,
    useVisibleIndices,
    YEAR_DIVIDER_WIDTH,
} from "../shared";
// Import des composants locaux (inchangés)
import { ProgressBars } from "./progress-bars";
import { ReferenceLines } from "./reference-lines";
import { SelectionZone } from "./selection-zone";

interface DailyBarChartProps {
    data: DailyBarDataItem[];
    maxValue?: number;
    referenceLines?: ReferenceLine[];
    buffer?: number;
    height?: number;
    fillMissingDays?: boolean;
    emptyDayColor?: string;
    onSelect?: (selectedData: DailyBarDataItem, index: number) => void;
    disableSnapping?: boolean;
    dynamicColors?: DynamicColors;
}

const DEFAULT_REFERENCE_LINES: ReferenceLine[] = [
    { value: 20, label: "20%", lineColor: "#3B5AFB", labelColor: "blue" },
    { value: 30, label: "30%", lineColor: "#3B5AFB", labelColor: "blue" },
];

export const DailyBarChart = ({
    data,
    maxValue: providedMaxValue,
    referenceLines = DEFAULT_REFERENCE_LINES,
    buffer = DEFAULT_BUFFER,
    height = DEFAULT_HEIGHT,
    fillMissingDays: shouldFillMissingDays = true,
    emptyDayColor = "#2A2A2A",
    onSelect,
    disableSnapping = false,
    dynamicColors,
}: DailyBarChartProps) => {
    const processedData = useMemo(() => {
        if (!shouldFillMissingDays) {
            return data;
        }
        return fillMissingDays(
            data,
            emptyDayColor,
            dynamicColors,
            referenceLines,
        );
    }, [
        data,
        shouldFillMissingDays,
        emptyDayColor,
        dynamicColors,
        referenceLines,
    ]);

    const { chartHeight, paddingTop, paddingBottom } = useChartDimensions({
        height,
    });

    const { visibleIndices, setVisibleIndices } = useVisibleIndices({
        dataLength: processedData.length,
        initialLength: 5,
    });

    const dynamicMaxValue = useDynamicMaxValue({
        data: processedData,
        visibleIndices,
        providedMaxValue,
        referenceLines,
        buffer,
    });

    const { animatedPositions, animateReferenceLines } =
        useReferenceLineAnimation({
            referenceLines,
            dynamicMaxValue,
            chartHeight,
        });

    useEffect(() => {
        animateReferenceLines();
    }, [animateReferenceLines]);

    const [viewportWidth, setViewportWidth] = useState(0);

    const { getBarPosition } = useBarPosition({
        data: processedData,
        barWidth: BAR_WIDTH,
        barGap: BAR_GAP,
        yearDividerWidth: YEAR_DIVIDER_WIDTH,
    });

    // Create the hook early to get selectionZoneLeft for contentWidth calculation
    const selectionHook = useChartSelection({
        data: processedData,
        viewportWidth,
        rightPaddingWidth: RIGHT_PADDING_WIDTH,
        getBarPosition,
        onSelect: undefined, // Will be set later
        snapToBar: () => {}, // Will be set later
        barWidth: BAR_WIDTH,
        isAdjustingRef: undefined, // Will be set later
    });

    const {
        selectedBarIndex,
        setSelectedBarIndex,
        selectionZoneLeft,
        setSelectionZoneLeft,
    } = selectionHook;

    const contentWidth = useMemo(() => {
        const barsWidth = processedData.length * (BAR_WIDTH + BAR_GAP);

        // Count year dividers
        let yearDividers = 0;
        for (let i = 1; i < processedData.length; i++) {
            const currentItem = processedData[i];
            const prevItem = processedData[i - 1];

            if (
                currentItem.startDate &&
                prevItem.startDate &&
                new Date(currentItem.startDate).getFullYear() !==
                    new Date(prevItem.startDate).getFullYear()
            ) {
                yearDividers++;
            }
        }

        const dividersWidth = yearDividers * YEAR_DIVIDER_WIDTH;
        const minPadding =
            selectionZoneLeft !== null
                ? Math.max(
                      0,
                      selectionZoneLeft +
                          SELECTION_ZONE_WIDTH / 2 -
                          (viewportWidth - RIGHT_PADDING_WIDTH),
                  )
                : SELECTION_ZONE_WIDTH / 2;

        return barsWidth + dividersWidth + minPadding;
    }, [processedData, viewportWidth, selectionZoneLeft]);

    const {
        scrollViewRef,
        scrollOffsetRef,
        handleScrollBeginDrag,
        handleScroll,
        handleMomentumScrollEnd,
        snapToBar,
        isAdjustingRef,
    } = useChartScroll({
        data: processedData,
        selectionZoneLeft,
        contentWidth,
        viewportWidth,
        getBarPosition,
        onSelect,
        disableSnapping,
        barWidth: BAR_WIDTH,
        barGap: BAR_GAP,
    });

    const handleBarPress = useCallback(
        (index: number, scrollOffsetRef: React.RefObject<number>) => {
            if (isAdjustingRef.current || selectionZoneLeft === null) return;

            // Update selection and trigger callback
            setSelectedBarIndex((prevIndex) => {
                if (prevIndex !== index) {
                    setTimeout(() => {
                        if (onSelect && processedData[index]) {
                            onSelect(processedData[index], index);
                        }
                    }, 0);
                }
                return index;
            });

            // Calculate positioning
            const currentScrollOffset = scrollOffsetRef.current;
            const barContentPosition = getBarPosition(index) + BAR_WIDTH / 2;
            const barScreenPosition = barContentPosition - currentScrollOffset;

            const idealZoneLeft =
                barScreenPosition - SELECTION_ZONE_WIDTH / 2 + CENTERING_OFFSET;

            const minZoneLeft = 0;
            const maxZoneLeft =
                viewportWidth - RIGHT_PADDING_WIDTH - SELECTION_ZONE_WIDTH;
            const clampedZoneLeft = Math.max(
                minZoneLeft,
                Math.min(maxZoneLeft, idealZoneLeft),
            );

            setSelectionZoneLeft(clampedZoneLeft);

            // Snap if zone was clamped
            if (Math.abs(clampedZoneLeft - idealZoneLeft) > 1) {
                setTimeout(() => {
                    snapToBar(index);
                }, 50);
            }
        },
        [
            viewportWidth,
            getBarPosition,
            onSelect,
            processedData,
            selectionZoneLeft,
            snapToBar,
            isAdjustingRef,
            setSelectionZoneLeft,
            setSelectedBarIndex,
        ],
    );

    // Wrap handleBarPress to use scrollOffsetRef
    const onBarPress = useCallback(
        (index: number) => {
            handleBarPress(index, scrollOffsetRef);
        },
        [handleBarPress, scrollOffsetRef],
    );

    // Wrap handleMomentumScrollEnd to update selection
    const onMomentumScrollEnd = useCallback(
        (event?: ScrollEvent) => {
            handleMomentumScrollEnd(event, setSelectedBarIndex);
        },
        [handleMomentumScrollEnd, setSelectedBarIndex],
    );

    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const width = event.nativeEvent.layout.width;
            setViewportWidth(width);

            if (width > 0) {
                const barsPerScreen = Math.floor(width / (BAR_WIDTH + BAR_GAP));
                setVisibleIndices({
                    start: 0,
                    end: Math.min(barsPerScreen - 1, processedData.length - 1),
                });
            }
        },
        [processedData.length, setVisibleIndices],
    );

    // Initialize scroll position (simplified version)
    useEffect(() => {
        if (viewportWidth > 0 && selectionZoneLeft === null) {
            const rightEdgePosition =
                viewportWidth - RIGHT_PADDING_WIDTH - SELECTION_ZONE_WIDTH;
            setSelectionZoneLeft(rightEdgePosition);

            const targetIndex = processedData.length - 1;
            const barCenter = getBarPosition(targetIndex) + BAR_WIDTH / 2;
            const selectionCenter =
                rightEdgePosition + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;
            const scrollToOffset = Math.max(0, barCenter - selectionCenter);

            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: scrollToOffset,
                    animated: false,
                });
                setSelectedBarIndex(targetIndex);

                if (onSelect && processedData[targetIndex]) {
                    onSelect(processedData[targetIndex], targetIndex);
                }
            }, RENDER_DELAY);
        }
    }, [
        viewportWidth,
        selectionZoneLeft,
        processedData,
        getBarPosition,
        onSelect,
        setSelectedBarIndex,
        scrollViewRef,
        setSelectionZoneLeft,
    ]);

    return (
        <View style={[styles.container, { height }]} onLayout={handleLayout}>
            <View
                style={[
                    styles.chartAreaContainer,
                    {
                        paddingRight: RIGHT_PADDING_WIDTH,
                        height: height - paddingTop,
                    },
                ]}
            >
                <ReferenceLines
                    referenceLines={referenceLines}
                    animatedPositions={animatedPositions}
                />

                <ProgressBars
                    data={processedData}
                    selectedBarIndex={selectedBarIndex}
                    dynamicMaxValue={dynamicMaxValue}
                    chartHeight={chartHeight}
                    contentWidth={contentWidth}
                    scrollViewRef={scrollViewRef}
                    onScroll={handleScroll}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onBarPress={onBarPress}
                    onScrollBeginDrag={handleScrollBeginDrag}
                />

                <SelectionZone
                    selectionZoneLeft={selectionZoneLeft}
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
