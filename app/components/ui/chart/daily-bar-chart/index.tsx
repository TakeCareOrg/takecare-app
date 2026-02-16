import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";

import {
    BAR_GAP,
    BAR_WIDTH,
    DailyBarDataItem,
    DEFAULT_HEIGHT,
    DynamicColors,
    fillMissingDays,
    PADDING_TOP,
    ReferenceLine,
    useBarPosition,
    useChartDimensions,
    useReferenceLineAnimation,
    YEAR_DIVIDER_WIDTH,
} from "../shared";
import { LABEL_WIDTH_PADDING, LABEL_WIDTH_PX_PER_CHAR } from "./constants";
import { ProgressBars } from "./progress-bars";
import { ReferenceLines } from "./reference-lines";
import { SelectionZone } from "./selection-zone";

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
    referenceLines = [],
}: DailyBarChartProps) => {
    const [viewportWidth, setViewportWidth] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const scrollOffset = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null);

    // Memoize processed data
    const processedData = useMemo(() => {
        return fillMissingDays(
            data,
            emptyDayColor,
            dynamicColors,
            referenceLines,
        );
    }, [data, emptyDayColor, dynamicColors, referenceLines]);

    useEffect(() => {
        if (processedData.length > 0 && selectedIndex === null) {
            const lastIndex = processedData.length - 1;
            setSelectedIndex(lastIndex);
            if (onSelect) {
                onSelect(processedData[lastIndex], lastIndex);
            }
        }
    }, [processedData, selectedIndex, onSelect]);

    const { chartHeight, paddingTop, paddingBottom } = useChartDimensions({
        height,
    });
    const { getBarPosition } = useBarPosition({
        data: processedData,
        barWidth: BAR_WIDTH,
        barGap: BAR_GAP,
        yearDividerWidth: YEAR_DIVIDER_WIDTH,
    });
    const { animatedPositions } = useReferenceLineAnimation({
        referenceLines,
        dynamicMaxValue: Math.max(...processedData.map((d) => d.value)),
        chartHeight,
    });

    const handleLayout = useCallback((event: LayoutChangeEvent) => {
        setViewportWidth(event.nativeEvent.layout.width);
    }, []);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollOffset.value = event.contentOffset.x;
        },
    });

    const handleSelectBar = useCallback(
        (index: number) => {
            setSelectedIndex(index);
            if (onSelect) onSelect(processedData[index], index);

            // Scroll to center selected bar
            if (flatListRef.current && viewportWidth > 0) {
                const barCenter = getBarPosition(index) + BAR_WIDTH / 2;
                const offset = Math.max(0, barCenter - viewportWidth / 2);
                flatListRef.current.scrollToOffset({ offset, animated: true });
            }
        },
        [processedData, getBarPosition, viewportWidth, onSelect],
    );

    // Key extractor
    const keyExtractor = useCallback(
        (_item: DailyBarDataItem, index: number) => String(index),
        [],
    );

    const renderItem = useCallback(
        ({ item, index }: { item: DailyBarDataItem; index: number }) => (
            <ProgressBars
                data={[item]}
                selectedBarIndex={selectedIndex === index ? 0 : -1}
                dynamicMaxValue={Math.max(...processedData.map((d) => d.value))}
                chartHeight={chartHeight}
                onBarPress={() => handleSelectBar(index)}
                index={index}
            />
        ),
        [processedData, selectedIndex, chartHeight, handleSelectBar],
    );

    return (
        <View style={[styles.container, { height }]} onLayout={handleLayout}>
            <View
                style={[
                    styles.chartAreaContainer,
                    {
                        paddingRight: BAR_WIDTH,
                        height: height - paddingTop,
                    },
                ]}
            >
                <ReferenceLines
                    referenceLines={referenceLines}
                    animatedPositions={animatedPositions}
                    labelWidth={
                        Math.max(...referenceLines.map((r) => r.label.length)) *
                            LABEL_WIDTH_PX_PER_CHAR +
                        LABEL_WIDTH_PADDING
                    }
                />

                <Animated.FlatList
                    ref={flatListRef}
                    horizontal
                    data={processedData}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    getItemLayout={(_, index) => ({
                        length: BAR_WIDTH + BAR_GAP,
                        offset: getBarPosition(index),
                        index,
                    })}
                    initialScrollIndex={processedData.length - 1}
                    windowSize={7} // Render only visible + 3 bars each side
                />

                {selectedIndex !== null && (
                    <SelectionZone
                        selectionZoneLeft={getBarPosition(selectedIndex)}
                        scrollOffset={scrollOffset}
                        height={height}
                        paddingTop={paddingTop}
                        paddingBottom={paddingBottom}
                    />
                )}
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
