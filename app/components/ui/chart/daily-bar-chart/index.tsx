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
import { LABEL_WIDTH_PADDING, LABEL_WIDTH_PX_PER_CHAR } from "./constants";
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
    const [viewportWidth, setViewportWidth] = useState(0);

    const processedData = useMemo(() => {
        let dataToProcess = data;

        if (shouldFillMissingDays) {
            dataToProcess = fillMissingDays(
                data,
                emptyDayColor,
                dynamicColors,
                referenceLines,
            );
        }

        // Calculate how many bars can fit in viewport
        if (viewportWidth > 0) {
            const barsPerScreen = Math.floor(
                viewportWidth / (BAR_WIDTH + BAR_GAP),
            );

            // If we don't have enough data to fill the screen, pad with empty bars at the beginning
            if (dataToProcess.length < barsPerScreen) {
                const missingBars = barsPerScreen - dataToProcess.length;
                const paddingBars = Array.from(
                    { length: missingBars },
                    (_, index) => {
                        // Generate dates going backwards from the first data point or today
                        const baseDate =
                            dataToProcess.length > 0 &&
                            dataToProcess[0].startDate
                                ? new Date(dataToProcess[0].startDate)
                                : new Date();
                        const date = new Date(baseDate);
                        date.setDate(date.getDate() - (missingBars - index));

                        return {
                            id: `padding-${index}`,
                            day: date.getDate().toString().padStart(2, "0"),
                            value: 0,
                            color: emptyDayColor,
                            startDate: date.toISOString(),
                        };
                    },
                ) as typeof dataToProcess;

                dataToProcess = [...paddingBars, ...dataToProcess];
            }
        } else if (dataToProcess.length === 0) {
            // If no data at all, generate 7 days of empty data
            const today = new Date();
            dataToProcess = Array.from({ length: 7 }, (_, index) => {
                const date = new Date(today);
                date.setDate(date.getDate() - (6 - index));
                return {
                    id: `empty-${index}`,
                    day: date.getDate().toString().padStart(2, "0"),
                    value: 0,
                    color: emptyDayColor,
                    startDate: date.toISOString(),
                };
            }) as typeof data;
        }

        return dataToProcess;
    }, [
        data,
        shouldFillMissingDays,
        emptyDayColor,
        dynamicColors,
        referenceLines,
        viewportWidth,
    ]);

    // Calculate dynamic label width based on reference lines
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

    const { chartHeight, paddingTop, paddingBottom } = useChartDimensions({
        height,
    });

    const { visibleIndices, setVisibleIndices } = useVisibleIndices({
        dataLength: processedData.length,
        initialLength: 5,
    });

    const calculatedMaxValue = useDynamicMaxValue({
        data: processedData,
        visibleIndices,
        providedMaxValue,
        referenceLines,
        buffer,
    });

    // Use state to control when we actually trigger re-renders
    const [dynamicMaxValue, setDynamicMaxValue] = useState(calculatedMaxValue);
    const maxValueRef = React.useRef(calculatedMaxValue);

    // Only update state if the value actually changed
    React.useEffect(() => {
        if (maxValueRef.current !== calculatedMaxValue) {
            maxValueRef.current = calculatedMaxValue;
            setDynamicMaxValue(calculatedMaxValue);
        }
    }, [calculatedMaxValue, visibleIndices]);

    const { animatedPositions, animateReferenceLines } =
        useReferenceLineAnimation({
            referenceLines,
            dynamicMaxValue,
            chartHeight,
        });

    // Keep the ref updated
    const animateReferenceLinesRef = React.useRef(animateReferenceLines);
    React.useEffect(() => {
        animateReferenceLinesRef.current = animateReferenceLines;
    }, [animateReferenceLines]);

    // Animate reference lines when dynamicMaxValue changes
    const previousAnimationMaxValueRef = React.useRef(dynamicMaxValue);
    useEffect(() => {
        if (previousAnimationMaxValueRef.current !== dynamicMaxValue) {
            previousAnimationMaxValueRef.current = dynamicMaxValue;
            animateReferenceLinesRef.current();
        }
    }, [dynamicMaxValue]);

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
        rightPaddingWidth: labelWidth,
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
                          (viewportWidth - labelWidth),
                  )
                : SELECTION_ZONE_WIDTH / 2;

        return barsWidth + dividersWidth + minPadding;
    }, [processedData, viewportWidth, selectionZoneLeft, labelWidth]);

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

    // Update visible indices based on current scroll position
    const updateVisibleIndices = useCallback(() => {
        if (viewportWidth > 0) {
            const scrollOffset = scrollOffsetRef.current;
            const barsPerScreen = Math.floor(
                viewportWidth / (BAR_WIDTH + BAR_GAP),
            );

            // Calculate which bars are currently visible
            let firstVisibleIndex = 0;
            for (let i = 0; i < processedData.length; i++) {
                const barPos = getBarPosition(i);
                if (barPos >= scrollOffset) {
                    firstVisibleIndex = i;
                    break;
                }
            }

            const lastVisibleIndex = Math.min(
                firstVisibleIndex + barsPerScreen - 1,
                processedData.length - 1,
            );

            // Only update if indices actually changed
            setVisibleIndices((prev) => {
                if (
                    prev.start !== firstVisibleIndex ||
                    prev.end !== lastVisibleIndex
                ) {
                    return {
                        start: firstVisibleIndex,
                        end: lastVisibleIndex,
                    };
                }
                return prev;
            });
        }
    }, [
        viewportWidth,
        processedData,
        getBarPosition,
        setVisibleIndices,
        scrollOffsetRef,
    ]);

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
                viewportWidth - labelWidth - SELECTION_ZONE_WIDTH;
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

    // Wrap handleMomentumScrollEnd to update selection and visible indices
    const updateTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const onMomentumScrollEnd = useCallback(
        (event?: ScrollEvent) => {
            handleMomentumScrollEnd(event, setSelectedBarIndex);

            // Debounce the visible indices update to avoid multiple rapid updates
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            updateTimeoutRef.current = setTimeout(() => {
                updateVisibleIndices();
                updateTimeoutRef.current = null;
            }, 150); // Wait 150ms after scroll ends before updating
        },
        [handleMomentumScrollEnd, setSelectedBarIndex, updateVisibleIndices],
    );

    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const width = event.nativeEvent.layout.width;
            setViewportWidth(width);

            if (width > 0) {
                const barsPerScreen = Math.floor(width / (BAR_WIDTH + BAR_GAP));
                // Initialize with the LAST bars (most recent data) instead of first
                const lastIndex = processedData.length - 1;
                const firstIndex = Math.max(0, lastIndex - barsPerScreen + 1);
                setVisibleIndices({
                    start: firstIndex,
                    end: lastIndex,
                });
            }
        },
        [processedData.length, setVisibleIndices],
    );

    // Initialize scroll position (simplified version)
    useEffect(() => {
        // Wait until we have data before initializing scroll
        if (
            viewportWidth > 0 &&
            selectionZoneLeft === null &&
            processedData.length > 0
        ) {
            const rightEdgePosition =
                viewportWidth - labelWidth - SELECTION_ZONE_WIDTH;
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

                // Manually update scrollOffsetRef since scrollTo doesn't trigger onScroll immediately
                scrollOffsetRef.current = scrollToOffset;

                setSelectedBarIndex(targetIndex);

                if (onSelect && processedData[targetIndex]) {
                    onSelect(processedData[targetIndex], targetIndex);
                }

                // Update visible indices after a small delay to ensure scroll position is set
                setTimeout(() => {
                    updateVisibleIndices();
                }, 50);
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
        updateVisibleIndices,
        scrollOffsetRef,
        contentWidth,
    ]);

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
