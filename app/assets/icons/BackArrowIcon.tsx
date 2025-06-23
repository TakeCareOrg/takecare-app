import React from "react";

import { colors } from "@constants/colors";
import { IconType } from "@dtypes/icon";

import { Path, Svg } from "react-native-svg";

export function BackArrowIcon({
    color = colors.white,
    height = 20,
    width = 20,
}: IconType) {
    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
            <Path
                d="M22.5 26.4619L21.0225 28.125L7.5 15L21.0225 1.875L22.5 3.53812L10.6913 15L22.5 26.4619Z"
                fill={color}
            />
        </Svg>
    );
}
