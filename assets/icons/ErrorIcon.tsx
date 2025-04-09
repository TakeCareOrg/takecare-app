import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const ErrorIcon: React.FC<IconType> = ({
    color,
    height = 30,
    width = 30,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.658 3.132c-1.58-2.895-5.737-2.895-7.316 0l-4.385 8.04c-1.514 2.776.495 6.161 3.658 6.161h8.77c3.163 0 5.172-3.385 3.658-6.162l-4.385-8.039zM8.167 11.5V5.667h1.666V11.5H8.167zM9 14a.833.833 0 100-1.667A.833.833 0 009 14z"
                fill={iconColor}
            />
        </Svg>
    );
};
