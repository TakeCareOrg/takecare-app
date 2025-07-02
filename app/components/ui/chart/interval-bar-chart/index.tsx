import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Animated,
    LayoutChangeEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import {
    ANIMATION_DURATION,
    BAR_GAP,
    BAR_WIDTH,
    DEFAULT_BUFFER,
    DEFAULT_HEIGHT,
    MAX_CHART_HEIGHT,
    MIN_CHART_HEIGHT,
    PADDING_BOTTOM,
    PADDING_TOP,
    REFERENCE_LINE_BUFFER,
    RENDER_DELAY,
    RIGHT_PADDING_WIDTH,
    SELECTION_ZONE_WIDTH,
} from "../daily-bar-chart/constants";
import { ReferenceLines as SharedReferenceLines } from "../shared/reference-lines";
import {
    IntervalProgressBars,
    IntervalBarDataItem as SharedIntervalBarDataItem,
} from "./interval-progress-bars";

export type IntervalType = "hours" | "weekdays" | "31days" | "months";

export interface IntervalBarDataItem {
    label: string; // "00", "01", ..., "23" for hours | "Mon", "Tue", ... for weekdays | "Jan", "Feb", ... for months
    value: number;
    color?: string;
    intervalKey: string; // "0", "1", ..., "23" for hours | "monday", "tuesday", ... for weekdays | "january", "february", ... for months
}

interface IntervalBarChartProps {
    data: IntervalBarDataItem[];
    intervalType: IntervalType;
    maxValue?: number;
    referenceLines?: { value: number; label: string }[];
    buffer?: number;
    height?: number;
    emptyBarColor?: string;
    onSelect?: (selectedData: IntervalBarDataItem, index: number) => void;
    dynamicColors?: {
        belowFirstReference: string;
        aboveFirstReference: string;
        aboveSecondReference?: string;
    };
    /** Override bar width - if not provided, will be calculated automatically */
    barWidth?: number;
    /** Override bar gap - if not provided, will be calculated automatically */
    barGap?: number;
    /** Show average line based on visible data */
    showAverageLine?: boolean;
    /** Color of the average line */
    averageLineColor?: string;
    /** Color of the selection line */
    selectionLineColor?: string;
    /** Single color for all bars (overrides dynamic colors if provided) */
    barColor?: string;
}

// Default interval configurations
const INTERVAL_CONFIGS = {
    hours: {
        labels: Array.from({ length: 24 }, (_, i) =>
            i.toString().padStart(2, "0"),
        ),
        keys: Array.from({ length: 24 }, (_, i) => i.toString()),
    },
    weekdays: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        keys: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ],
    },
    "31days": {
        labels: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
        keys: Array.from({ length: 31 }, (_, i) => `day-${i + 1}`),
    },
    months: {
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        keys: [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
        ],
    },
};

export const IntervalBarChart = ({
    data,
    intervalType,
    maxValue: providedMaxValue,
    referenceLines = [], // Pas de lignes par défaut
    buffer = DEFAULT_BUFFER,
    height = DEFAULT_HEIGHT,
    emptyBarColor = "#2A2A2A",
    onSelect,
    dynamicColors,
    barWidth: customBarWidth,
    barGap: customBarGap,
    showAverageLine = false,
    averageLineColor = "#FFA500", 
    selectionLineColor = "#5B7BFB",
    barColor,
}: IntervalBarChartProps) => {
    // Memoize the reference lines dependency for stable comparison
    const stableReferenceLines = useMemo(() => {
        return JSON.stringify(
            referenceLines.map((line) => ({
                value: line.value,
                label: line.label,
            })),
        );
    }, [referenceLines]);

    // Memoize dynamic colors for stable comparison
    const stableDynamicColors = useMemo(() => {
        return JSON.stringify(dynamicColors);
    }, [dynamicColors]);

    // Calculate dynamic color for a bar based on reference thresholds
    const getDynamicColor = useCallback(
        (value: number, originalColor?: string, averageValue?: number) => {
            // If barColor is provided, use it for all non-empty bars
            if (barColor && value > 0) {
                return barColor;
            }

            const parsedDynamicColors = stableDynamicColors
                ? JSON.parse(stableDynamicColors)
                : null;
            const parsedReferenceLines = JSON.parse(stableReferenceLines);

            if (!parsedDynamicColors) {
                return originalColor || "#5B7BFB";
            }

            // If we have static reference lines, use the original logic
            if (parsedReferenceLines && parsedReferenceLines.length > 0) {
                const sortedReferences = [...parsedReferenceLines].sort(
                    (a, b) => a.value - b.value,
                );
                const firstReference = sortedReferences[0]?.value || 0;
                const secondReference = sortedReferences[1]?.value || null;

                if (secondReference && value >= secondReference) {
                    return (
                        parsedDynamicColors.aboveSecondReference ||
                        parsedDynamicColors.aboveFirstReference
                    );
                } else if (value >= firstReference) {
                    return parsedDynamicColors.aboveFirstReference;
                } else {
                    return parsedDynamicColors.belowFirstReference;
                }
            }

            // If we only have average line and no static references, use average
            if (showAverageLine && averageValue) {
                if (value >= averageValue) {
                    return parsedDynamicColors.aboveFirstReference;
                } else {
                    return parsedDynamicColors.belowFirstReference;
                }
            }

            // Fallback to original color
            return originalColor || "#5B7BFB";
        },
        [stableDynamicColors, stableReferenceLines, showAverageLine, barColor],
    );

    // Process data to ensure all intervals are present (without dynamic colors first)
    const baseProcessedData = useMemo(() => {
        // For weekdays, 31days, and months, use the actual data order instead of static config
        if (intervalType === "weekdays" || intervalType === "31days" || intervalType === "months") {
            // Just return the data as-is since it's already in the correct order from processing functions
            return data.map(item => ({
                day: item.label,
                value: item.value,
                color: item.color || "#5B7BFB",
                intervalKey: item.intervalKey,
            }));
        }

        // For other interval types (hours), use the static config as before
        const config = INTERVAL_CONFIGS[intervalType];
        const dataMap = new Map();

        // Map existing data by intervalKey
        data.forEach((item) => {
            dataMap.set(item.intervalKey, item);
        });

        // Create complete dataset with all intervals
        const result: SharedIntervalBarDataItem[] = config.keys.map(
            (key, index) => {
                const existingData = dataMap.get(key);

                if (existingData) {
                    return {
                        day: config.labels[index], // Use config label for consistency
                        value: existingData.value,
                        color: existingData.color || "#5B7BFB", // Use original color for now
                        intervalKey: existingData.intervalKey,
                    };
                } else {
                    return {
                        day: config.labels[index],
                        value: 0,
                        color: emptyBarColor,
                        intervalKey: key,
                    };
                }
            },
        );

        return result;
    }, [
        intervalType,
        emptyBarColor,
        // Create stable dependency from data
        data
            .map(
                (item) =>
                    `${item.intervalKey}:${item.value}:${item.color || ""}:${item.label || ""}`,
            )
            .join("|"),
    ]);

    // Memoize data length for stable comparison
    const dataLength = useMemo(() => baseProcessedData.length, [baseProcessedData]);

    const [visibleIndices, setVisibleIndices] = useState<{
        start: number;
        end: number;
    }>(() => {
        // For weekdays, 31days, and months, we always show all data
        if (intervalType === "weekdays" || intervalType === "31days" || intervalType === "months") {
            return {
                start: 0,
                end: Math.max(0, data.length - 1),
            };
        }
        
        const initialLength = Math.min(
            5,
            INTERVAL_CONFIGS[intervalType].keys.length,
        );
        return {
            start: Math.max(
                0,
                INTERVAL_CONFIGS[intervalType].keys.length - initialLength,
            ),
            end: Math.max(0, INTERVAL_CONFIGS[intervalType].keys.length - 1),
        };
    });

    const [viewportWidth, setViewportWidth] = useState(0);
    const [selectedBarIndex, setSelectedBarIndex] = useState(() => {
        return -1; // Start with no selection
    });
    const [currentScrollOffset, setCurrentScrollOffset] = useState(0);
    const [hasActiveSelection, setHasActiveSelection] = useState(false);

    const isAdjustingRef = useRef(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollOffsetRef = useRef(0);
    const isInitializedRef = useRef(false);
    const isUserScrollingRef = useRef(false);

    const chartHeight = useMemo(() => {
        const availableHeight = height - PADDING_TOP - PADDING_BOTTOM;
        return Math.min(
            MAX_CHART_HEIGHT,
            Math.max(MIN_CHART_HEIGHT, availableHeight),
        );
    }, [height]);

    // Dynamic bar configuration based on interval type
    const barConfig = useMemo(() => {
        // If custom bar dimensions are provided, use them
        if (customBarWidth !== undefined && customBarGap !== undefined) {
            return {
                barWidth: customBarWidth,
                barGap: customBarGap,
                barActualWidth: Math.max(2, customBarWidth - 2), // Leave some margin for bar styling
            };
        }

        if (intervalType === "hours") {
            if (viewportWidth > 0) {
                const availableWidth = viewportWidth - RIGHT_PADDING_WIDTH - 5; // Minimal margin
                const totalBars = 24;
                
                const totalWidthPerBar = availableWidth / totalBars;
                const barGap = Math.max(1, Math.floor(totalWidthPerBar * 0.15)); // 15% for gaps
                const barWidth = Math.floor(totalWidthPerBar);
                const barActualWidth = Math.max(2, barWidth - barGap); // Minimum 2px visible width
                                
                return {
                    barWidth,
                    barGap,
                    barActualWidth,
                };
            } else {
                // Fallback when viewportWidth not available yet
                return {
                    barWidth: 12,
                    barGap: 1,
                    barActualWidth: 8,
                };
            }
        } else {
            // For other intervals: use standard sizes from constants
            return {
                barWidth: BAR_WIDTH,
                barGap: BAR_GAP,
                barActualWidth: 10,
            };
        }
    }, [intervalType, viewportWidth, customBarWidth, customBarGap]);

    const contentWidth = useMemo(() => {
        // Use actual data length for dynamic intervals
        const actualDataLength = (intervalType === "weekdays" || intervalType === "31days" || intervalType === "months") 
            ? data.length 
            : dataLength;
        
        // For hours mode, calculate exact width needed for all 24 bars
        if (intervalType === "hours") {
            const barsWidth = actualDataLength * (barConfig.barWidth + barConfig.barGap);
            // Remove the last gap since there's no bar after the last one
            return barsWidth - barConfig.barGap;
        }
        // Add some padding for smooth scrolling for other modes
        const barsWidth = actualDataLength * (barConfig.barWidth + barConfig.barGap);
        const minPadding =
            viewportWidth > 0 ? viewportWidth / 2 : SELECTION_ZONE_WIDTH / 2;
        return barsWidth + minPadding;
    }, [dataLength, data.length, viewportWidth, barConfig, intervalType]);

    // Calculate average from visible data for coloring and reference lines
    const visibleDataAverage = useMemo(() => {
        const visibleData = baseProcessedData.slice(
            visibleIndices.start,
            visibleIndices.end + 1,
        );

        const nonZeroValues = visibleData
            .map((item: any) => item.value)
            .filter((value: any) => value > 0);

        if (nonZeroValues.length === 0) {
            return 0;
        }

        return nonZeroValues.reduce((sum: any, value: any) => sum + value, 0) / nonZeroValues.length;
    }, [baseProcessedData, visibleIndices.start, visibleIndices.end]);

    // Calculate dynamic average reference line based on visible data
    const averageReferenceLine = useMemo(() => {
        if (!showAverageLine || visibleDataAverage === 0) {
            return null;
        }

        return {
            value: Math.round(visibleDataAverage),
            label: `Avg`,
            color: averageLineColor,
            dashArray: [5, 5],
        };
    }, [showAverageLine, visibleDataAverage, averageLineColor]);

    // Combine reference lines with optional average line
    const allReferenceLines = useMemo(() => {
        const lines = [...referenceLines];
        
        if (averageReferenceLine) {
            lines.push(averageReferenceLine);
        }
        
        return lines;
    }, [referenceLines, averageReferenceLine]);

    // Final processed data with dynamic colors applied
    const processedData = useMemo(() => {
        return baseProcessedData.map(item => ({
            ...item,
            color: item.value > 0 
                ? getDynamicColor(item.value, item.color, visibleDataAverage)
                : item.color
        }));
    }, [baseProcessedData, getDynamicColor, visibleDataAverage]);

    const animatedPositions = useMemo(
        () => allReferenceLines.map(() => new Animated.Value(0)),
        [allReferenceLines.length],
    );

    const dynamicMaxValue = useMemo(() => {
        if (providedMaxValue) {
            return providedMaxValue;
        }

        const visibleData = processedData.slice(
            visibleIndices.start,
            visibleIndices.end + 1,
        );

        const nonZeroValues = visibleData
            .map((item: any) => item.value)
            .filter((value: any) => value > 0);

        const highestDataValue =
            nonZeroValues.length > 0 ? Math.max(...nonZeroValues) : 1;

        // Use all reference lines (including optional average)
        const highestReferenceValue =
            allReferenceLines.length > 0
                ? Math.max(...allReferenceLines.map((line: any) => line.value))
                : 0;

        const baseMaxValue = Math.max(highestDataValue, highestReferenceValue);

        if (allReferenceLines.length > 0) {
            const minRequiredValue =
                highestReferenceValue * (1 + REFERENCE_LINE_BUFFER / 100);

            if (highestDataValue > highestReferenceValue) {
                const dataWithBuffer =
                    baseMaxValue + (baseMaxValue * buffer) / 100;
                return Math.max(dataWithBuffer, minRequiredValue);
            } else {
                return Math.max(baseMaxValue, minRequiredValue);
            }
        } else {
            return baseMaxValue + (baseMaxValue * buffer) / 100;
        }
    }, [
        processedData,
        providedMaxValue,
        buffer,
        visibleIndices.start,
        visibleIndices.end,
        allReferenceLines,
    ]);

    const animateReferenceLines = useCallback(() => {
        const animations = allReferenceLines.map((line: any, index: any) => {
            const position = (line.value / dynamicMaxValue) * chartHeight;
            const cappedPosition = Math.min(position, chartHeight);

            return Animated.timing(animatedPositions[index], {
                toValue: cappedPosition,
                duration: ANIMATION_DURATION,
                useNativeDriver: false,
            });
        });

        Animated.parallel(animations).start();
    }, [dynamicMaxValue, chartHeight, allReferenceLines, animatedPositions]);

    useMemo(() => {
        animateReferenceLines();
    }, [animateReferenceLines]);

    // Simplified scroll handlers since selection logic is now in IntervalProgressBars
    const handleScrollBeginDrag = useCallback(() => {
        isUserScrollingRef.current = true;
    }, []);

    const handleScroll = useCallback((event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        scrollOffsetRef.current = offsetX;
        setCurrentScrollOffset(offsetX);
        isUserScrollingRef.current = true;
    }, []);

    const handleMomentumScrollEnd = useCallback(
        (event?: any) => {
            if (isAdjustingRef.current) {
                return;
            }

            setTimeout(() => {
                isUserScrollingRef.current = false;

                // Only update visible indices for performance optimization
                const currentScrollOffset = scrollOffsetRef.current;
                const barsPerScreen = Math.floor(
                    (viewportWidth - RIGHT_PADDING_WIDTH) /
                        (barConfig.barWidth + barConfig.barGap),
                );
                const startIndex = Math.max(
                    0,
                    Math.floor(currentScrollOffset / (barConfig.barWidth + barConfig.barGap)),
                );
                const endIndex = Math.min(
                    processedData.length - 1,
                    startIndex + barsPerScreen,
                );
                setVisibleIndices({ start: startIndex, end: endIndex });
            }, 100);
        },
        [viewportWidth, processedData.length],
    );

    // Handle bar press for manual selection
    // This is the ONLY way to select a bar - no automatic selection on scroll
    const handleBarPress = useCallback((index: number) => {
        if (isAdjustingRef.current) {
            return;
        }

        // Update selected bar index for manual selection only
        setSelectedBarIndex((prevIndex) => {
            if (prevIndex !== index) {
                setHasActiveSelection(true);
                return index;
            } else {
                return prevIndex;
            }
        });
    }, []);

    // Handle tap outside to deselect
    const handleTapOutside = useCallback(() => {
        console.log("handleTapOutside called, hasActiveSelection:", hasActiveSelection);
        if (hasActiveSelection) {
            console.log("Deselecting bar due to tap outside");
            setHasActiveSelection(false);
            setSelectedBarIndex(-1); // Set to -1 to indicate no selection
        } else {
            console.log("No active selection, ignoring tap outside");
        }
    }, [hasActiveSelection]);

    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const width = event.nativeEvent.layout.width;
            setViewportWidth(width);

            if (width > 0) {
                if (intervalType === "weekdays") {
                    // For weekdays, show all available data
                    setVisibleIndices({
                        start: 0,
                        end: Math.max(0, data.length - 1),
                    });
                } else {
                    const currentDataLength = INTERVAL_CONFIGS[intervalType].keys.length;
                    const barsPerScreen = Math.floor(width / (barConfig.barWidth + barConfig.barGap));
                    setVisibleIndices({
                        start: 0,
                        end: Math.min(barsPerScreen - 1, currentDataLength - 1),
                    });
                }
            }
        },
        [intervalType, barConfig, data.length],
    );

    const initializeScrollPosition = useCallback(() => {
        const currentDataLength = (intervalType === "weekdays" || intervalType === "31days" || intervalType === "months")
            ? data.length 
            : INTERVAL_CONFIGS[intervalType].keys.length;

        if (viewportWidth > 0 && !isInitializedRef.current) {
            isInitializedRef.current = true;

            const barsPerScreen = Math.floor(
                viewportWidth / (barConfig.barWidth + barConfig.barGap),
            );
            
            // For hours mode, try to show all bars without scrolling
            let initialStartIndex, initialEndIndex, targetIndex, scrollToOffset;
            
            if (intervalType === "hours") {
                // Try to fit all 24 hours without scrolling
                initialStartIndex = 0;
                initialEndIndex = Math.min(currentDataLength - 1, 23);
                targetIndex = 12; // Start with noon selected
                scrollToOffset = 0; // No initial scroll for hours mode
            } else if (intervalType === "weekdays" || intervalType === "31days" || intervalType === "months") {
                // For dynamic intervals, show all data, target the last item (most recent)
                initialStartIndex = 0;
                initialEndIndex = Math.max(0, currentDataLength - 1);
                targetIndex = Math.max(0, currentDataLength - 1); // Select most recent (last item)
                scrollToOffset = 0; // No scroll needed for these modes
            } else {
                // Other modes: show recent data
                initialStartIndex = Math.max(0, currentDataLength - barsPerScreen);
                initialEndIndex = currentDataLength - 1;
                targetIndex = currentDataLength - 1;
                
                const barCenter =
                    targetIndex * (barConfig.barWidth + barConfig.barGap) + barConfig.barWidth / 2;
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
                // Don't auto-select a bar - wait for user interaction
                setCurrentScrollOffset(scrollToOffset);
            }, RENDER_DELAY);
        }
    }, [viewportWidth, intervalType, barConfig, data.length]);

    useEffect(() => {
        initializeScrollPosition();
    }, [initializeScrollPosition]);

    // Handle onSelect calls when selectedBarIndex changes
    useEffect(() => {
        if (
            isInitializedRef.current &&
            onSelect &&
            selectedBarIndex >= 0 &&
            selectedBarIndex < processedData.length
        ) {
            const selectedData = processedData[selectedBarIndex];
            const selectedItem: IntervalBarDataItem = {
                label: selectedData.day,
                value: selectedData.value,
                color: selectedData.color,
                intervalKey: (selectedData as any).intervalKey,
            };

            // Use a timeout to avoid calling onSelect during renders
            const timeoutId = setTimeout(() => {
                onSelect(selectedItem, selectedBarIndex);
            }, 50);

            return () => clearTimeout(timeoutId);
        }
    }, [selectedBarIndex]);

    useEffect(() => {
        isInitializedRef.current = false;
        
        if (intervalType === "weekdays" || intervalType === "31days" || intervalType === "months") {
            // For dynamic intervals, show all data
            setVisibleIndices({
                start: 0,
                end: Math.max(0, data.length - 1),
            });
        } else {
            // For other intervals (hours), use static config
            const currentDataLength = INTERVAL_CONFIGS[intervalType].keys.length;
            const initialLength = Math.min(5, currentDataLength);
            setVisibleIndices({
                start: Math.max(0, currentDataLength - initialLength),
                end: Math.max(0, currentDataLength - 1),
            });
        }
        
        setSelectedBarIndex(-1); // Reset to no selection
        setHasActiveSelection(false); // Reset active selection state
    }, [intervalType, data.length]);

    return (
        <View
            style={[styles.container, { height }]}
            onLayout={handleLayout}
        >
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
                />

                <IntervalProgressBars
                    data={processedData}
                    selectedBarIndex={hasActiveSelection ? selectedBarIndex : -1}
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
                    formatValue={(value) => intervalType === "hours" ? `${value} steps` : `${value}`}
                    currentScrollOffset={currentScrollOffset}
                    viewportWidth={viewportWidth}
                    labelIndices={intervalType === "hours" ? ["0", "6", "12", "18", "(h)"] : undefined}
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
        overflow: "visible", // Allow info bubble to show above
        zIndex: 1,
    },
});
