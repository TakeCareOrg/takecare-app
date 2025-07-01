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
    /** Scroll state for proper bubble positioning */
    currentScrollOffset?: number;
    viewportWidth?: number;
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
    currentScrollOffset = 0,
    viewportWidth = 0,
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

    // Calculate the position of the info bubble relative to the viewport
    const infoBubbleViewportX = selectedBarX !== null 
        ? selectedBarX - currentScrollOffset 
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
        <View style={styles.outerContainer}>
            {/* Info bubble positioned relative to viewport */}
            {infoBubbleViewportX !== null && infoBubbleData && viewportWidth > 0 && (
                <View
                    style={{
                        position: "absolute",
                        left: Math.max(40, Math.min(infoBubbleViewportX, viewportWidth - 80)), // Keep bubble within viewport
                        top: -80, // Position above the chart area
                        pointerEvents: "none",
                        zIndex: 2000,
                        elevation: 10, // For Android
                    }}
                >
                    <InfoBubble
                        data={infoBubbleData}
                        centerX={0} // Already positioned correctly
                        topY={0}
                        formatValue={formatValue}
                        subtitle={intervalType}
                        viewportWidth={viewportWidth}
                        rightPadding={40} // Keep some margin from edge
                    />
                </View>
            )}

            <View style={[styles.container, { height: chartHeight + paddingBottom }]}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ height: chartHeight + paddingBottom }}
                    contentContainerStyle={{
                        width: contentWidth,
                        height: chartHeight + paddingBottom,
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
                                    { 
                                        width: barWidth + barGap,
                                        height: chartHeight + paddingBottom,
                                    },
                                ]}
                                onPress={handleBarPress}
                            >
                                <View
                                    style={[
                                        styles.barContainer,
                                        {
                                            width: barWidth,
                                            height: chartHeight + paddingBottom,
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
                                left: selectedBarX - 1, //? Center the line (lineWidth/2)
                                bottom: paddingBottom,
                                height: chartHeight + 60, //? Extend upward to connect with bubble
                                width: 2,
                                pointerEvents: "none", //? Don't interfere with scroll
                                zIndex: 1500,
                            }}
                        >
                            <VerticalSelectionLine
                                centerX={1}
                                height={chartHeight}
                                topOffset={0}
                                color="#5B7BFB"
                                lineWidth={2}
                                extendUpward={60}
                            />
                        </View>
                    )}

                    {/* Bottom separator line between chart and labels */}
                    <View
                        style={{
                            position: "absolute",
                            bottom: paddingBottom,
                            left: 0,
                            right: 0,
                            height: 1,
                            backgroundColor: "#888",
                            opacity: 0.3,
                            pointerEvents: "none",
                        }}
                    />
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        position: "relative",
        overflow: "visible", 
        zIndex: 1,
    },
    container: {
        position: "relative",
        overflow: "visible",
        zIndex: 1,
    },
    barContainer: {
        alignItems: "center",
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
        // Height will be set dynamically
    },
});
