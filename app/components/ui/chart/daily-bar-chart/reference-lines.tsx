import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { DottedLine } from "@app/components/ui/chart/line";
import { useColorTheme } from "@app/hooks/use-color-theme";

import {
    COLORS,
    DOT_SIZE,
    GAP_SIZE,
    LINE_HEIGHT,
    LINE_STOP_MARGIN,
    PADDING_BOTTOM,
    RIGHT_PADDING_WIDTH,
    Z_INDEX,
} from "./constants";

interface ReferenceLine {
    value: number;
    label: string;
}

interface ReferenceLinesProps {
    referenceLines: ReferenceLine[];
    animatedPositions: Animated.Value[];
}

export const ReferenceLines: React.FC<ReferenceLinesProps> = ({
    referenceLines,
    animatedPositions,
}) => {
    const colors = useColorTheme();

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
                            ]}
                        >
                            {/* Only the dotted line, without inline label */}
                            <View style={styles.dottedLineOnly}>
                                <DottedLine
                                    color={COLORS.NORMAL_BAR}
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
                        width: RIGHT_PADDING_WIDTH,
                        top: 0,
                        bottom: PADDING_BOTTOM,
                        right: 0,
                    },
                ]}
            />

            {/* Reference labels on the right side */}
            <View
                style={[
                    styles.referenceLabelsContainer,
                    {
                        width: RIGHT_PADDING_WIDTH,
                        top: 0,
                        bottom: PADDING_BOTTOM,
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
                                { backgroundColor: colors.background },
                            ]}
                        >
                            <Text style={styles.referenceLabel}>
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
                        right: RIGHT_PADDING_WIDTH,
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
        right: RIGHT_PADDING_WIDTH + LINE_STOP_MARGIN, // Stop before the label area with margin
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
        left: 0,
        right: 0,
        alignItems: "flex-end",
        paddingRight: 4,
        height: 16, // Hauteur fixe pour le label
        justifyContent: "center",
    },
    referenceLabel: {
        color: COLORS.REFERENCE_LABEL,
        fontSize: 12,
        fontWeight: "600",
        paddingHorizontal: 2,
    },
});
