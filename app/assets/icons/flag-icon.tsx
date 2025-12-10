import React from "react";
import { Path, Svg } from "react-native-svg";

import { colors } from "@constants/colors";
import { IconType } from "@dtypes/icon";

export const FlagIcon = ({
    color = colors.white[50],
    height = 30,
    width = 30,
}: IconType) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
            d="M10 4C7.23858 4 5 6.23858 5 9V21H7V14H11.5858L13.5858 16H15C17.7614 16 20 13.7614 20 11C20 8.23858 17.7614 6 15 6H14.4142L12.4142 4H10Z"
            fill={color}
        />
    </Svg>
);
