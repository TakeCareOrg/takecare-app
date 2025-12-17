import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { DottedLine } from "@app/components/ui/chart/line";
import { useColorTheme } from "@app/hooks/use-color-theme";

import {
    COLORS,
    DEFAULT_REFERENCE_LINE_COLORS,
    DOT_SIZE,
    GAP_SIZE,
    LINE_HEIGHT,
    LINE_STOP_MARGIN,
    PADDING_BOTTOM,
    Z_INDEX,
} from "./constants";

interface ReferenceLine {
    value: number;
    label: string;
    lineColor?: string;
    labelColor?: string;
}

interface ReferenceLinesProps {
    referenceLines: ReferenceLine[];
    animatedPositions: Animated.Value[];
    labelWidth: number;
}

export function ReferenceLines({
    referenceLines,
    animatedPositions,
    labelWidth,
}: ReferenceLinesProps) {
    const themeColors = useColorTheme();

    return (
        <>
            {/* Reference lines that stop before the padding area */}
            <View
                style={[
                    styles.referenceLinesContainer,
                    { top: 0, bottom: PADDING_BOTTOM },
                ]}
            >
                {referenceLines.map((line, index) => {
                    const animatedStyle = {
                        bottom: animatedPositions[index],
                    };

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.referenceLineContainer,
                                animatedStyle,
                                { right: labelWidth + LINE_STOP_MARGIN },
                            ]}
                        >
                            {/* Only the dotted line, without inline label */}
                            <View style={styles.dottedLineOnly}>
                                <DottedLine
                                    color={
                                        line.lineColor ||
                                        DEFAULT_REFERENCE_LINE_COLORS.line
                                    }
                                    segmentSize={DOT_SIZE}
                                    gapSize={GAP_SIZE}
                                    height={LINE_HEIGHT}
                                />
                            </View>
                        </Animated.View>
                    );
                })}
            </View>

            {/* Label panel background */}
            <View
                style={[
                    styles.labelBackground,
                    {
                        width: labelWidth,
                        top: 0,
                        bottom: PADDING_BOTTOM,
                        right: 0,
                        backgroundColor: themeColors.background,
                    },
                ]}
            />

            {/* Reference labels on the right side */}
            <View
                style={[
                    styles.referenceLabelsContainer,
                    {
                        width: labelWidth,
                        top: 0,
                        bottom: PADDING_BOTTOM,
                        right: 0,
                    },
                ]}
                pointerEvents="none"
            >
                {referenceLines.map((line, index) => {
                    const animatedStyle = {
                        bottom: animatedPositions[index],
                        transform: [{ translateY: 7 }], //TODO: (need to change the logic to make it responsive) Center the label on the line
                    };

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.referenceLabelContainer,
                                animatedStyle,
                                { backgroundColor: themeColors.background },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.referenceLabel,
                                    {
                                        color:
                                            line.labelColor ||
                                            DEFAULT_REFERENCE_LINE_COLORS.label,
                                    },
                                ]}
                            >
                                {line.label}
                            </Text>
                        </Animated.View>
                    );
                })}
            </View>

            {/* Bottom border line between bars and day labels */}
            <View
                style={[
                    styles.bottomBorderLine,
                    {
                        bottom: PADDING_BOTTOM,
                        left: 0,
                        right: labelWidth,
                        backgroundColor: COLORS.LABEL_TEXT,
                    },
                ]}
            />
        </>
    );
}

const styles = StyleSheet.create({
    referenceLinesContainer: {
        position: "absolute",
        left: 0,
        right: 0,
    },
    referenceLineContainer: {
        position: "absolute",
        left: 0,
    },
    dottedLineOnly: {
        height: LINE_HEIGHT,
    },
    bottomBorderLine: {
        position: "absolute",
        height: 1,
        backgroundColor: COLORS.LABEL_TEXT,
        opacity: 0.3,
    },
    labelBackground: {
        position: "absolute",
        zIndex: Z_INDEX.LABEL_BG,
    },
    referenceLabelsContainer: {
        position: "absolute",
        zIndex: Z_INDEX.REFERENCE_LABELS,
    },
    referenceLabelContainer: {
        position: "absolute",
        right: 0,
        alignItems: "flex-end",
        paddingRight: 4,
        height: 16,
        justifyContent: "center",
    },
    referenceLabel: {
        fontSize: 12,
        fontWeight: "600",
        paddingHorizontal: 2,
        textAlign: "right",
    },
});
