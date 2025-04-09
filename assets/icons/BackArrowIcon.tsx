import React from "react";
import { useColors } from "../../src/styles/Colors";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const BackArrowIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
    style = {},
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 30 30"
            fill="none"
            style={style}
        >
            <Path
                d="M22.5 26.4619L21.0225 28.125L7.5 15L21.0225 1.875L22.5 3.53812L10.6913 15L22.5 26.4619Z"
                fill={iconColor}
            />
        </Svg>
    );
};
