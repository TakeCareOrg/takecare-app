import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const IndicatorIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
            <Path d="M15 5L23.6603 21.5H6.33975L15 5Z" fill={iconColor} />
        </Svg>
    );
};
