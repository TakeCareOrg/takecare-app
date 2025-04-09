import React from "react";
import { Path, Rect, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const MoodSadIcon: React.FC<IconType> = ({
    color = useColors().main.primary,
    colorSecondary = useColors().main.secondary,
    height = 30,
    width = 30,
    onPress = () => {},
}) => (
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
            d="M34.7811 59.3328C39.1472 55.9826 44.4968 54.1666 50.0001 54.1666C55.5035 54.1666 60.8531 55.9826 65.2192 59.3328C69.5853 62.683 72.7239 67.3803 74.1483 72.6962C74.7439 74.9189 73.4248 77.2037 71.202 77.7993C68.9792 78.3948 66.6945 77.0758 66.0989 74.853C65.1493 71.3091 63.0569 68.1776 60.1462 65.9441C57.2354 63.7106 53.669 62.5 50.0001 62.5C46.3312 62.5 42.7649 63.7106 39.8541 65.9441C36.9434 68.1776 34.851 71.3091 33.9014 74.853C33.3058 77.0757 31.021 78.3948 28.7983 77.7992C26.5755 77.2037 25.2564 74.9189 25.852 72.6961C27.2764 67.3803 30.415 62.683 34.7811 59.3328Z"
            fill={colorSecondary}
        />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24.9997 29.1666C27.3009 29.1666 29.1663 31.0321 29.1663 33.3333V45.8333C29.1663 48.1345 27.3009 50 24.9997 50C22.6985 50 20.833 48.1345 20.833 45.8333V33.3333C20.833 31.0321 22.6985 29.1666 24.9997 29.1666Z"
            fill={colorSecondary}
        />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M74.9997 29.1666C77.3009 29.1666 79.1663 31.0321 79.1663 33.3333V45.8333C79.1663 48.1345 77.3009 50 74.9997 50C72.6985 50 70.833 48.1345 70.833 45.8333V33.3333C70.833 31.0321 72.6985 29.1666 74.9997 29.1666Z"
            fill={colorSecondary}
        />
    </Svg>
);
