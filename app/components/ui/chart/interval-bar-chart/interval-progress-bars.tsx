import React from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { Text } from "@app/components/ui/text";

import { InfoBubble, InfoBubbleData } from "../shared/info-bubble";
import { VerticalSelectionLine } from "../shared/vertical-selection-line";

// Type pour les événements de défilement
type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

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
    onScroll: (event: ScrollEvent) => void;
    onMomentumScrollEnd: (event?: ScrollEvent) => void;
    onBarPress: (index: number) => void;
    onScrollBeginDrag?: (event: ScrollEvent) => void;
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
    viewportWidth?: number;
    /** Label display configuration */
    showLabelEvery?: number;
    labelIndices?: (string | number)[];
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
    selectedBar: "#5B7BFB",
    normalBar: "#3B5AFB",
    labelText: "#888",
    selectedLabelText: "#fff",
    selectedLabelBackground: "rgba(0, 0, 0, 0.7)",
};

// ── Individual bar item (memoized to avoid re-rendering all bars) ────
interface IntervalBarItemProps {
    item: IntervalBarDataItem;
    index: number;
    isSelected: boolean;
    dynamicMaxValue: number;
    chartHeight: number;
    barWidth: number;
    barGap: number;
    barActualWidth: number;
    barBorderRadius: number;
    paddingBottom: number;
    resolvedColors: typeof DEFAULT_COLORS;
    intervalType: string;
    showLabel: boolean;
    onBarPress: (index: number) => void;
}

const IntervalBarItem = React.memo(function IntervalBarItem({
    item,
    index,
    isSelected,
    dynamicMaxValue,
    chartHeight,
    barWidth,
    barGap,
    barActualWidth,
    barBorderRadius,
    paddingBottom,
    resolvedColors,
    intervalType,
    showLabel,
    onBarPress,
}: IntervalBarItemProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                styles.barTouchable,
                {
                    width: barWidth + barGap,
                    height: chartHeight + paddingBottom,
                    zIndex: 10,
                },
            ]}
            onPress={() => onBarPress(index)}
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
                <View
                    style={[
                        styles.bar,
                        {
                            width: barActualWidth,
                            height: Math.min(
                                (item.value / dynamicMaxValue) * chartHeight,
                                chartHeight,
                            ),
                            backgroundColor:
                                item.color ||
                                (isSelected
                                    ? resolvedColors.selectedBar
                                    : resolvedColors.normalBar),
                            borderTopLeftRadius: barBorderRadius,
                            borderTopRightRadius: barBorderRadius,
                        },
                    ]}
                />

                <View
                    style={[
                        styles.labelContainer,
                        {
                            minWidth:
                                intervalType === "hours"
                                    ? barWidth
                                    : DEFAULT_BAR_WIDTH,
                        },
                    ]}
                >
                    {showLabel && (
                        <Text
                            style={[
                                styles.dayLabel,
                                {
                                    color: isSelected
                                        ? resolvedColors.selectedLabelText
                                        : resolvedColors.labelText,
                                    fontWeight: isSelected ? "bold" : "normal",
                                    fontSize:
                                        intervalType === "hours"
                                            ? Math.max(
                                                  7,
                                                  Math.min(10, barWidth * 0.5),
                                              )
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
});

// ── Main component (memoized) ────────────────────────────────────────
export const IntervalProgressBars = React.memo(function IntervalProgressBars({
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
    formatValue = (value: number) => value.toString(),
    showLabelEvery,
    labelIndices,
}: IntervalProgressBarsProps) {
    const resolvedColors = React.useMemo(
        () => ({ ...DEFAULT_COLORS, ...colors }),
        [colors],
    );

    // Pre-compute label visibility set for O(1) lookups
    const labelVisibilitySet = React.useMemo(() => {
        if (!labelIndices || labelIndices.length === 0) return null;

        const set = new Set<number>();
        for (const labelIndex of labelIndices) {
            if (typeof labelIndex === "number") {
                set.add(labelIndex);
            } else if (typeof labelIndex === "string") {
                const numericIndex = parseInt(labelIndex, 10);
                if (!isNaN(numericIndex)) {
                    set.add(numericIndex);
                }
            }
        }
        return set;
    }, [labelIndices]);

    const shouldShowLabel = React.useCallback(
        (index: number) => {
            if (intervalType === "hours" && index === 0) return false;
            if (labelVisibilitySet) return labelVisibilitySet.has(index);
            if (showLabelEvery && showLabelEvery > 0)
                return index % showLabelEvery === 0;
            return true;
        },
        [intervalType, labelVisibilitySet, showLabelEvery],
    );

    // Get custom labels (like "(h)") that are not numeric indices
    const customLabels = React.useMemo(() => {
        if (!labelIndices) return [];
        return labelIndices.filter((label) => {
            if (typeof label === "string") {
                return isNaN(parseInt(label, 10));
            }
            return false;
        });
    }, [labelIndices]);

    const selectedBarData =
        selectedBarIndex >= 0 && selectedBarIndex < data.length
            ? data[selectedBarIndex]
            : null;

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
            <View
                style={[
                    styles.container,
                    { height: chartHeight + paddingBottom },
                ]}
            >
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
                    scrollEnabled={intervalType !== "hours"}
                    style={{ height: chartHeight + paddingBottom }}
                    contentContainerStyle={{
                        width: contentWidth,
                        height: chartHeight + paddingBottom,
                    }}
                    onScroll={onScroll}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onScrollEndDrag={onMomentumScrollEnd}
                    onScrollBeginDrag={onScrollBeginDrag}
                    scrollEventThrottle={16}
                    decelerationRate="normal"
                    snapToInterval={undefined}
                    bounces={intervalType !== "hours"}
                    bouncesZoom={false}
                    maximumZoomScale={1}
                    minimumZoomScale={1}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="auto"
                    nestedScrollEnabled={true}
                >
                    <Pressable
                        style={styles.backgroundPressable}
                        onPress={onTapOutside}
                    />

                    {data.map((item, index) => (
                        <IntervalBarItem
                            key={index}
                            item={item}
                            index={index}
                            isSelected={selectedBarIndex === index}
                            dynamicMaxValue={dynamicMaxValue}
                            chartHeight={chartHeight}
                            barWidth={barWidth}
                            barGap={barGap}
                            barActualWidth={barActualWidth}
                            barBorderRadius={barBorderRadius}
                            paddingBottom={paddingBottom}
                            resolvedColors={resolvedColors}
                            intervalType={intervalType}
                            showLabel={shouldShowLabel(index)}
                            onBarPress={onBarPress}
                        />
                    ))}

                    {selectedBarCenterX !== null && (
                        <View
                            style={{
                                position: "absolute",
                                left: selectedBarCenterX - 1,
                                bottom: paddingBottom,
                                height: chartHeight + 60,
                                width: 2,
                                pointerEvents: "none",
                                zIndex: 1500,
                            }}
                        >
                            <VerticalSelectionLine
                                centerX={0}
                                height={chartHeight}
                                topOffset={0}
                                color={selectionLineColor}
                                lineWidth={2}
                                extendUpward={60}
                            />
                        </View>
                    )}

                    <View
                        style={[styles.separator, { bottom: paddingBottom }]}
                    />

                    {customLabels.map((label, index) => (
                        <View
                            key={`custom-label-${index}`}
                            style={{
                                position: "absolute",
                                bottom: DEFAULT_LABEL_BOTTOM_POSITION,
                                right: 5 + index * 25,
                                pointerEvents: "none",
                                zIndex: 100,
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth:
                                    intervalType === "hours"
                                        ? barWidth
                                        : DEFAULT_BAR_WIDTH,
                                height: 20,
                            }}
                        >
                            <Text
                                style={[
                                    styles.dayLabel,
                                    {
                                        color: resolvedColors.labelText,
                                        fontWeight: "normal",
                                        fontSize:
                                            intervalType === "hours"
                                                ? Math.max(
                                                      7,
                                                      Math.min(
                                                          10,
                                                          barWidth * 0.5,
                                                      ),
                                                  )
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
});

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
    backgroundPressable: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
    separator: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: "#888",
        opacity: 0.3,
        pointerEvents: "none",
    },
    barTouchable: {
        // Height will be set dynamically
    },
});
