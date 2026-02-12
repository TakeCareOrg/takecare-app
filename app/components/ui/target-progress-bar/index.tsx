import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { ProgressColors } from "@app/types/global";

import { Text } from "../text";

interface TargetRange {
    min: number;
    max: number;
}

interface TargetProgressBarProps {
    currentValue: number; // Current value
    targetRange: TargetRange; // Target range (min/max)
    title?: string; // Title text
    valueText?: string; // Value text
    colors: ProgressColors; // Custom colors
    unit?: string; // Unit for labels
    formatLabel?: (value: number) => string;
    onPress?: () => void;
}

export function TargetProgressBar({
    currentValue,
    targetRange,
    title,
    valueText,
    colors,
    unit = "",
    formatLabel = (value: number) => `${value}${unit}`,
    onPress,
}: TargetProgressBarProps) {
    const colorsTheme = useColorTheme();

    // Calculate under-target section width (always filled if we reach min)
    const getUnderTargetWidth = () => {
        if (currentValue >= targetRange.min) {
            return 100; // Fully filled if we've reached the minimum
        }
        return Math.min((currentValue / targetRange.min) * 100, 100);
    };

    // Calculate target section width
    const getTargetWidth = () => {
        if (currentValue < targetRange.min) {
            return 0; // Not in target range yet
        }

        if (currentValue > targetRange.max) {
            return 100; // Fully filled, exceeded target
        }

        return (
            ((currentValue - targetRange.min) /
                (targetRange.max - targetRange.min)) *
            100
        );
    };

    // Calculate over-target section width
    const getOverTargetWidth = () => {
        if (currentValue <= targetRange.max) {
            return 0; // Haven't exceeded max yet
        }

        const excess = currentValue - targetRange.max;
        const targetSpan = targetRange.max - targetRange.min;
        return Math.min((excess / targetSpan) * 100, 100);
    };

    return (
        <TouchableOpacity onPress={onPress}>
            {(title || valueText) && (
                <View style={{ marginBottom: 20 }}>
                    {title && <Text weight="600">{title}</Text>}
                    {valueText && <Text weight="600">{valueText}</Text>}
                </View>
            )}

            {/* Progress bar */}
            <View
                style={[
                    styles.container,
                    { backgroundColor: colorsTheme.progress },
                ]}
            >
                {/* Under-target section */}
                <View style={[styles.barSegment, { flex: 1 }]}>
                    <View
                        style={[
                            styles.barSegment,
                            {
                                flex: 1,
                                width: `${getUnderTargetWidth()}%`,
                                backgroundColor: colors.under,
                            },
                        ]}
                    />
                </View>

                {/* Target section */}
                <View style={[styles.middleSegmentContainer, { flex: 1 }]}>
                    <View
                        style={{
                            flex: 1,
                            width: "100%",
                            backgroundColor: colorsTheme.progress,
                        }}
                    >
                        {/* Min label */}
                        <Text style={[styles.text, styles.minText]}>
                            {formatLabel(targetRange.min)}
                        </Text>

                        {/* Target progress bar */}
                        <View
                            style={[
                                {
                                    flex: 1,
                                    width: `${getTargetWidth()}%`,
                                    backgroundColor: colors.target,
                                    borderTopRightRadius:
                                        getOverTargetWidth() > 0 ? 0 : 5,
                                    borderBottomRightRadius:
                                        getOverTargetWidth() > 0 ? 0 : 5,
                                },
                            ]}
                        />

                        {/* Max label */}
                        <Text style={[styles.text, styles.maxText]}>
                            {formatLabel(targetRange.max)}
                        </Text>
                    </View>
                </View>

                {/* Over-target section */}
                <View style={{ width: "100%", flex: 1 }}>
                    <View
                        style={[
                            styles.barSegmentRight,
                            {
                                flex: 1,
                                width: `${getOverTargetWidth()}%`,
                                backgroundColor: colors.over,
                            },
                        ]}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 5,
        width: "100%",
        borderRadius: 5,
    },
    barSegment: {
        height: "100%",
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    barSegmentRight: {
        height: "100%",
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    middleSegmentContainer: {
        height: "100%",
        justifyContent: "center",
        position: "relative",
    },
    text: {
        position: "absolute",
        top: -22,
        fontWeight: "bold",
    },
    minText: {
        left: -10,
    },
    maxText: {
        right: -10,
    },
});
