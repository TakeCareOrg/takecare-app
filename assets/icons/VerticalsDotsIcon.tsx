import React from "react";
import { Svg, Circle } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const VerticalsDotsIcon: React.FC<IconType> = ({
    color,
    height = 30,
    width = 30,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
            <Circle cx="15.5" cy="5.5" r="2.5" fill={iconColor} />
            <Circle cx="15.5" cy="15.5" r="2.5" fill={iconColor} />
            <Circle cx="15.5" cy="25.5" r="2.5" fill={iconColor} />
        </Svg>
    );
};
