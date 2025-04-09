import React from "react";
import { Path, Rect, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const ArrowDown: React.FC<IconType> = ({
    color,
    height = 100,
    width = 100,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 400 400" fill="none">
            <Rect
                width="102"
                height="194"
                transform="matrix(1 0 0 -1 149 254)"
                fill={iconColor}
            />
            <Path d="M200 340L342.028 130H57.9718L200 340Z" fill={iconColor} />
        </Svg>
    );
};
