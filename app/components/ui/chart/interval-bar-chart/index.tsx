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
    CENTERING_OFFSET,
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
import { BarDataItem, ProgressBars } from "../daily-bar-chart/progress-bars";
import { ReferenceLines } from "../daily-bar-chart/reference-lines";
import { SelectionZone } from "../daily-bar-chart/selection-zone";

export type IntervalType = 'hours' | 'weekdays' | 'months';

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
    disableSnapping?: boolean;
    dynamicColors?: {
        belowFirstReference: string;
        aboveFirstReference: string;
        aboveSecondReference?: string;
    };
}

// Default interval configurations
const INTERVAL_CONFIGS = {
    hours: {
        labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
        keys: Array.from({ length: 24 }, (_, i) => i.toString()),
    },
    weekdays: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        keys: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
    months: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        keys: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    }
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
    disableSnapping = false,
    dynamicColors,
}: IntervalBarChartProps) => {
    
    // Calculate dynamic color for a bar based on reference thresholds
    const getDynamicColor = useCallback((value: number, originalColor?: string) => {
        if (!dynamicColors) {
            return originalColor || "#5B7BFB";
        }
        
        if (!referenceLines || referenceLines.length === 0) {
            return originalColor || dynamicColors.belowFirstReference;
        }
        
        const sortedReferences = [...referenceLines].sort((a, b) => a.value - b.value);
        const firstReference = sortedReferences[0]?.value || 0;
        const secondReference = sortedReferences[1]?.value || null;
        
        if (secondReference && value >= secondReference) {
            return dynamicColors.aboveSecondReference || dynamicColors.aboveFirstReference;
        } else if (value >= firstReference) {
            return dynamicColors.aboveFirstReference;
        } else {
            return dynamicColors.belowFirstReference;
        }
    }, [dynamicColors, referenceLines]);
    
    // Process data to ensure all intervals are present
    const processedData = useMemo(() => {
        const config = INTERVAL_CONFIGS[intervalType];
        const dataMap = new Map();
        
        // Map existing data by intervalKey
        data.forEach(item => {
            dataMap.set(item.intervalKey, item);
        });
        
        // Create complete dataset with all intervals
        const result: BarDataItem[] = config.keys.map((key, index) => {
            const existingData = dataMap.get(key);
            
            if (existingData) {
                return {
                    day: existingData.label,
                    value: existingData.value,
                    color: getDynamicColor(existingData.value, existingData.color),
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
        });
        
        return result;
    }, [data, intervalType, emptyBarColor, getDynamicColor]);

    const [visibleIndices, setVisibleIndices] = useState<{
        start: number;
        end: number;
    }>(() => {
        const initialLength = Math.min(5, processedData.length);
        return {
            start: Math.max(0, processedData.length - initialLength),
            end: Math.max(0, processedData.length - 1)
        };
    });

    const [viewportWidth, setViewportWidth] = useState(0);
    const [selectedBarIndex, setSelectedBarIndex] = useState(processedData.length - 1);
    const [selectionZoneLeft, setSelectionZoneLeft] = useState<number | null>(null);

    const isAdjustingRef = useRef(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollOffsetRef = useRef(0);
    const isInitializedRef = useRef(false);
    const isUserScrollingRef = useRef(false);
    const lastScrollTimeRef = useRef(0);
    const scrollVelocityRef = useRef(0);
    const lastScrollOffsetRef = useRef(0);

    const animatedPositions = useMemo(
        () => referenceLines.map(() => new Animated.Value(0)),
        [referenceLines.length],
    );

    const chartHeight = useMemo(() => {
        const availableHeight = height - PADDING_TOP - PADDING_BOTTOM;
        return Math.min(MAX_CHART_HEIGHT, Math.max(MIN_CHART_HEIGHT, availableHeight));
    }, [height]);

    const contentWidth = useMemo(() => {
        const barsWidth = processedData.length * (BAR_WIDTH + BAR_GAP);
        const minPadding = selectionZoneLeft !== null
            ? Math.max(
                  0,
                  selectionZoneLeft +
                      SELECTION_ZONE_WIDTH / 2 -
                      (viewportWidth - RIGHT_PADDING_WIDTH),
              )
            : SELECTION_ZONE_WIDTH / 2;

        return barsWidth + minPadding;
    }, [processedData, viewportWidth, selectionZoneLeft]);

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

        if (referenceLines.length > 0) {
            const minRequiredValue = highestReferenceValue * (1 + REFERENCE_LINE_BUFFER / 100);
            
            if (highestDataValue > highestReferenceValue) {
                const dataWithBuffer = baseMaxValue + (baseMaxValue * buffer) / 100;
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

    const getBarPosition = useCallback((index: number) => {
        return index * (BAR_WIDTH + BAR_GAP);
    }, []);

    const handleScrollBeginDrag = useCallback(() => {
        isUserScrollingRef.current = true;
        lastScrollTimeRef.current = Date.now();
        lastScrollOffsetRef.current = scrollOffsetRef.current;
        scrollVelocityRef.current = 0;
    }, []);

    const handleScroll = useCallback(
        (event: any) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const currentTime = Date.now();
            
            if (lastScrollTimeRef.current > 0) {
                const timeDiff = currentTime - lastScrollTimeRef.current;
                const offsetDiff = Math.abs(offsetX - lastScrollOffsetRef.current);
                scrollVelocityRef.current = timeDiff > 0 ? offsetDiff / timeDiff : 0;
            }
            
            scrollOffsetRef.current = offsetX;
            lastScrollTimeRef.current = currentTime;
            lastScrollOffsetRef.current = offsetX;
            isUserScrollingRef.current = true;
        },
        [],
    );

    const snapToBar = useCallback((barIndex: number) => {
        if (disableSnapping || isAdjustingRef.current || selectionZoneLeft === null) {
            return;
        }

        const selectionZoneCenter = selectionZoneLeft + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;
        const selectedBarCenter = getBarPosition(barIndex) + BAR_WIDTH / 2;
        const targetScrollX = selectedBarCenter - selectionZoneCenter;
        
        const maxScrollX = Math.max(0, contentWidth - viewportWidth);
        const clampedTargetScrollX = Math.max(0, Math.min(targetScrollX, maxScrollX));
        
        const currentScrollX = scrollOffsetRef.current;
        const snapDistance = Math.abs(currentScrollX - clampedTargetScrollX);

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
    }, [disableSnapping, selectionZoneLeft, getBarPosition, contentWidth, viewportWidth]);

    const handleMomentumScrollEnd = useCallback(
        (event?: any) => {
            const eventOffsetX = event?.nativeEvent?.contentOffset?.x;
            
            if (isAdjustingRef.current || selectionZoneLeft === null) {
                return;
            }

            setTimeout(() => {
                isUserScrollingRef.current = false;
                
                const offsetX = eventOffsetX !== undefined ? eventOffsetX : scrollOffsetRef.current;
                const currentScrollOffset = scrollOffsetRef.current;
                
                if (Math.abs(offsetX - currentScrollOffset) > 2) {
                    return;
                }
                    
                const selectionZoneCenter =
                    selectionZoneLeft + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;

                let closestBarIndex = 0;
                let minDistance = Infinity;
                
                for (let i = 0; i < processedData.length; i++) {
                    const barPosition = getBarPosition(i) + BAR_WIDTH / 2;
                    const barScreenPosition = barPosition - currentScrollOffset;
                    const distance = Math.abs(barScreenPosition - selectionZoneCenter);
                    
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
                    if (prevIndex !== barIndex && onSelect && processedData[barIndex]) {
                        setTimeout(() => {
                            const selectedItem: IntervalBarDataItem = {
                                label: processedData[barIndex].day,
                                value: processedData[barIndex].value,
                                color: processedData[barIndex].color,
                                intervalKey: (processedData[barIndex] as any).intervalKey,
                            };
                            onSelect(selectedItem, barIndex);
                        }, 0);
                    }
                    return barIndex;
                });

                const selectedBarCenter = getBarPosition(barIndex) + BAR_WIDTH / 2;
                const selectedBarScreenPosition = selectedBarCenter - currentScrollOffset;
                const misalignment = Math.abs(selectedBarScreenPosition - selectionZoneCenter);
                
                if (misalignment > 3 && !isUserScrollingRef.current) {
                    setTimeout(() => {
                        if (!isUserScrollingRef.current && !isAdjustingRef.current) {
                            snapToBar(barIndex);
                        } 
                    }, 100);
                } 

                const barsPerScreen = Math.floor(
                    (viewportWidth - RIGHT_PADDING_WIDTH) / (BAR_WIDTH + BAR_GAP),
                );
                const startIndex = Math.max(0, Math.floor(currentScrollOffset / (BAR_WIDTH + BAR_GAP)));
                const endIndex = Math.min(processedData.length - 1, startIndex + barsPerScreen);
                setVisibleIndices({ start: startIndex, end: endIndex });
                
                scrollVelocityRef.current = 0;
            }, 100);
        },
        [processedData, selectionZoneLeft, viewportWidth, getBarPosition, onSelect, snapToBar],
    );

    const handleBarPress = useCallback(
        (index: number) => {
            if (isAdjustingRef.current || selectionZoneLeft === null) return;

            setSelectedBarIndex(prevIndex => {
                if (prevIndex !== index) {
                    setTimeout(() => {
                        if (onSelect && processedData[index]) {
                            const selectedItem: IntervalBarDataItem = {
                                label: processedData[index].day,
                                value: processedData[index].value,
                                color: processedData[index].color,
                                intervalKey: (processedData[index] as any).intervalKey,
                            };
                            onSelect(selectedItem, index);
                        }
                    }, 0);
                }
                return index;
            });

            const currentScrollOffset = scrollOffsetRef.current;
            const barContentPosition = getBarPosition(index) + BAR_WIDTH / 2;
            const barScreenPosition = barContentPosition - currentScrollOffset;

            const idealZoneLeft = barScreenPosition - SELECTION_ZONE_WIDTH / 2 + CENTERING_OFFSET;

            const minZoneLeft = 0;
            const maxZoneLeft = viewportWidth - RIGHT_PADDING_WIDTH - SELECTION_ZONE_WIDTH;
            const clampedZoneLeft = Math.max(minZoneLeft, Math.min(maxZoneLeft, idealZoneLeft));

            setSelectionZoneLeft(clampedZoneLeft);
            
            if (Math.abs(clampedZoneLeft - idealZoneLeft) > 1) {
                setTimeout(() => {
                    snapToBar(index);
                }, 50);
            }
        },
        [viewportWidth, getBarPosition, onSelect, processedData, selectionZoneLeft, snapToBar],
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
        [processedData.length],
    );

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
                        const selectedItem: IntervalBarDataItem = {
                            label: processedData[targetIndex].day,
                            value: processedData[targetIndex].value,
                            color: processedData[targetIndex].color,
                            intervalKey: (processedData[targetIndex] as any).intervalKey,
                        };
                        onSelect(selectedItem, targetIndex);
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
        const initialLength = Math.min(5, processedData.length);
        setVisibleIndices({
            start: Math.max(0, processedData.length - initialLength),
            end: Math.max(0, processedData.length - 1)
        });
        setSelectedBarIndex(Math.max(0, processedData.length - 1));
    }, [data, processedData.length, intervalType]);

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
                    onScrollBeginDrag={handleScrollBeginDrag}
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
