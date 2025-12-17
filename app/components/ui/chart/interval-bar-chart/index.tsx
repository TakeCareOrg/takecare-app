import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import {
    // Constants
    DEFAULT_BUFFER,
    DEFAULT_HEIGHT,
    // Types
    DynamicColors,
    // Utils
    getDynamicColor,
    INTERVAL_CONFIGS,
    IntervalBarDataItem,
    IntervalType,
    PADDING_BOTTOM,
    PADDING_TOP,
    ReferenceLine,
    RENDER_DELAY,
    RIGHT_PADDING_WIDTH,
    // Hooks
    useAverageLine,
    useChartDimensions,
    useDynamicMaxValue,
    useIntervalBarConfig,
    useIntervalData,
    useReferenceLineAnimation,
    useVisibleIndices,
} from "../shared";
import { ReferenceLines as SharedReferenceLines } from "../shared/reference-lines";
import { IntervalProgressBars } from "./interval-progress-bars";

export type { IntervalType };
export type { IntervalBarDataItem };

interface IntervalBarChartProps {
    data: IntervalBarDataItem[];
    intervalType: IntervalType;
    maxValue?: number;
    referenceLines?: { value: number; label: string }[];
    buffer?: number;
    height?: number;
    emptyBarColor?: string;
    onSelect?: (selectedData: IntervalBarDataItem, index: number) => void;
    dynamicColors?: DynamicColors;
    /** Override bar width - if not provided, will be calculated automatically */
    barWidth?: number;
    /** Override bar gap - if not provided, will be calculated automatically */
    barGap?: number;
    /** Show average line based on visible data */
    showAverageLine?: boolean;
    /** Custom average value to use instead of calculating from visible data */
    averageValue?: number;
    /** Color of the average line */
    averageLineColor?: string;
    /** Color of the selection line */
    selectionLineColor?: string;
    /** Single color for all bars (overrides dynamic colors if provided) */
    barColor?: string;
    /** Default color for reference lines (can be overridden per line) */
    referenceLineColor?: string;
    /** Color for reference line labels */
    referenceLabelColor?: string;
}

export const IntervalBarChart = ({
    data,
    intervalType,
    maxValue: providedMaxValue,
    referenceLines = [],
    buffer = DEFAULT_BUFFER,
    height = DEFAULT_HEIGHT,
    emptyBarColor = "#2A2A2A",
    onSelect,
    dynamicColors,
    barWidth: customBarWidth,
    barGap: customBarGap,
    showAverageLine = false,
    averageValue,
    averageLineColor = "#FFA500",
    selectionLineColor = "#5B7BFB",
    barColor,
    referenceLineColor = "#666666",
    referenceLabelColor = "#FFA500",
}: IntervalBarChartProps) => {
    const [viewportWidth, setViewportWidth] = useState(0);
    const [selectedBarIndex, setSelectedBarIndex] = useState(-1);
    const [currentScrollOffset, setCurrentScrollOffset] = useState(0);
    const [hasActiveSelection, setHasActiveSelection] = useState(false);

    const isInitializedRef = React.useRef(false);

    const { processedData: baseProcessedData } = useIntervalData({
        data,
        intervalType,
        emptyBarColor,
    });

    const { visibleIndices, setVisibleIndices } = useVisibleIndices({
        dataLength: baseProcessedData.length,
        initialLength:
            intervalType === "7days" ||
            intervalType === "31days" ||
            intervalType === "12months"
                ? data.length
                : 5,
    });

    const { averageReferenceLine, visibleDataAverage } = useAverageLine({
        showAverageLine,
        data: baseProcessedData,
        visibleIndices,
        averageValue,
        averageLineColor,
    });

    // Combine reference lines with optional average line
    const allReferenceLines = useMemo(() => {
        const lines: ReferenceLine[] = [...referenceLines];
        if (averageReferenceLine) {
            lines.push(averageReferenceLine);
        }
        return lines;
    }, [referenceLines, averageReferenceLine]);

    const processedData = useMemo(() => {
        return baseProcessedData.map((item) => ({
            ...item,
            color:
                item.value > 0
                    ? getDynamicColor(
                          item.value,
                          item.color,
                          dynamicColors,
                          allReferenceLines,
                          visibleDataAverage,
                          barColor,
                      )
                    : item.color,
        }));
    }, [
        baseProcessedData,
        allReferenceLines,
        dynamicColors,
        barColor,
        visibleDataAverage,
    ]);

    const { chartHeight } = useChartDimensions({
        height,
    });

    const barConfig = useIntervalBarConfig({
        intervalType,
        viewportWidth,
        customBarWidth,
        customBarGap,
    });

    const contentWidth = useMemo(() => {
        const actualDataLength =
            intervalType === "7days" ||
            intervalType === "31days" ||
            intervalType === "12months"
                ? data.length
                : baseProcessedData.length;

        if (intervalType === "24hours") {
            const barsWidth =
                actualDataLength * (barConfig.barWidth + barConfig.barGap);
            return barsWidth - barConfig.barGap;
        }

        const barsWidth =
            actualDataLength * (barConfig.barWidth + barConfig.barGap);
        const minPadding = viewportWidth > 0 ? viewportWidth / 2 : 0;
        return barsWidth + minPadding;
    }, [
        baseProcessedData.length,
        data.length,
        viewportWidth,
        barConfig,
        intervalType,
    ]);

    const dynamicMaxValue = useDynamicMaxValue({
        data: processedData,
        visibleIndices,
        providedMaxValue,
        referenceLines: allReferenceLines,
        buffer,
    });

    const { animatedPositions, animateReferenceLines } =
        useReferenceLineAnimation({
            referenceLines: allReferenceLines,
            dynamicMaxValue,
            chartHeight,
        });

    // Animate reference lines when dynamicMaxValue changes
    React.useEffect(() => {
        animateReferenceLines();
    }, [animateReferenceLines]);

    const scrollViewRef = React.useRef<ScrollView>(null);
    const scrollOffsetRef = React.useRef(0);
    const isUserScrollingRef = React.useRef(false);
    const isAdjustingRef = React.useRef(false);

    const handleScrollBeginDrag = useCallback(() => {
        isUserScrollingRef.current = true;
    }, []);

    const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            scrollOffsetRef.current = offsetX;
            setCurrentScrollOffset(offsetX);
            isUserScrollingRef.current = true;
        },
        [],
    );

    const handleMomentumScrollEnd = useCallback(() => {
        if (isAdjustingRef.current) {
            return;
        }

        setTimeout(() => {
            isUserScrollingRef.current = false;

            const currentScrollOffset = scrollOffsetRef.current;
            const barsPerScreen = Math.floor(
                (viewportWidth - RIGHT_PADDING_WIDTH) /
                    (barConfig.barWidth + barConfig.barGap),
            );
            const startIndex = Math.max(
                0,
                Math.floor(
                    currentScrollOffset /
                        (barConfig.barWidth + barConfig.barGap),
                ),
            );
            const endIndex = Math.min(
                processedData.length - 1,
                startIndex + barsPerScreen,
            );

            setVisibleIndices({ start: startIndex, end: endIndex });
        }, 100);
    }, [
        viewportWidth,
        barConfig.barWidth,
        barConfig.barGap,
        processedData.length,
        setVisibleIndices,
    ]);

    const handleBarPress = useCallback((index: number) => {
        if (isAdjustingRef.current) {
            return;
        }

        setSelectedBarIndex((prevIndex) => {
            if (prevIndex !== index) {
                setHasActiveSelection(true);
                return index;
            }
            return prevIndex;
        });
    }, []);

    const handleTapOutside = useCallback(() => {
        if (hasActiveSelection) {
            setHasActiveSelection(false);
            setSelectedBarIndex(-1);
        }
    }, [hasActiveSelection]);

    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const width = event.nativeEvent.layout.width;
            setViewportWidth(width);

            if (width > 0) {
                if (intervalType === "7days") {
                    setVisibleIndices({
                        start: 0,
                        end: Math.max(0, data.length - 1),
                    });
                } else {
                    const currentDataLength =
                        INTERVAL_CONFIGS[intervalType].keys.length;
                    const barsPerScreen = Math.floor(
                        width / (barConfig.barWidth + barConfig.barGap),
                    );
                    setVisibleIndices({
                        start: 0,
                        end: Math.min(barsPerScreen - 1, currentDataLength - 1),
                    });
                }
            }
        },
        [intervalType, barConfig, data.length, setVisibleIndices],
    );

    // Initialize scroll position
    useEffect(() => {
        const currentDataLength =
            intervalType === "7days" ||
            intervalType === "31days" ||
            intervalType === "12months"
                ? data.length
                : INTERVAL_CONFIGS[intervalType].keys.length;

        if (viewportWidth > 0 && !isInitializedRef.current) {
            isInitializedRef.current = true;

            const barsPerScreen = Math.floor(
                viewportWidth / (barConfig.barWidth + barConfig.barGap),
            );

            let initialStartIndex, initialEndIndex, scrollToOffset;

            if (intervalType === "24hours") {
                initialStartIndex = 0;
                initialEndIndex = Math.min(currentDataLength - 1, 23);
                scrollToOffset = 0;
            } else if (
                intervalType === "7days" ||
                intervalType === "31days" ||
                intervalType === "12months"
            ) {
                initialStartIndex = 0;
                initialEndIndex = Math.max(0, currentDataLength - 1);
                scrollToOffset = 0;
            } else {
                initialStartIndex = Math.max(
                    0,
                    currentDataLength - barsPerScreen,
                );
                initialEndIndex = currentDataLength - 1;
                const targetIndex = currentDataLength - 1;
                const barCenter =
                    targetIndex * (barConfig.barWidth + barConfig.barGap) +
                    barConfig.barWidth / 2;
                const viewportCenter = viewportWidth / 2;
                scrollToOffset = Math.max(0, barCenter - viewportCenter);
            }

            setVisibleIndices({
                start: initialStartIndex,
                end: initialEndIndex,
            });

            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: scrollToOffset,
                    animated: false,
                });
                setCurrentScrollOffset(scrollToOffset);
            }, RENDER_DELAY);
        }
    }, [
        viewportWidth,
        intervalType,
        barConfig,
        data.length,
        setVisibleIndices,
    ]);

    // Handle onSelect calls
    useEffect(() => {
        if (
            onSelect &&
            selectedBarIndex >= 0 &&
            selectedBarIndex < processedData.length
        ) {
            const selectedData = processedData[selectedBarIndex];
            const selectedItem: IntervalBarDataItem = {
                label: selectedData.day,
                value: selectedData.value,
                color: selectedData.color,
                intervalKey: selectedData.intervalKey || "",
            };

            const timeoutId = setTimeout(() => {
                onSelect(selectedItem, selectedBarIndex);
            }, 50);

            return () => clearTimeout(timeoutId);
        }
    }, [onSelect, processedData, selectedBarIndex]);

    // Reset on interval type change
    useEffect(() => {
        if (
            intervalType === "7days" ||
            intervalType === "31days" ||
            intervalType === "12months"
        ) {
            setVisibleIndices({
                start: 0,
                end: Math.max(0, data.length - 1),
            });
        } else {
            const currentDataLength =
                INTERVAL_CONFIGS[intervalType].keys.length;
            const initialLength = Math.min(5, currentDataLength);
            setVisibleIndices({
                start: Math.max(0, currentDataLength - initialLength),
                end: Math.max(0, currentDataLength - 1),
            });
        }

        setSelectedBarIndex(-1);
        setHasActiveSelection(false);
    }, [intervalType, data.length, setVisibleIndices]);

    return (
        <View style={[styles.container, { height }]} onLayout={handleLayout}>
            <View
                style={[
                    styles.chartAreaContainer,
                    {
                        paddingRight: RIGHT_PADDING_WIDTH,
                        height: height - PADDING_TOP - PADDING_BOTTOM,
                    },
                ]}
            >
                <SharedReferenceLines
                    referenceLines={allReferenceLines}
                    animatedPositions={animatedPositions}
                    rightPaddingWidth={RIGHT_PADDING_WIDTH}
                    paddingBottom={PADDING_BOTTOM}
                    chartHeight={chartHeight}
                    colors={{
                        line: referenceLineColor,
                        label: referenceLabelColor,
                    }}
                />

                <IntervalProgressBars
                    data={processedData}
                    selectedBarIndex={
                        hasActiveSelection ? selectedBarIndex : -1
                    }
                    dynamicMaxValue={dynamicMaxValue}
                    chartHeight={chartHeight}
                    contentWidth={contentWidth}
                    scrollViewRef={scrollViewRef}
                    onScroll={handleScroll}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    onBarPress={handleBarPress}
                    onScrollBeginDrag={handleScrollBeginDrag}
                    onTapOutside={handleTapOutside}
                    barWidth={barConfig.barWidth}
                    barGap={barConfig.barGap}
                    barActualWidth={barConfig.barActualWidth}
                    barBorderRadius={5}
                    paddingBottom={PADDING_BOTTOM}
                    selectionLineColor={selectionLineColor}
                    intervalType={intervalType}
                    formatValue={(value) =>
                        intervalType === "24hours"
                            ? `${value} steps`
                            : `${value}`
                    }
                    currentScrollOffset={currentScrollOffset}
                    viewportWidth={viewportWidth}
                    labelIndices={
                        intervalType === "24hours"
                            ? ["0", "6", "12", "18", "(h)"]
                            : undefined
                    }
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
        overflow: "visible",
        zIndex: 1,
    },
});
