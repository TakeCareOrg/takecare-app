import React from "react";
import { Path, Svg } from "react-native-svg";

import { colors } from "@constants/colors";
import { IconType } from "@dtypes/icon";

export const RobotIcon = ({
    color = colors.white[50],
    height = 30,
    width = 30,
}: IconType) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
            d="M9 14C9.55228 14 10 13.5523 10 13C10 12.4477 9.55228 12 9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14Z"
            fill={color}
        />
        <Path
            d="M16 13C16 13.5523 15.5523 14 15 14C14.4477 14 14 13.5523 14 13C14 12.4477 14.4477 12 15 12C15.5523 12 16 12.4477 16 13Z"
            fill={color}
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 14H3.07089C3.55612 17.3923 6.47353 20 10 20H14C17.5265 20 20.4439 17.3923 20.9291 14H22V12H20.9291C20.4439 8.60771 17.5265 6 14 6H10C6.47353 6 3.55612 8.60771 3.07089 12H2V14ZM8.22549 8.32404C6.34004 9.03995 5 10.8635 5 13C5 15.7614 7.23858 18 10 18H14C16.7614 18 19 15.7614 19 13C19 10.8635 17.66 9.03995 15.7745 8.32404C15.5778 8.88484 15.2567 9.40019 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.74333 9.40019 8.42222 8.88484 8.22549 8.32404Z"
            fill={color}
        />
    </Svg>
);
