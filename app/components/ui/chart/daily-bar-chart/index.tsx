//? Daily bar chart component for health data visualization (steps, calories, etc.)
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
import { eachDayOfInterval, parseISO, format } from "date-fns";

import {
    ADJUSTMENT_SENSITIVITY,
    ANIMATION_DURATION,
    BAR_GAP,
    BAR_WIDTH,
    CENTERING_OFFSET,
    DEFAULT_BUFFER,
    DEFAULT_HEIGHT,
    DEFAULT_REFERENCE_LINES,
    MAX_CHART_HEIGHT,
    MIN_CHART_HEIGHT,
    PADDING_BOTTOM,
    PADDING_TOP,
    RENDER_DELAY,
    RIGHT_PADDING_WIDTH,
    SELECTION_ZONE_WIDTH,
    YEAR_DIVIDER_WIDTH,
} from "./constants";
import { BarDataItem, ProgressBars } from "./progress-bars";
import { ReferenceLines } from "./reference-lines";
import { SelectionZone } from "./selection-zone";

interface DailyBarChartProps {
    data: BarDataItem[];
    maxValue?: number;
    referenceLines?: { value: number; label: string }[];
    buffer?: number;
    height?: number;
    fillMissingDays?: boolean;
    emptyDayColor?: string;
    onSelect?: (selectedData: BarDataItem, index: number) => void;
}

export const DailyBarChart = ({
    data,
    maxValue: providedMaxValue,
    referenceLines = DEFAULT_REFERENCE_LINES,
    buffer = DEFAULT_BUFFER,
    height = DEFAULT_HEIGHT,
    fillMissingDays = true,
    emptyDayColor = "#2A2A2A",
    onSelect,
}: DailyBarChartProps) => {
    
    // Fill missing days with empty entries
    const processedData = useMemo(() => {
        if (!fillMissingDays || data.length === 0) {
            return data;
        }

        const dataWithDates = data.filter(item => 'startDate' in item);
        
        if (dataWithDates.length === 0) {
            return data;
        }

        const sortedData = [...dataWithDates].sort((a, b) => 
            new Date((a as any).startDate).getTime() - new Date((b as any).startDate).getTime()
        );
        
        const firstDate = parseISO((sortedData[0] as any).startDate);
        const lastDate = new Date();
        
        const dataMap = new Map();
        dataWithDates.forEach(item => {
            const dateKey = format(parseISO((item as any).startDate), 'yyyy-MM-dd');
            dataMap.set(dateKey, item);
        });
        
        const allDays = eachDayOfInterval({
            start: firstDate,
            end: lastDate
        });
        
        return allDays.map(date => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const existingData = dataMap.get(dateKey);
            
            if (existingData) {
                return existingData;
            } else {
                return {
                    day: format(date, 'dd'),
                    value: 0,
                    color: emptyDayColor,
                    startDate: format(date, 'yyyy-MM-dd'),
                };
            }
        });
    }, [data, fillMissingDays, emptyDayColor]);

    // State
    const [visibleIndices, setVisibleIndices] = useState<{
        start: number;
        end: number;
    }>(() => {
        // Initialize with last bars for proper scale calculation
        const initialLength = Math.min(5, processedData.length);
        return {
            start: Math.max(0, processedData.length - initialLength),
            end: Math.max(0, processedData.length - 1)
        };
    });
    const [viewportWidth, setViewportWidth] = useState(0);
    const [selectedBarIndex, setSelectedBarIndex] = useState(processedData.length - 1);
    const [selectionZoneLeft, setSelectionZoneLeft] = useState<number | null>(
        null,
    );

    // Refs
    const isAdjustingRef = useRef(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollOffsetRef = useRef(0);
    const isInitializedRef = useRef(false);

    // Create animated values for reference lines (stable reference)
    const animatedPositions = useMemo(
        () => referenceLines.map(() => new Animated.Value(0)),
        [referenceLines.length],
    );

    // Chart height with limits
    const chartHeight = useMemo(() => {
        const availableHeight = height - PADDING_TOP - PADDING_BOTTOM;
        return Math.min(MAX_CHART_HEIGHT, Math.max(MIN_CHART_HEIGHT, availableHeight));
    }, [height]);

    const contentWidth = useMemo(() => {
        const barsWidth = processedData.length * (BAR_WIDTH + BAR_GAP);
        
        // Count year changes to add divider width
        let yearDividers = 0;
        for (let i = 1; i < processedData.length; i++) {
            const currentItem = processedData[i];
            const prevItem = processedData[i - 1];
            
            if (currentItem.startDate && prevItem.startDate &&
                new Date(currentItem.startDate).getFullYear() !== new Date(prevItem.startDate).getFullYear()) {
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

    // Dynamic scale based on visible data and reference lines
    const dynamicMaxValue = useMemo(() => {
        if (providedMaxValue) {
            return providedMaxValue;
        }

        const visibleData = processedData.slice(
            visibleIndices.start,
            visibleIndices.end + 1,
        );

        const nonZeroValues = visibleData
            .map(item => item.value)
            .filter(value => value > 0);
            
        const highestDataValue = nonZeroValues.length > 0 
            ? Math.max(...nonZeroValues)
            : 1;

        const highestReferenceValue = referenceLines.length > 0
            ? Math.max(...referenceLines.map(line => line.value))
            : 0;

        const baseMaxValue = Math.max(highestDataValue, highestReferenceValue);

        // Apply buffer only if data exceeds reference lines
        if (highestDataValue > highestReferenceValue) {
            return baseMaxValue + (baseMaxValue * buffer) / 100;
        } else {
            return Math.max(baseMaxValue, highestReferenceValue * 1.1);
        }
    }, [
        processedData,
        providedMaxValue,
        buffer,
        visibleIndices.start,
        visibleIndices.end,
        referenceLines,
    ]);

    // Animate reference lines based on scale changes
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

    // Auto-trigger animations when dependencies change
    useMemo(() => {
        animateReferenceLines();
    }, [animateReferenceLines]);

    // Calculate bar position including year dividers
    const getBarPosition = useCallback((index: number) => {
        let position = index * (BAR_WIDTH + BAR_GAP);
        
        let dividersBeforeThisBar = 0;
        for (let i = 1; i <= index; i++) {
            const currentItem = processedData[i];
            const prevItem = processedData[i - 1];
            
            if (currentItem?.startDate && prevItem?.startDate &&
                new Date(currentItem.startDate).getFullYear() !== new Date(prevItem.startDate).getFullYear()) {
                dividersBeforeThisBar++;
            }
        }
        
        position += dividersBeforeThisBar * YEAR_DIVIDER_WIDTH;
        return position;
    }, [processedData]);

    // Track scrolling and update selection
    const handleScroll = useCallback(
        (event: any) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            scrollOffsetRef.current = offsetX;

            if (selectionZoneLeft !== null && !isAdjustingRef.current) {
                const selectionZoneCenter =
                    selectionZoneLeft +
                    SELECTION_ZONE_WIDTH / 2 -
                    CENTERING_OFFSET;

                let closestBarIndex = 0;
                let minDistance = Infinity;
                
                for (let i = 0; i < processedData.length; i++) {
                    const barPosition = getBarPosition(i) + BAR_WIDTH / 2;
                    const targetPosition = selectionZoneCenter + offsetX;
                    const distance = Math.abs(barPosition - targetPosition);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestBarIndex = i;
                    }
                }

                const barIndex = Math.min(
                    processedData.length - 1,
                    Math.max(0, closestBarIndex),
                );

                setSelectedBarIndex(prevIndex => {
                    if (prevIndex !== barIndex) {
                        setTimeout(() => {
                            if (onSelect && processedData[barIndex]) {
                                onSelect(processedData[barIndex], barIndex);
                            }
                        }, 0);
                    }
                    return barIndex;
                });
            }
        },
        [selectionZoneLeft, processedData, getBarPosition, onSelect],
    );

    // Center bar after scroll ends
    const handleMomentumScrollEnd = useCallback(
        (event?: any) => {
            if (isAdjustingRef.current || selectionZoneLeft === null) {
                return;
            }

            const offsetX = event
                ? event.nativeEvent.contentOffset.x
                : scrollOffsetRef.current;
            const selectionZoneCenter =
                selectionZoneLeft + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;

            let closestBarIndex = 0;
            let minDistance = Infinity;
            
            for (let i = 0; i < processedData.length; i++) {
                const barPosition = getBarPosition(i) + BAR_WIDTH / 2;
                const targetPosition = selectionZoneCenter + offsetX;
                const distance = Math.abs(barPosition - targetPosition);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestBarIndex = i;
                }
            }

            const barIndex = Math.min(
                processedData.length - 1,
                Math.max(0, closestBarIndex),
            );

            setSelectedBarIndex(prevIndex => {
                if (prevIndex !== barIndex) {
                    setTimeout(() => {
                        if (onSelect && processedData[barIndex]) {
                            onSelect(processedData[barIndex], barIndex);
                        }
                    }, 0);
                }
                return barIndex;
            });

            const selectedBarCenter = getBarPosition(barIndex) + BAR_WIDTH / 2;
            const perfectScrollPosition = selectedBarCenter - selectionZoneCenter;

            const lastBarCenter = getBarPosition(processedData.length - 1) + BAR_WIDTH / 2;
            const maxAllowedScroll = Math.max(0, lastBarCenter - selectionZoneCenter);
            const boundedPerfectScroll = Math.min(
                maxAllowedScroll,
                Math.max(0, perfectScrollPosition),
            );

            if (
                Math.abs(offsetX - boundedPerfectScroll) >
                ADJUSTMENT_SENSITIVITY
            ) {
                isAdjustingRef.current = true;

                requestAnimationFrame(() => {
                    scrollViewRef.current?.scrollTo({
                        x: boundedPerfectScroll,
                        animated: true,
                    });

                    setTimeout(() => {
                        isAdjustingRef.current = false;
                    }, ANIMATION_DURATION);
                });
            }

            // Update visible indices
            const finalScrollPosition =
                Math.abs(offsetX - boundedPerfectScroll) >
                ADJUSTMENT_SENSITIVITY
                    ? boundedPerfectScroll
                    : offsetX;

            const barsPerScreen = Math.floor(
                (viewportWidth - RIGHT_PADDING_WIDTH) / (BAR_WIDTH + BAR_GAP),
            );
            const startIndex = Math.max(0, Math.floor(finalScrollPosition / (BAR_WIDTH + BAR_GAP)));
            const endIndex = Math.min(processedData.length - 1, startIndex + barsPerScreen);
            setVisibleIndices({ start: startIndex, end: endIndex });
        },
        [processedData, selectionZoneLeft, viewportWidth, getBarPosition, onSelect],
    );

    // Handle direct bar tap
    const handleBarPress = useCallback(
        (index: number) => {
            if (isAdjustingRef.current) return;

            setSelectedBarIndex(prevIndex => {
                if (prevIndex !== index) {
                    setTimeout(() => {
                        if (onSelect && processedData[index]) {
                            onSelect(processedData[index], index);
                        }
                    }, 0);
                }
                return index;
            });

            const barContentPosition = getBarPosition(index) + BAR_WIDTH / 2;

            // Calculate the current scroll offset
            const offsetX = scrollOffsetRef.current;

            const barViewportPosition = barContentPosition - offsetX;

            const desiredZoneLeft =
                barViewportPosition -
                SELECTION_ZONE_WIDTH / 2 +
                CENTERING_OFFSET;

            const minZoneLeft = 0;
            const maxZoneLeft =
                viewportWidth - RIGHT_PADDING_WIDTH - SELECTION_ZONE_WIDTH;

            const clampedZoneLeft = Math.max(
                minZoneLeft,
                Math.min(maxZoneLeft, desiredZoneLeft),
            );

            setSelectionZoneLeft(clampedZoneLeft);
        },
        [viewportWidth, getBarPosition, onSelect, processedData],
    );

    // Calculate viewport width and initialize visible indices
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
        [processedData.length],
    );

    // Initialize scroll position and selection zone
    const initializeScrollPosition = useCallback(() => {
        if (viewportWidth > 0 && selectionZoneLeft === null && !isInitializedRef.current) {
            isInitializedRef.current = true;
            
            const barsPerScreen = Math.floor(viewportWidth / (BAR_WIDTH + BAR_GAP));
            const initialStartIndex = Math.max(0, processedData.length - barsPerScreen);
            const initialEndIndex = processedData.length - 1;
            
            setVisibleIndices({
                start: initialStartIndex,
                end: initialEndIndex,
            });
            
            const rightEdgePosition =
                viewportWidth - RIGHT_PADDING_WIDTH - SELECTION_ZONE_WIDTH;
            setSelectionZoneLeft(rightEdgePosition);

            const targetIndex = processedData.length - 1;
            const barCenter = getBarPosition(targetIndex) + BAR_WIDTH / 2;
            const selectionCenter =
                rightEdgePosition + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;
            const scrollToOffset = Math.max(0, barCenter - selectionCenter);

            const lastBarCenter = getBarPosition(processedData.length - 1) + BAR_WIDTH / 2;
            const maxAllowedScroll = Math.max(0, lastBarCenter - selectionCenter);
            const boundedScrollOffset = Math.min(maxAllowedScroll, scrollToOffset);

            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: boundedScrollOffset,
                    animated: false,
                });
                setSelectedBarIndex(targetIndex);
                
                setTimeout(() => {
                    if (onSelect && processedData[targetIndex]) {
                        onSelect(processedData[targetIndex], targetIndex);
                    }
                }, 100);
            }, RENDER_DELAY);
        }
    }, [viewportWidth, processedData.length, selectionZoneLeft, getBarPosition, onSelect]);

    useEffect(() => {
        initializeScrollPosition();
    }, [initializeScrollPosition]);

    useEffect(() => {
        isInitializedRef.current = false;
        // Reset visible indices when data changes
        const initialLength = Math.min(5, processedData.length);
        setVisibleIndices({
            start: Math.max(0, processedData.length - initialLength),
            end: Math.max(0, processedData.length - 1)
        });
        setSelectedBarIndex(Math.max(0, processedData.length - 1));
    }, [data, processedData.length]);

    return (
        <View style={[styles.container, { height }]} onLayout={handleLayout}>
            <View
                style={[
                    styles.chartAreaContainer,
                    {
                        paddingRight: RIGHT_PADDING_WIDTH,
                        height: height - PADDING_TOP,
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
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    onBarPress={handleBarPress}
                />

                <SelectionZone
                    selectionZoneLeft={selectionZoneLeft}
                    height={height}
                    paddingTop={PADDING_TOP}
                    paddingBottom={PADDING_BOTTOM}
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
