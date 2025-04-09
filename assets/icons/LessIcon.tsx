import React from "react";
import { Line, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const LessIcon: React.FC<IconType> = ({
    color,
    height = 8,
    width = 1,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 8 1" fill="none">
            <Line
                y1="0.75"
                x2="8"
                y2="0.75"
                stroke={iconColor}
                strokeWidth="0.5"
            />
        </Svg>
    );
};
