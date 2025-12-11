import React from "react";
import { Circle, Svg } from "react-native-svg";

import { colors } from "@app/constants/colors";
import { IconType } from "@dtypes/icon";

export function VerticalsDotsIcon({
    color = colors.white[500],
    height = 30,
    width = 30,
}: IconType) {
    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
            <Circle cx="15.5" cy="5.5" r="2.5" fill={color} />
            <Circle cx="15.5" cy="15.5" r="2.5" fill={color} />
            <Circle cx="15.5" cy="25.5" r="2.5" fill={color} />
        </Svg>
    );
}
