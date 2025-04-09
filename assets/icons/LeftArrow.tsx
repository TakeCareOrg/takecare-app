import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const LeftIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
            <Path
                d="M5 17.6413L5.985 18.75L15 10L5.985 1.25L5 2.35875L12.8725 10L5 17.6413Z"
                fill={iconColor}
            />
        </Svg>
    );
};
