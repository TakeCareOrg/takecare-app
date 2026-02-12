import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import LinearGradient from "@app/components/ui/linear-gradiant";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";

interface OneValueBarChartProps {
    minValue?: number;
    maxValue: number;
    value: number;
    label?: string;
    gradients?: string[];
    lineColor?: string;
    onPress?: () => void;
}

export function OneValueBarChart({
    maxValue,
    value,
    label,
    gradients,
    lineColor,
    onPress = () => {},
}: OneValueBarChartProps) {
    const colors = useColorTheme();

    // Calculate the width percentages of the bar segments

    // Calculate the width of the sleep segment
    const getValueWidth = () => {
        return (value / maxValue) * 100;
    };

    const gradient = useMemo(() => {
        if (!gradients?.length) {
            return ["transparent", "transparent"];
        }

        // i see how many times the value can fit in the maxValue
        const times = Math.floor(maxValue / value);
        const sliceTimes = gradients.length - times;

        return gradients?.splice(0, sliceTimes);
    }, [gradients, maxValue, value]);

    return (
        <TouchableOpacity onPress={onPress}>
            {label && (
                <View style={{ marginBottom: 20 }}>
                    <Text weight="600">{label}</Text>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Text weight="600">{value}</Text>
                        <Text
                            fontSize={10}
                            weight="600"
                            color={colors.secondary}
                        >
                            /{maxValue}
                        </Text>
                    </View>
                </View>
            )}

            <View
                style={{
                    ...styles.container,
                    ...{ backgroundColor: colors.card },
                }}
            >
                {gradients?.length ? (
                    <LinearGradient
                        colors={gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            borderRadius: 5,
                            width:
                                value >= maxValue
                                    ? "100%"
                                    : `${getValueWidth()}%`,
                            height: "100%",
                        }}
                    />
                ) : (
                    <View
                        style={[
                            {
                                width:
                                    value >= maxValue
                                        ? "100%"
                                        : `${getValueWidth()}%`,
                                backgroundColor: lineColor,
                                zIndex: 100,
                                borderRadius: 5,
                            },
                        ]}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 5,
        borderRadius: 5,
        marginVertical: 4,
    },
    minText: {
        fontSize: 12,
    },
    maxText: {
        fontSize: 10,
    },
});
