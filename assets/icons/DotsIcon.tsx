import React from "react";
import { Circle, Svg } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";
import { useColors } from "../../src/styles/Colors";

export const DotsIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
            <Circle cx="6" cy="15" r="2" fill={iconColor} />
            <Circle cx="15" cy="15" r="2" fill={iconColor} />
            <Circle cx="24" cy="15" r="2" fill={iconColor} />
        </Svg>
    );
};
