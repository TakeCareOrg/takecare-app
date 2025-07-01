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

import { eachDayOfInterval, format, parseISO } from "date-fns";

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
    YEAR_DIVIDER_WIDTH,
} from "./constants";
import { BarDataItem, ProgressBars } from "./progress-bars";
import { ReferenceLines } from "./reference-lines";
import { SelectionZone } from "./selection-zone";

interface DailyBarChartProps {
    data: BarDataItem[];
    maxValue?: number;
    referenceLines?: {
        value: number;
        label: string;
        lineColor?: string;
        labelColor?: string;
    }[];
    buffer?: number;
    height?: number;
    fillMissingDays?: boolean;
    emptyDayColor?: string;
    onSelect?: (selectedData: BarDataItem, index: number) => void;
    disableSnapping?: boolean;
    dynamicColors?: {
        belowFirstReference: string;
        aboveFirstReference: string;
        aboveSecondReference?: string;
    };
    /** Custom colors for reference lines */
    referenceLineColors?: {
        line?: string;
        label?: string;
    };
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
    disableSnapping = false,
    dynamicColors,
    referenceLineColors,
}: DailyBarChartProps) => {
    // Calculate dynamic color for a bar based on reference thresholds
    const getDynamicColor = useCallback(
        (value: number, originalColor?: string) => {
            if (!dynamicColors) {
                return originalColor || "#5B7BFB";
            }

            if (!referenceLines || referenceLines.length === 0) {
                return originalColor || dynamicColors.belowFirstReference;
            }

            const sortedReferences = [...referenceLines].sort(
                (a, b) => a.value - b.value,
            );
            const firstReference = sortedReferences[0]?.value || 0;
            const secondReference = sortedReferences[1]?.value || null;

            if (secondReference && value >= secondReference) {
                return (
                    dynamicColors.aboveSecondReference ||
                    dynamicColors.aboveFirstReference
                );
            } else if (value >= firstReference) {
                return dynamicColors.aboveFirstReference;
            } else {
                return dynamicColors.belowFirstReference;
            }
        },
        [dynamicColors, referenceLines],
    );

    // Fill missing days with empty entries and apply dynamic colors
    const processedData = useMemo(() => {
        if (!fillMissingDays || data.length === 0) {
            return data.map((item) => ({
                ...item,
                color: getDynamicColor(item.value, item.color),
            }));
        }

        const dataWithDates = data.filter((item) => "startDate" in item);

        if (dataWithDates.length === 0) {
            return data;
        }

        // Sort data by date to ensure chronological order
        const sortedData = [...dataWithDates].sort(
            (a, b) =>
                new Date((a as any).startDate).getTime() -
                new Date((b as any).startDate).getTime(),
        );

        const firstDate = parseISO((sortedData[0] as any).startDate);
        const lastDate = new Date();

        const dataMap = new Map();
        dataWithDates.forEach((item) => {
            const dateKey = format(
                parseISO((item as any).startDate),
                "yyyy-MM-dd",
            );
            dataMap.set(dateKey, item);
        });

        const allDays = eachDayOfInterval({
            start: firstDate,
            end: lastDate,
        });

        const result = allDays.map((date) => {
            const dateKey = format(date, "yyyy-MM-dd");
            const existingData = dataMap.get(dateKey);

            if (existingData) {
                return {
                    ...existingData,
                    color: getDynamicColor(
                        existingData.value,
                        existingData.color,
                    ),
                };
            } else {
                return {
                    day: format(date, "dd"),
                    value: 0,
                    color: emptyDayColor,
                    startDate: format(date, "yyyy-MM-dd"),
                };
            }
        });

        return result;
    }, [data, fillMissingDays, emptyDayColor, getDynamicColor]);

    const [visibleIndices, setVisibleIndices] = useState<{
        start: number;
        end: number;
    }>(() => {
        const initialLength = Math.min(5, processedData.length);
        return {
            start: Math.max(0, processedData.length - initialLength),
            end: Math.max(0, processedData.length - 1),
        };
    });

    const [viewportWidth, setViewportWidth] = useState(0);
    const [selectedBarIndex, setSelectedBarIndex] = useState(
        processedData.length - 1,
    );
    const [selectionZoneLeft, setSelectionZoneLeft] = useState<number | null>(
        null,
    );

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
        return Math.min(
            MAX_CHART_HEIGHT,
            Math.max(MIN_CHART_HEIGHT, availableHeight),
        );
    }, [height]);

    const contentWidth = useMemo(() => {
        const barsWidth = processedData.length * (BAR_WIDTH + BAR_GAP);

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

    const getBarPosition = useCallback(
        (index: number) => {
            let position = index * (BAR_WIDTH + BAR_GAP);

            let dividersBeforeThisBar = 0;
            for (let i = 1; i <= index; i++) {
                const currentItem = processedData[i];
                const prevItem = processedData[i - 1];

                if (
                    currentItem?.startDate &&
                    prevItem?.startDate &&
                    new Date(currentItem.startDate).getFullYear() !==
                        new Date(prevItem.startDate).getFullYear()
                ) {
                    dividersBeforeThisBar++;
                }
            }

            position += dividersBeforeThisBar * YEAR_DIVIDER_WIDTH;
            return position;
        },
        [processedData],
    );

    const handleScrollBeginDrag = useCallback(() => {
        isUserScrollingRef.current = true;
        lastScrollTimeRef.current = Date.now();
        lastScrollOffsetRef.current = scrollOffsetRef.current;
        scrollVelocityRef.current = 0;
    }, []);

    const handleScroll = useCallback((event: any) => {
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

        // No selection updates during scroll - just track scroll position
    }, []);

    // Improved snap function that centers the selected bar in the current selection zone
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
            const selectedBarCenter = getBarPosition(barIndex) + BAR_WIDTH / 2;
            const targetScrollX = selectedBarCenter - selectionZoneCenter;

            // Ensure we don't scroll beyond content bounds
            const maxScrollX = Math.max(0, contentWidth - viewportWidth);
            const clampedTargetScrollX = Math.max(
                0,
                Math.min(targetScrollX, maxScrollX),
            );

            const currentScrollX = scrollOffsetRef.current;
            const snapDistance = Math.abs(
                currentScrollX - clampedTargetScrollX,
            );

            // Only snap if there's a meaningful distance to avoid micro-adjustments
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
        ],
    );

    const handleMomentumScrollEnd = useCallback(
        (event?: any) => {
            // Extract the scroll offset immediately before the event gets pooled
            const eventOffsetX = event?.nativeEvent?.contentOffset?.x;

            if (isAdjustingRef.current || selectionZoneLeft === null) {
                return;
            }

            // Wait a bit longer to ensure scroll has completely settled
            setTimeout(() => {
                // Set isUserScrolling to false here, just before processing
                isUserScrollingRef.current = false;

                // Use the extracted offset or fallback to current scroll position
                const offsetX =
                    eventOffsetX !== undefined
                        ? eventOffsetX
                        : scrollOffsetRef.current;

                // Double-check we're not still scrolling by comparing with current scroll position
                const currentScrollOffset = scrollOffsetRef.current;

                if (Math.abs(offsetX - currentScrollOffset) > 2) {
                    return;
                }

                // Find the bar that is closest to the center of the selection zone
                const selectionZoneCenter =
                    selectionZoneLeft +
                    SELECTION_ZONE_WIDTH / 2 -
                    CENTERING_OFFSET;

                let closestBarIndex = 0;
                let minDistance = Infinity;

                for (let i = 0; i < processedData.length; i++) {
                    const barPosition = getBarPosition(i) + BAR_WIDTH / 2;
                    const barScreenPosition = barPosition - currentScrollOffset;
                    const distance = Math.abs(
                        barScreenPosition - selectionZoneCenter,
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestBarIndex = i;
                    }
                }

                const barIndex = Math.min(
                    processedData.length - 1,
                    Math.max(0, closestBarIndex),
                );

                // Update selected bar and trigger callback
                setSelectedBarIndex((prevIndex) => {
                    if (
                        prevIndex !== barIndex &&
                        onSelect &&
                        processedData[barIndex]
                    ) {
                        setTimeout(() => {
                            onSelect(processedData[barIndex], barIndex);
                        }, 0);
                    }
                    return barIndex;
                });

                // Gentle snap to center the selected bar in the selection zone
                // Only snap if the misalignment is significant enough to be noticeable
                const selectedBarCenter =
                    getBarPosition(barIndex) + BAR_WIDTH / 2;
                const selectedBarScreenPosition =
                    selectedBarCenter - currentScrollOffset;
                const misalignment = Math.abs(
                    selectedBarScreenPosition - selectionZoneCenter,
                );

                // Reduced threshold from 5 to 3 pixels for better alignment
                if (misalignment > 3 && !isUserScrollingRef.current) {
                    setTimeout(() => {
                        // Final check before snapping
                        if (
                            !isUserScrollingRef.current &&
                            !isAdjustingRef.current
                        ) {
                            snapToBar(barIndex);
                        }
                    }, 100); // Reduced delay for more responsive snapping
                }
                // Update visible indices based on current scroll position
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

                scrollVelocityRef.current = 0;
            }, 100); // Wait 100ms to ensure momentum has completely stopped
        },
        [
            processedData,
            selectionZoneLeft,
            viewportWidth,
            getBarPosition,
            onSelect,
            snapToBar,
        ],
    );

    const handleBarPress = useCallback(
        (index: number) => {
            if (isAdjustingRef.current || selectionZoneLeft === null) return;

            // Update selected bar and trigger callback
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

            // Calculate where the bar currently is on screen
            const currentScrollOffset = scrollOffsetRef.current;
            const barContentPosition = getBarPosition(index) + BAR_WIDTH / 2;
            const barScreenPosition = barContentPosition - currentScrollOffset;

            // Calculate the ideal selection zone position to center on this bar
            const idealZoneLeft =
                barScreenPosition - SELECTION_ZONE_WIDTH / 2 + CENTERING_OFFSET;

            // Check if the selection zone needs to be repositioned
            const minZoneLeft = 0;
            const maxZoneLeft =
                viewportWidth - RIGHT_PADDING_WIDTH - SELECTION_ZONE_WIDTH;
            const clampedZoneLeft = Math.max(
                minZoneLeft,
                Math.min(maxZoneLeft, idealZoneLeft),
            );

            // Update selection zone position
            setSelectionZoneLeft(clampedZoneLeft);

            // If the zone was clamped, we need to scroll to properly center the bar
            // This prevents weird rollback movements
            if (Math.abs(clampedZoneLeft - idealZoneLeft) > 1) {
                // Selection zone hit viewport bounds, scroll to center the bar
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
        ],
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
        if (
            viewportWidth > 0 &&
            selectionZoneLeft === null &&
            !isInitializedRef.current
        ) {
            isInitializedRef.current = true;

            const barsPerScreen = Math.floor(
                viewportWidth / (BAR_WIDTH + BAR_GAP),
            );
            const initialStartIndex = Math.max(
                0,
                processedData.length - barsPerScreen,
            );
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

            const lastBarCenter =
                getBarPosition(processedData.length - 1) + BAR_WIDTH / 2;
            const maxAllowedScroll = Math.max(
                0,
                lastBarCenter - selectionCenter,
            );
            const boundedScrollOffset = Math.min(
                maxAllowedScroll,
                scrollToOffset,
            );

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
    }, [
        viewportWidth,
        processedData.length,
        selectionZoneLeft,
        getBarPosition,
        onSelect,
    ]);

    useEffect(() => {
        initializeScrollPosition();
    }, [initializeScrollPosition]);

    useEffect(() => {
        isInitializedRef.current = false;
        const initialLength = Math.min(5, processedData.length);
        setVisibleIndices({
            start: Math.max(0, processedData.length - initialLength),
            end: Math.max(0, processedData.length - 1),
        });
        setSelectedBarIndex(Math.max(0, processedData.length - 1));
    }, [data, processedData.length]);

    return (
        <View style={[styles.container, { height }]}>
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
