import React from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { Text } from "@app/components/ui/text";
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
    onTapOutside?: () => void;
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
    /** Selection line color */
    selectionLineColor?: string;
    /** Selection UI */
    intervalType?: string;
    formatValue?: (value: number) => string;
    /** Scroll state for proper bubble positioning */
    currentScrollOffset?: number;
    viewportWidth?: number;
    /** Label display configuration */
    showLabelEvery?: number; // Show label every N bars (e.g., 6 for every 6 hours)
    labelIndices?: (string | number)[]; // Specific indices to show labels for, or custom labels
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
    onTapOutside,
    barWidth = DEFAULT_BAR_WIDTH,
    barGap = DEFAULT_BAR_GAP,
    barActualWidth = DEFAULT_BAR_ACTUAL_WIDTH,
    barBorderRadius = DEFAULT_BAR_BORDER_RADIUS,
    paddingBottom = DEFAULT_PADDING_BOTTOM,
    colors = DEFAULT_COLORS,
    selectionLineColor = "#5B7BFB",
    intervalType = "",
    formatValue = (value) => value.toString(),
    currentScrollOffset = 0,
    viewportWidth = 0,
    showLabelEvery,
    labelIndices,
}) => {
    const resolvedColors = { ...DEFAULT_COLORS, ...colors };

    // Determine which bars should show labels
    const shouldShowLabel = (index: number) => {
        // For hours mode, hide the first label (00h) since we have "(h)" indicator
        if (intervalType === "hours" && index === 0) {
            return false;
        }
        
        // If specific label indices are provided, use them
        if (labelIndices && labelIndices.length > 0) {
            // Check if this index should show a label (support both string and number indices)
            return labelIndices.some(labelIndex => {
                if (typeof labelIndex === 'number') {
                    return labelIndex === index;
                } else if (typeof labelIndex === 'string') {
                    // For string indices, convert to number if possible
                    const numericIndex = parseInt(labelIndex, 10);
                    return !isNaN(numericIndex) && numericIndex === index;
                }
                return false;
            });
        }
        
        // If showLabelEvery is specified, show labels at those intervals
        if (showLabelEvery && showLabelEvery > 0) {
            return index % showLabelEvery === 0;
        }
        
        // Default: show all labels
        return true;
    };

    // Get custom labels (like "(h)") that are not numeric indices
    const getCustomLabels = () => {
        if (!labelIndices) return [];
        
        return labelIndices.filter(label => {
            if (typeof label === 'string') {
                const numericIndex = parseInt(label, 10);
                return isNaN(numericIndex); // Keep only non-numeric strings
            }
            return false;
        });
    };

    const customLabels = getCustomLabels();

    // Calculate selected bar position and create info bubble data
    const selectedBarData =
        selectedBarIndex >= 0 && selectedBarIndex < data.length
            ? data[selectedBarIndex]
            : null;

    // Calculate the exact center position of the selected bar within the scroll content
    const selectedBarCenterX =
        selectedBarIndex >= 0
            ? selectedBarIndex * (barWidth + barGap) + barWidth / 2
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

            <View style={[styles.container, { height: chartHeight + paddingBottom }]}>
                {/* Info bubble positioned within the scroll content */}
                {selectedBarCenterX !== null && infoBubbleData && (
                    <InfoBubble
                        data={infoBubbleData}
                        centerX={selectedBarCenterX}
                        topY={-60}
                        formatValue={formatValue}
                    />
                )}

                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={intervalType !== "hours"} // Disable scroll for hours mode
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
                    bounces={intervalType !== "hours"} // Disable bounces for hours mode
                    bouncesZoom={false}
                    maximumZoomScale={1}
                    minimumZoomScale={1}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="auto"
                    nestedScrollEnabled={true}
                >
                    {/* Background pressable to handle taps outside bars */}
                    <Pressable
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1,
                        }}
                        onPress={() => {
                            console.log("Background Pressable pressed - calling onTapOutside");
                            onTapOutside?.();
                        }}
                    />

                    {data.map((item, index) => {
                        const isSelected = selectedBarIndex === index;

                        const handleBarPress = () => {
                            console.log("Bar pressed, index:", index, "label:", item.day);
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
                                        zIndex: 10, // Above background pressable
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
                                    <View style={[
                                        styles.labelContainer,
                                        {
                                            minWidth: intervalType === "hours" ? barWidth : DEFAULT_BAR_WIDTH,
                                        }
                                    ]}>
                                        {shouldShowLabel(index) && (
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
                                                        fontSize: intervalType === "hours" 
                                                            ? Math.max(7, Math.min(10, barWidth * 0.5)) // Responsive based on actual bar width
                                                            : DEFAULT_LABEL_FONT_SIZE,
                                                    },
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {item.day}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    {/* Selection line - positioned absolutely within the scroll content */}
                    {selectedBarCenterX !== null && (
                        <View
                            style={{
                                position: "absolute",
                                left: selectedBarCenterX - 1, // Center the 2px line: centerX - lineWidth/2
                                bottom: paddingBottom,
                                height: chartHeight + 60, // Extend upward to connect with bubble
                                width: 2,
                                pointerEvents: "none", // Don't interfere with scroll
                                zIndex: 1500,
                            }}
                        >
                            <VerticalSelectionLine
                                centerX={0} // Use 0 since we're already positioning the container at the correct left position
                                height={chartHeight}
                                topOffset={0}
                                color={selectionLineColor}
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

                    {/* Custom labels (like "(h)" for hours mode) */}
                    {customLabels.map((label, index) => (
                        <View
                            key={`custom-label-${index}`}
                            style={{
                                position: "absolute",
                                bottom: DEFAULT_LABEL_BOTTOM_POSITION, // Use same bottom position as other labels
                                right: 5 + (index * 25), // Space multiple custom labels
                                pointerEvents: "none",
                                zIndex: 100,
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: intervalType === "hours" ? barWidth : DEFAULT_BAR_WIDTH,
                                height: 20,
                            }}
                        >
                            <Text
                                style={[
                                    styles.dayLabel, // Use same base style as other labels
                                    {
                                        color: resolvedColors.LABEL_TEXT, // Same color as other labels
                                        fontWeight: "normal", // Same weight as other labels
                                        fontSize: intervalType === "hours" 
                                            ? Math.max(7, Math.min(10, barWidth * 0.5)) // Same responsive font size
                                            : DEFAULT_LABEL_FONT_SIZE,
                                    },
                                ]}
                                numberOfLines={1}
                            >
                                {label}
                            </Text>
                        </View>
                    ))}
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
