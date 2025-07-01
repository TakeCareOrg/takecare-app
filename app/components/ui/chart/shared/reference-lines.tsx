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
const Z_INDEX = {
    LABEL_BG: 5,
    REFERENCE_LABELS: 15,
};

export interface ReferenceLine {
    value: number;
    label: string;
}

interface ReferenceLinesprops {
    referenceLines: ReferenceLine[];
    animatedPositions: Animated.Value[];
    /** Right padding width for label area */
    rightPaddingWidth?: number;
    /** Bottom padding */
    paddingBottom?: number;
    /** Custom colors */
    colors?: {
        line?: string;
        label?: string;
        background?: string;
    };
}

export const ReferenceLines: React.FC<ReferenceLinesprops> = ({
    referenceLines,
    animatedPositions,
    rightPaddingWidth = 30,
    paddingBottom = 30,
    colors: customColors,
}) => {
    const themeColors = useColorTheme();

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
                    { top: 0, bottom: paddingBottom },
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
                                { right: rightPaddingWidth + LINE_STOP_MARGIN },
                            ]}
                        >
                            {/* Only the dotted line, without inline label */}
                            <View style={styles.dottedLineOnly}>
                                <DottedLine
                                    color={resolvedColors.line}
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
                        width: rightPaddingWidth,
                        top: 0,
                        bottom: paddingBottom,
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
                        width: rightPaddingWidth,
                        top: 0,
                        bottom: paddingBottom,
                        right: 0,
                    },
                ]}
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
                                    { color: resolvedColors.label },
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
                        bottom: paddingBottom,
                        left: 0,
                        right: rightPaddingWidth,
                        backgroundColor: resolvedColors.border,
                    },
                ]}
            />
        </>
    );
};

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
        left: 0,
        right: 0,
        alignItems: "flex-end",
        paddingRight: 4,
        height: 16, // Hauteur fixe pour le label
        justifyContent: "center",
    },
    referenceLabel: {
        fontSize: 12,
        fontWeight: "600",
        paddingHorizontal: 2,
    },
});
