import React from "react";
import { Path, Rect, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const ArrowUp: React.FC<IconType> = ({
    color,
    height = 100,
    width = 100,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 400 400" fill="none">
            <Rect x="149" y="146" width="102" height="194" fill={iconColor} />
            <Path d="M200 60L342.028 270H57.9718L200 60Z" fill={iconColor} />
        </Svg>
    );
};
