import { View } from "react-native";

import { colors } from "@app/constants/colors";

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
    color = colors.green[500],
    backgroundColor = colors.black[200],
    height = 7,
    width = "100%",
    borderRadius = 2,
}: ProgressBarProps) => {
    return (
        <View
            style={{
                width: width as number,
                height: height,
                backgroundColor: backgroundColor,
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
                    backgroundColor: color,
                }}
            />
        </View>
    );
};
