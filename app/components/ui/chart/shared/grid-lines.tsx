import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColorTheme } from "@app/hooks/use-color-theme";

interface GridLine {
    value: number;
    color?: string;
    opacity?: number;
    label?: string;
}

interface GridLinesProps {
    gridLines: GridLine[];
    chartHeight: number;
    maxValue: number;
    minValue?: number;
    paddingBottom?: number;
    showLabels?: boolean;
    labelColor?: string;
}

export function GridLines({
    gridLines,
    chartHeight,
    maxValue,
    minValue = 0,
    paddingBottom = 0,
    showLabels = false,
    labelColor = "#999",
}: GridLinesProps) {
    const colors = useColorTheme();
    const range = maxValue - minValue;

    return (
        <View
            style={[
                styles.container,
                { top: 0, bottom: paddingBottom, height: chartHeight },
            ]}
            pointerEvents="none"
        >
            {gridLines.map((line, index) => {
                const bottomPosition =
                    ((line.value - minValue) / range) * chartHeight;

                return (
                    <View
                        key={index}
                        style={[
                            styles.gridLineContainer,
                            {
                                bottom: bottomPosition,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.gridLine,
                                {
                                    backgroundColor: line.color || "#4A4A4A",
                                    opacity: line.opacity ?? 0.3,
                                },
                            ]}
                        />
                        {showLabels && line.label && (
                            <Text
                                style={[
                                    styles.gridLabel,
                                    { color: labelColor },
                                    { backgroundColor: colors.box },
                                ]}
                            >
                                {line.label}
                            </Text>
                        )}
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
    },
    gridLineContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
    },
    gridLine: {
        flex: 1,
        height: 1,
    },
    gridLabel: {
        position: "absolute",
        left: -8,
        fontSize: 10,
        fontWeight: "600",
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
});
