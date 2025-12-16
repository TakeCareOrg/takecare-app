import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { DottedLine } from "@app/components/ui/chart/line";
import { useColorTheme } from "@app/hooks/use-color-theme";

// Import constants that should be made configurable or shared
const COLORS = {
    NORMAL_BAR: "#3B5AFB",
    REFERENCE_LABEL: "blue",
    LABEL_TEXT: "#888",
};

const DOT_SIZE = 1;
const GAP_SIZE = 4;
const LINE_HEIGHT = 1;
const LINE_STOP_MARGIN = 10;
const LABEL_WIDTH_PX_PER_CHAR = 8; // Approximate pixels per character
const LABEL_WIDTH_PADDING = 12; // Additional padding for label width
const Z_INDEX = {
    LABEL_BG: 5,
    REFERENCE_LABELS: 15,
};

export interface ReferenceLine {
    value: number;
    label: string;
    color?: string; // Couleur spécifique pour cette ligne de référence
}

interface ReferenceLinesprops {
    referenceLines: ReferenceLine[];
    animatedPositions: Animated.Value[];
    /** Right padding width for label area */
    rightPaddingWidth?: number;
    /** Bottom padding */
    paddingBottom?: number;
    /** Chart height for proper positioning */
    chartHeight?: number;
    /** Custom colors */
    colors?: {
        line?: string;
        label?: string;
        background?: string;
    };
}

export function ReferenceLines({
    referenceLines,
    animatedPositions,
    rightPaddingWidth = 30,
    chartHeight = 100,
    colors: customColors,
}: ReferenceLinesprops) {
    const themeColors = useColorTheme();

    // Calculate dynamic label width based on longest label
    const labelWidth = React.useMemo(() => {
        if (!referenceLines || referenceLines.length === 0)
            return rightPaddingWidth;

        const maxLength = Math.max(
            ...referenceLines.map((line) => line.label.length),
        );

        return Math.max(
            rightPaddingWidth,
            maxLength * LABEL_WIDTH_PX_PER_CHAR + LABEL_WIDTH_PADDING,
        );
    }, [referenceLines, rightPaddingWidth]);

    const resolvedColors = {
        line: customColors?.line || COLORS.NORMAL_BAR,
        label: customColors?.label || COLORS.REFERENCE_LABEL,
        background: customColors?.background || themeColors.background,
        border: COLORS.LABEL_TEXT,
    };

    return (
        <>
            {/* Reference lines that stop before the padding area */}
            <View
                style={[
                    styles.referenceLinesContainer,
                    {
                        top: 0,
                        height: chartHeight,
                    },
                ]}
            >
                {referenceLines.map((line, index) => {
                    const animatedStyle = {
                        bottom: animatedPositions[index],
                    };

                    // Use line-specific color if available, otherwise use global color
                    const lineColor = line.color || resolvedColors.line;

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
                                    color={lineColor}
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
                        height: chartHeight,
                        right: 0,
                        backgroundColor: resolvedColors.background,
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
                        height: chartHeight,
                        right: 0,
                    },
                ]}
                pointerEvents="none"
            >
                {referenceLines.map((line, index) => {
                    const animatedStyle = {
                        bottom: animatedPositions[index],
                        transform: [{ translateY: 7 }], // Center the label on the line
                    };

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.referenceLabelContainer,
                                animatedStyle,
                                { backgroundColor: resolvedColors.background },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.referenceLabel,
                                    {
                                        color:
                                            line.color || resolvedColors.label,
                                    },
                                ]}
                            >
                                {line.label}
                            </Text>
                        </Animated.View>
                    );
                })}
            </View>
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
        alignItems: "flex-end",
        paddingRight: 4,
        height: 16,
        justifyContent: "center",
        minWidth: 50,
    },
    referenceLabel: {
        fontSize: 12,
        fontWeight: "600",
        paddingHorizontal: 2,
        textAlign: "right",
    },
});
