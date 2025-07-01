import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { InfoBubble, InfoBubbleData } from "../shared/info-bubble";
import { VerticalSelectionLine } from "../shared/vertical-selection-line";

export interface IntervalBarDataItem {
    day: string;
    value: number;
    color?: string;
    intervalKey?: string;
}

interface IntervalProgressBarsProps {
    data: IntervalBarDataItem[];
    selectedBarIndex: number;
    dynamicMaxValue: number;
    chartHeight: number;
    contentWidth: number;
    scrollViewRef: React.RefObject<ScrollView | null>;
    onScroll: (event: any) => void;
    onMomentumScrollEnd: (event?: any) => void;
    onBarPress: (index: number) => void;
    onScrollBeginDrag?: (event: any) => void;
    /** Bar configuration */
    barWidth?: number;
    barGap?: number;
    barActualWidth?: number;
    barBorderRadius?: number;
    paddingBottom?: number;
    /** Colors */
    colors?: {
        selectedBar?: string;
        normalBar?: string;
        labelText?: string;
        selectedLabelText?: string;
        selectedLabelBackground?: string;
    };
    /** Selection UI */
    intervalType?: string;
    formatValue?: (value: number) => string;
}

// Default constants
const DEFAULT_BAR_WIDTH = 30;
const DEFAULT_BAR_GAP = 8;
const DEFAULT_BAR_ACTUAL_WIDTH = 10;
const DEFAULT_BAR_BORDER_RADIUS = 5;
const DEFAULT_PADDING_BOTTOM = 30;
const DEFAULT_LABEL_FONT_SIZE = 12;
const DEFAULT_LABEL_BOTTOM_POSITION = 10;

const DEFAULT_COLORS = {
    SELECTED_BAR: "#5B7BFB",
    NORMAL_BAR: "#3B5AFB",
    LABEL_TEXT: "#888",
    SELECTED_LABEL_TEXT: "#fff",
    SELECTED_LABEL_BG: "rgba(0, 0, 0, 0.7)",
};

export const IntervalProgressBars: React.FC<IntervalProgressBarsProps> = ({
    data,
    selectedBarIndex,
    dynamicMaxValue,
    chartHeight,
    contentWidth,
    scrollViewRef,
    onScroll,
    onMomentumScrollEnd,
    onBarPress,
    onScrollBeginDrag,
    barWidth = DEFAULT_BAR_WIDTH,
    barGap = DEFAULT_BAR_GAP,
    barActualWidth = DEFAULT_BAR_ACTUAL_WIDTH,
    barBorderRadius = DEFAULT_BAR_BORDER_RADIUS,
    paddingBottom = DEFAULT_PADDING_BOTTOM,
    colors = DEFAULT_COLORS,
    intervalType = "",
    formatValue = (value) => value.toString(),
}) => {
    const resolvedColors = { ...DEFAULT_COLORS, ...colors };

    // Calculate selected bar position and create info bubble data
    const selectedBarData =
        selectedBarIndex >= 0 && selectedBarIndex < data.length
            ? data[selectedBarIndex]
            : null;

    // Calculate the exact center position of the selected bar within the scroll content
    const selectedBarX =
        selectedBarIndex >= 0
            ? selectedBarIndex * (barWidth + barGap) + (barWidth + barGap) / 2
            : null;

    const infoBubbleData: InfoBubbleData | null = selectedBarData
        ? {
              label: selectedBarData.day,
              value: selectedBarData.value,
              color: selectedBarData.color,
              intervalKey: selectedBarData.intervalKey,
          }
        : null;

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    width: contentWidth,
                    height: '100%',
                }}
                onScroll={onScroll}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollEndDrag={onMomentumScrollEnd}
                onScrollBeginDrag={onScrollBeginDrag}
                scrollEventThrottle={8}
                decelerationRate="normal"
                snapToInterval={undefined}
                bounces={true}
                bouncesZoom={false}
                maximumZoomScale={1}
                minimumZoomScale={1}
                showsVerticalScrollIndicator={false}
                overScrollMode="auto"
                nestedScrollEnabled={true}
            >
                {data.map((item, index) => {
                    const isSelected = selectedBarIndex === index;

                    const handleBarPress = () => {
                        onBarPress(index);
                    };

                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.7}
                            style={[
                                styles.barTouchable,
                                { width: barWidth + barGap },
                            ]}
                            onPress={handleBarPress}
                        >
                            <View
                                style={[
                                    styles.barContainer,
                                    {
                                        width: barWidth,
                                        paddingBottom,
                                        marginHorizontal: barGap / 2,
                                    },
                                ]}
                            >
                                {/* Bar */}
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            width: barActualWidth,
                                            height: Math.min(
                                                (item.value / dynamicMaxValue) *
                                                    chartHeight,
                                                chartHeight,
                                            ),
                                            backgroundColor:
                                                item.color ||
                                                (isSelected
                                                    ? resolvedColors.SELECTED_BAR
                                                    : resolvedColors.NORMAL_BAR),
                                            borderTopLeftRadius:
                                                barBorderRadius,
                                            borderTopRightRadius:
                                                barBorderRadius,
                                        },
                                    ]}
                                />

                                {/* Label */}
                                <View style={styles.labelContainer}>
                                    <Text
                                        style={[
                                            styles.dayLabel,
                                            {
                                                color: isSelected
                                                    ? resolvedColors.SELECTED_LABEL_TEXT
                                                    : resolvedColors.LABEL_TEXT,
                                                fontWeight: isSelected
                                                    ? "bold"
                                                    : "normal",
                                            },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {item.day}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {/* Selection line - positioned absolutely within the scroll content */}
                {selectedBarX !== null && (
                    <View
                        style={{
                            position: "absolute",
                            left: selectedBarX - 1, // Center the line (lineWidth/2)
                            bottom: paddingBottom,
                            height: chartHeight + 80, // Extend upward to connect with bubble
                            width: 2,
                            pointerEvents: "none", // Don't interfere with scroll
                        }}
                    >
                        <VerticalSelectionLine
                            centerX={1} // Center within our positioned container
                            height={chartHeight}
                            topOffset={0}
                            color="#5B7BFB"
                            lineWidth={2}
                            extendUpward={80}
                        />
                    </View>
                )}

                {/* Info bubble - positioned absolutely within the scroll content */}
                {selectedBarX !== null && infoBubbleData && (
                    <View
                        style={{
                            position: "absolute",
                            left: selectedBarX - 40, // Center the bubble (approximate bubble width/2)
                            bottom: chartHeight + paddingBottom + 20, // Position above the bars
                            pointerEvents: "none",
                            zIndex: 1000,
                        }}
                    >
                        <InfoBubble
                            data={infoBubbleData}
                            centerX={40} // Center within our positioned container
                            topY={-70}
                            formatValue={formatValue}
                            subtitle={intervalType}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        height: "100%",
    },
    barContainer: {
        alignItems: "center",
        height: "100%",
        justifyContent: "flex-end",
    },
    bar: {
        zIndex: 4,
    },
    labelContainer: {
        position: "absolute",
        bottom: DEFAULT_LABEL_BOTTOM_POSITION,
        alignItems: "center",
        justifyContent: "center",
        minWidth: DEFAULT_BAR_WIDTH,
        height: 20,
    },
    dayLabel: {
        fontSize: DEFAULT_LABEL_FONT_SIZE,
        textAlign: "center",
    },
    barTouchable: {
        height: "100%",
    },
});
