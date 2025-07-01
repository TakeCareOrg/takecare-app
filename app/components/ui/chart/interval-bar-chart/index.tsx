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
    DEFAULT_REFERENCE_LINES,
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

export type IntervalType = "hours" | "weekdays" | "months";

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
    referenceLines = DEFAULT_REFERENCE_LINES,
    buffer = DEFAULT_BUFFER,
    height = DEFAULT_HEIGHT,
    emptyBarColor = "#2A2A2A",
    onSelect,
    dynamicColors,
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
        (value: number, originalColor?: string) => {
            const parsedDynamicColors = stableDynamicColors
                ? JSON.parse(stableDynamicColors)
                : null;
            const parsedReferenceLines = JSON.parse(stableReferenceLines);

            if (!parsedDynamicColors) {
                return originalColor || "#5B7BFB";
            }

            if (!parsedReferenceLines || parsedReferenceLines.length === 0) {
                return originalColor || parsedDynamicColors.belowFirstReference;
            }

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
        },
        [stableDynamicColors, stableReferenceLines],
    );

    // Process data to ensure all intervals are present
    const processedData = useMemo(() => {
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
                        day: existingData.label,
                        value: existingData.value,
                        color: getDynamicColor(
                            existingData.value,
                            existingData.color,
                        ),
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
        getDynamicColor,
        // Create stable dependency from data
        data
            .map(
                (item) =>
                    `${item.intervalKey}:${item.value}:${item.color || ""}`,
            )
            .join("|"),
    ]);

    // Memoize data length for stable comparison
    const dataLength = useMemo(() => processedData.length, [processedData]);

    const [visibleIndices, setVisibleIndices] = useState<{
        start: number;
        end: number;
    }>(() => {
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
        const initialIndex = INTERVAL_CONFIGS[intervalType].keys.length - 1;
        return initialIndex;
    });
    const [currentScrollOffset, setCurrentScrollOffset] = useState(0);

    const isAdjustingRef = useRef(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollOffsetRef = useRef(0);
    const isInitializedRef = useRef(false);
    const isUserScrollingRef = useRef(false);

    const animatedPositions = useMemo(
        () => referenceLines.map(() => new Animated.Value(0)),
        [referenceLines.length],
    );

    const chartHeight = useMemo(() => {
        const availableHeight = height - PADDING_TOP - PADDING_BOTTOM;
        return Math.min(
            MAX_CHART_HEIGHT,
            Math.max(MIN_CHART_HEIGHT, availableHeight),
        );
    }, [height]);

    const contentWidth = useMemo(() => {
        const barsWidth = dataLength * (BAR_WIDTH + BAR_GAP);
        // Add some padding for smooth scrolling
        const minPadding =
            viewportWidth > 0 ? viewportWidth / 2 : SELECTION_ZONE_WIDTH / 2;
        return barsWidth + minPadding;
    }, [dataLength, viewportWidth]);

    const dynamicMaxValue = useMemo(() => {
        if (providedMaxValue) {
            return providedMaxValue;
        }

        const visibleData = processedData.slice(
            visibleIndices.start,
            visibleIndices.end + 1,
        );

        const nonZeroValues = visibleData
            .map((item) => item.value)
            .filter((value) => value > 0);

        const highestDataValue =
            nonZeroValues.length > 0 ? Math.max(...nonZeroValues) : 1;

        const highestReferenceValue =
            referenceLines.length > 0
                ? Math.max(...referenceLines.map((line) => line.value))
                : 0;

        const baseMaxValue = Math.max(highestDataValue, highestReferenceValue);

        if (referenceLines.length > 0) {
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
        referenceLines,
    ]);

    const animateReferenceLines = useCallback(() => {
        const animations = referenceLines.map((line, index) => {
            const position = (line.value / dynamicMaxValue) * chartHeight;
            const cappedPosition = Math.min(position, chartHeight);

            return Animated.timing(animatedPositions[index], {
                toValue: cappedPosition,
                duration: ANIMATION_DURATION,
                useNativeDriver: false,
            });
        });

        Animated.parallel(animations).start();
    }, [dynamicMaxValue, chartHeight, referenceLines, animatedPositions]);

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
                        (BAR_WIDTH + BAR_GAP),
                );
                const startIndex = Math.max(
                    0,
                    Math.floor(currentScrollOffset / (BAR_WIDTH + BAR_GAP)),
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
                return index;
            } else {
                return prevIndex;
            }
        });
    }, []);

    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const width = event.nativeEvent.layout.width;
            setViewportWidth(width);

            if (width > 0) {
                const currentDataLength =
                    INTERVAL_CONFIGS[intervalType].keys.length;
                const barsPerScreen = Math.floor(width / (BAR_WIDTH + BAR_GAP));
                setVisibleIndices({
                    start: 0,
                    end: Math.min(barsPerScreen - 1, currentDataLength - 1),
                });
            }
        },
        [intervalType],
    );

    const initializeScrollPosition = useCallback(() => {
        const currentDataLength = INTERVAL_CONFIGS[intervalType].keys.length;

        if (viewportWidth > 0 && !isInitializedRef.current) {
            isInitializedRef.current = true;

            const barsPerScreen = Math.floor(
                viewportWidth / (BAR_WIDTH + BAR_GAP),
            );
            const initialStartIndex = Math.max(
                0,
                currentDataLength - barsPerScreen,
            );
            const initialEndIndex = currentDataLength - 1;

            setVisibleIndices({
                start: initialStartIndex,
                end: initialEndIndex,
            });

            const targetIndex = currentDataLength - 1;
            const barCenter =
                targetIndex * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
            const viewportCenter = viewportWidth / 2;
            const scrollToOffset = Math.max(0, barCenter - viewportCenter);

            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: scrollToOffset,
                    animated: false,
                });
                setSelectedBarIndex(targetIndex);
                setCurrentScrollOffset(scrollToOffset);
            }, RENDER_DELAY);
        }
    }, [viewportWidth, intervalType]);

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
        const currentDataLength = INTERVAL_CONFIGS[intervalType].keys.length;
        const initialLength = Math.min(5, currentDataLength);
        setVisibleIndices({
            start: Math.max(0, currentDataLength - initialLength),
            end: Math.max(0, currentDataLength - 1),
        });
        setSelectedBarIndex(Math.max(0, currentDataLength - 1));
    }, [intervalType]);

    return (
        <View
            style={[styles.container]}
            onLayout={handleLayout}
        >
            <View
                style={[
                    styles.chartAreaContainer,
                    {
                        paddingRight: RIGHT_PADDING_WIDTH,
                        height: height - PADDING_TOP,
                        marginTop: 90, // Add top margin to make space for info bubble
                    },
                ]}
            >
                <SharedReferenceLines
                    referenceLines={referenceLines}
                    animatedPositions={animatedPositions}
                    rightPaddingWidth={RIGHT_PADDING_WIDTH}
                    paddingBottom={PADDING_BOTTOM}
                />

                <IntervalProgressBars
                    data={processedData}
                    selectedBarIndex={selectedBarIndex}
                    dynamicMaxValue={dynamicMaxValue}
                    chartHeight={chartHeight}
                    contentWidth={contentWidth}
                    scrollViewRef={scrollViewRef}
                    onScroll={handleScroll}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    onBarPress={handleBarPress}
                    onScrollBeginDrag={handleScrollBeginDrag}
                    barWidth={BAR_WIDTH}
                    barGap={BAR_GAP}
                    barActualWidth={10}
                    barBorderRadius={5}
                    paddingBottom={PADDING_BOTTOM}
                    intervalType={intervalType}
                    formatValue={(value) => `${value}`}
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
