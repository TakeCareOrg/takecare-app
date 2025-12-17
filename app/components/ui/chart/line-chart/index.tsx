import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useColorTheme } from "@app/hooks/use-color-theme";

import { InfoBubble, VerticalSelectionLine } from "../shared";
import { GridLines } from "../shared/grid-lines";

export interface LineChartDataPoint {
    value: number; // average or main value
    min?: number;
    max?: number;
    timestamp: string;
    label?: string;
}

interface LineChartProps {
    data: LineChartDataPoint[];
    height?: number;
    lineColor?: string;
    fillGradientColors?: [string, string];
    lineWidth?: number;
    showGrid?: boolean;
    gridLineColor?: string;
    maxValue?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    onSelect?: (selectedData: LineChartDataPoint, index: number) => void;
    selectionLineColor?: string;
}

const DEFAULT_HEIGHT = 300;
const DEFAULT_LINE_COLOR = "#FF4444";
const DEFAULT_GRADIENT_COLORS: [string, string] = ["#664444", "#331111"];
const DEFAULT_LINE_WIDTH = 2;
const DEFAULT_PADDING_HORIZONTAL = 20;
const DEFAULT_PADDING_VERTICAL = 20;
const DEFAULT_SELECTION_LINE_COLOR = "#5B7BFB";

export function LineChart({
    data,
    height = DEFAULT_HEIGHT,
    lineColor = DEFAULT_LINE_COLOR,
    fillGradientColors = DEFAULT_GRADIENT_COLORS,
    lineWidth = DEFAULT_LINE_WIDTH,
    showGrid = true,
    gridLineColor = "#4A4A4A",
    maxValue: providedMaxValue,
    paddingHorizontal = DEFAULT_PADDING_HORIZONTAL,
    paddingVertical = DEFAULT_PADDING_VERTICAL,
    onSelect,
    selectionLineColor = DEFAULT_SELECTION_LINE_COLOR,
}: LineChartProps) {
    const colors = useColorTheme();
    const chartHeight = height - paddingVertical * 2;

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [chartWidth, setChartWidth] = useState(0);

    // Calculate min and max values from data with buffer
    const { minValue, maxValue } = useMemo(() => {
        if (providedMaxValue)
            return { minValue: 0, maxValue: providedMaxValue };
        if (data.length === 0) return { minValue: 0, maxValue: 100 };

        // Get actual data range including min/max values
        const allValues: number[] = [];
        data.forEach((point) => {
            if (point.min !== undefined) allValues.push(point.min);
            if (point.max !== undefined) allValues.push(point.max);
            allValues.push(point.value);
        });

        const dataMin = Math.min(...allValues);
        const dataMax = Math.max(...allValues);
        const dataRange = dataMax - dataMin;

        // Add 40% buffer (20% on each side)
        const buffer = dataRange * 0.4;

        // Round to nearest 20 for cleaner values
        const min = Math.floor((dataMin - buffer) / 20) * 20;
        const max = Math.ceil((dataMax + buffer) / 20) * 20;

        return {
            minValue: Math.max(0, min), // Don't go below 0
            maxValue: max,
        };
    }, [data, providedMaxValue]);

    // Generate grid lines with labels
    const gridLines = useMemo(() => {
        const lines = [];
        const range = maxValue - minValue;
        const step = range / 5; // 5 segments

        for (let i = 0; i <= 5; i++) {
            const value = minValue + i * step;
            lines.push({
                value,
                color: gridLineColor,
                opacity: 0.3,
                label: Math.round(value).toString(),
            });
        }

        return lines;
    }, [minValue, maxValue, gridLineColor]);

    // Generate hour labels (show every 6 hours: 6, 12, 18, 00)
    const hourLabels = useMemo(() => {
        const labels = [];
        for (let i = 6; i < 24; i += 6) {
            labels.push({
                hour: i,
                label: `${i.toString().padStart(2, "0")}h`,
            });
        }
        // Add 00h at the end (representing 24h/midnight)
        labels.push({
            hour: 24,
            label: "00h",
        });
        return labels;
    }, []);

    // Generate bar positions from min to max
    const bars = useMemo(() => {
        if (data.length === 0) {
            return [];
        }

        const totalHours = 24; // Always 24 hours in a day
        const range = maxValue - minValue;

        return data.map((point, index) => {
            const pointMin = point.min ?? point.value;
            const pointMax = point.max ?? point.value;

            // Extract hour from label (format: "Xh" or "XXh")
            const hour = parseInt(point.label?.replace("h", "") || "0", 10);

            // Calculate positions relative to the min/max range
            const yMin =
                chartHeight - ((pointMin - minValue) / range) * chartHeight;
            const yMax =
                chartHeight - ((pointMax - minValue) / range) * chartHeight;
            const barHeight = Math.max(yMin - yMax, 2); // Minimum 2px height

            return {
                hour,
                y: yMax,
                height: barHeight,
                minValue: pointMin,
                maxValue: pointMax,
            };
        });
    }, [data, chartHeight, minValue, maxValue]);

    // Calculate selected bar center position
    const selectedBarCenterX = useMemo(() => {
        if (selectedIndex === null) return null;
        const totalHours = 24;
        const spacingPx = chartWidth / totalHours;
        const selectedBar = bars[selectedIndex];
        if (!selectedBar) return null;
        return selectedBar.hour * spacingPx + spacingPx / 2;
    }, [selectedIndex, chartWidth, bars]);

    // Get selected bar data for info bubble
    const selectedBarData = useMemo(() => {
        if (selectedIndex === null) return null;
        return data[selectedIndex];
    }, [selectedIndex, data]);

    if (data.length === 0) {
        return <View style={[styles.container, { height }]} />;
    }

    return (
        <View style={[styles.container, { height, paddingVertical }]}>
            <View
                style={[
                    styles.chartArea,
                    {
                        height: chartHeight,
                        paddingHorizontal,
                    },
                ]}
                onLayout={(event) => {
                    setChartWidth(
                        event.nativeEvent.layout.width - paddingHorizontal * 2,
                    );
                }}
            >
                {/* Grid lines in background */}
                {showGrid && (
                    <GridLines
                        gridLines={gridLines}
                        chartHeight={chartHeight}
                        maxValue={maxValue}
                        minValue={minValue}
                        showLabels={true}
                        labelColor="#999"
                    />
                )}

                {/* Bar Chart */}
                <View style={styles.barsContainer}>
                    {bars.map((bar, index) => {
                        const totalHours = 24;
                        const barWidthPx = (chartWidth / totalHours) * 0.6;
                        const spacingPx = chartWidth / totalHours;
                        const xPx =
                            bar.hour * spacingPx +
                            spacingPx / 2 -
                            barWidthPx / 2;
                        const barHeightPx = bar.height;
                        const yPx = bar.y;

                        return (
                            <Pressable
                                key={index}
                                style={[
                                    styles.bar,
                                    {
                                        left: xPx,
                                        bottom: yPx,
                                        width: barWidthPx,
                                        height: barHeightPx,
                                        borderRadius: barWidthPx / 2,
                                    },
                                ]}
                                /*    onPress={() => {
                                    setSelectedIndex(index);
                                    if (onSelect) {
                                        onSelect(data[index], index);
                                    }
                                }} */ //TODO: will be re-implemented later
                            >
                                <LinearGradient
                                    colors={[
                                        fillGradientColors[0],
                                        fillGradientColors[1],
                                    ]}
                                    style={[
                                        styles.barGradient,
                                        { borderRadius: barWidthPx / 2 },
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                />
                            </Pressable>
                        );
                    })}
                </View>

                {/* Vertical selection line */}
                {selectedBarCenterX !== null && (
                    <VerticalSelectionLine
                        centerX={selectedBarCenterX}
                        height={chartHeight / 2}
                        color={selectionLineColor}
                        extendUpward={10}
                    />
                )}

                {/* Info bubble */}
                {selectedBarData && selectedBarCenterX !== null && (
                    <InfoBubble
                        data={{
                            label: selectedBarData.label || "",
                            value: selectedBarData.value,
                        }}
                        centerX={selectedBarCenterX}
                        topY={10}
                        backgroundColor={colors.raw.blue[500]}
                        formatValue={(value) =>
                            `${Math.round(selectedBarData.min || 0)} - ${Math.round(selectedBarData.max || 0)} BPM`
                        }
                    />
                )}
            </View>

            {/* X-axis hour labels */}
            <View
                style={[
                    styles.xAxisLabels,
                    { height: paddingVertical / 2, paddingHorizontal },
                ]}
            >
                {hourLabels.map((item, index) => {
                    const totalHours = 24;
                    const position = (item.hour / totalHours) * 100;
                    return (
                        <Text
                            key={index}
                            style={[
                                styles.hourLabel,
                                {
                                    left: `${position}%`,
                                },
                            ]}
                        >
                            {item.label}
                        </Text>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
    },
    chartArea: {
        position: "relative",
        width: "100%",
    },
    barsContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    bar: {
        position: "absolute",
        overflow: "hidden",
    },
    barGradient: {
        width: "100%",
        height: "100%",
    },
    xAxisLabels: {
        position: "relative",
        width: "100%",
        flexDirection: "row",
        paddingTop: 8,
    },
    hourLabel: {
        position: "absolute",
        fontSize: 10,
        color: "#999",
        transform: [{ translateX: -8 }],
    },
});
