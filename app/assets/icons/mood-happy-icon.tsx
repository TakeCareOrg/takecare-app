import React from "react";
import { Path, Rect, Svg } from "react-native-svg";

import { colors } from "@app/constants/colors";
import { IconType } from "@app/types/icon";

export const MoodHappyIcon = ({
    color = colors.white[50],
    colorSecondary = colors.white[500],
    height = 30,
    width = 30,
    onPress = () => {},
}: IconType) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        onPress={onPress}
    >
        <Rect width="100" height="100" rx="50" fill={color} />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M74.9997 29.1666C77.3009 29.1666 79.1663 31.0321 79.1663 33.3333L79.1663 45.8333C79.1663 48.1345 77.3009 50 74.9997 50C72.6985 50 70.833 48.1345 70.833 45.8333L70.833 33.3333C70.833 31.0321 72.6985 29.1666 74.9997 29.1666Z"
            fill={colorSecondary}
        />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24.9997 29.1666C27.3009 29.1666 29.1663 31.0321 29.1663 33.3333L29.1663 45.8333C29.1663 48.1345 27.3009 50 24.9997 50C22.6985 50 20.833 48.1345 20.833 45.8333L20.833 33.3333C20.833 31.0321 22.6985 29.1666 24.9997 29.1666Z"
            fill={colorSecondary}
        />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M71.202 59.7007C73.4248 60.2963 74.7439 62.5811 74.1483 64.8039C72.7239 70.1197 69.5853 74.817 65.2192 78.1672C60.8531 81.5174 55.5035 83.3334 50.0001 83.3334C44.4968 83.3334 39.1472 81.5174 34.7811 78.1672C30.415 74.817 27.2764 70.1197 25.852 64.8039C25.2564 62.5811 26.5755 60.2963 28.7983 59.7008C31.021 59.1052 33.3058 60.4243 33.9014 62.647C34.851 66.1909 36.9434 69.3224 39.8541 71.5559C42.7649 73.7894 46.3312 75 50.0001 75C53.669 75 57.2354 73.7894 60.1462 71.5559C63.0569 69.3224 65.1493 66.1909 66.0989 62.647C66.6945 60.4243 68.9792 59.1052 71.202 59.7007Z"
            fill={colorSecondary}
        />
    </Svg>
);
