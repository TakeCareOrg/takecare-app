import React from "react";
import { Path, Rect, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const NoMoodIcon: React.FC<IconType> = ({
    color = useColors().main.primary,
    colorSecondary = useColors().main.secondary,
    height = 30,
    width = 30,
}) => (
    <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
        <Rect width="15" height="15" rx="7.5" fill={colorSecondary} />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.25 4.375C10.5952 4.375 10.875 4.74481 10.875 5.201L10.875 7.679C10.875 8.13519 10.5952 8.505 10.25 8.505C9.90482 8.505 9.625 8.13519 9.625 7.679L9.625 5.201C9.625 4.74481 9.90482 4.375 10.25 4.375Z"
            fill={color}
        />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.75 4.375C5.09518 4.375 5.375 4.74481 5.375 5.201L5.375 7.679C5.375 8.13519 5.09518 8.505 4.75 8.505C4.40482 8.505 4.125 8.13519 4.125 7.679L4.125 5.201C4.125 4.74481 4.40482 4.375 4.75 4.375Z"
            fill={color}
        />
    </Svg>
);
