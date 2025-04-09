import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useColors } from "../../styles/Colors";
import LinearGradient from "react-native-linear-gradient";
import { TextComponent } from "../text-component";

interface OneValueBarChartProps {
    minValue?: number;
    maxValue: number;
    value: number;
    label?: string;
    gradients?: string[];
    lineColor?: string;
}

const OneValueBarChart: React.FC<OneValueBarChartProps> = ({
    maxValue,
    value,
    label,
    gradients,
    lineColor,
}) => {
    const { main } = useColors();

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
    }, [value, maxValue]);

    return (
        <View>
            {label && (
                <View>
                    <TextComponent>{label}</TextComponent>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <TextComponent>{value}</TextComponent>
                        <TextComponent
                            fontSize={10}
                            color={main.containerTitle}
                        >
                            /{maxValue}
                        </TextComponent>
                    </View>
                </View>
            )}

            <View
                style={{
                    ...styles.container,
                    ...{ backgroundColor: main.inputBackground },
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
        </View>
    );
};

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

export default OneValueBarChart;
