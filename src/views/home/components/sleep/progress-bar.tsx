import { View } from "react-native";
import React from "react";
import { useColors } from "../../../../styles/Colors";

type ProgressBarProps = {
    value: number;
    maxValue?: number;
    minValue?: number;
    color?: string;
    backgroundColor?: string;
    height?: number;
    width?: number | string;
    borderRadius?: number;
};

export const ProgressBar = ({
    value,
    maxValue = 100,
    minValue = 0,
    color,
    backgroundColor,
    height = 7,
    width = "100%",
    borderRadius = 2,
}: ProgressBarProps) => {
    const { main } = useColors();

    return (
        <View
            style={{
                width: width as number,
                height: height,
                backgroundColor: backgroundColor || main.inputBackground,
                borderRadius: borderRadius,
                overflow: "hidden",
            }}
        >
            <View
                style={{
                    width: `${
                        ((value - minValue) / (maxValue - minValue)) * 100
                    }%`,
                    height,
                    backgroundColor: color || main.green,
                }}
            />
        </View>
    );
};
