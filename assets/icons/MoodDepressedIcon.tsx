import React from "react";
import { useColors } from "../../src/styles/Colors";
import { Svg, Path, Rect } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const MoodDepressedIcon: React.FC<IconType> = ({
    color,
    colorSecondary,
    height = 30,
    width = 30,
    onPress = () => {},
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;
    const iconColorSecondary = colorSecondary || main.secondary;

    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            fill="none"
            onPress={onPress}
        >
            <Rect width="100" height="100" rx="50" fill={iconColor} />
            <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M63.7204 26.2204C65.3476 24.5932 67.9858 24.5932 69.6129 26.2204L82.1129 38.7204C83.7401 40.3476 83.7401 42.9858 82.1129 44.6129C80.4858 46.2401 77.8476 46.2401 76.2204 44.6129L63.7204 32.1129C62.0932 30.4858 62.0932 27.8476 63.7204 26.2204Z"
                fill={iconColorSecondary}
            />
            <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M82.1126 26.2204C83.7398 27.8476 83.7398 30.4858 82.1126 32.1129L69.6126 44.6129C67.9854 46.2401 65.3472 46.2401 63.7201 44.6129C62.0929 42.9858 62.0929 40.3476 63.7201 38.7204L76.2201 26.2204C77.8472 24.5932 80.4854 24.5932 82.1126 26.2204Z"
                fill={iconColorSecondary}
            />
            <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.8874 26.2204C19.5146 24.5932 22.1528 24.5932 23.7799 26.2204L36.2799 38.7204C37.9071 40.3476 37.9071 42.9858 36.2799 44.6129C34.6528 46.2401 32.0146 46.2401 30.3874 44.6129L17.8874 32.1129C16.2602 30.4858 16.2602 27.8476 17.8874 26.2204Z"
                fill={iconColorSecondary}
            />
            <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M36.2796 26.2204C37.9068 27.8476 37.9068 30.4858 36.2796 32.1129L23.7796 44.6129C22.1524 46.2401 19.5142 46.2401 17.8871 44.6129C16.2599 42.9858 16.2599 40.3476 17.8871 38.7204L30.3871 26.2204C32.0142 24.5932 34.6524 24.5932 36.2796 26.2204Z"
                fill={iconColorSecondary}
            />
            <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M34.7811 59.3328C39.1472 55.9826 44.4968 54.1666 50.0001 54.1666C55.5035 54.1666 60.8531 55.9826 65.2192 59.3328C69.5853 62.683 72.7239 67.3803 74.1483 72.6962C74.7439 74.9189 73.4248 77.2037 71.202 77.7993C68.9792 78.3948 66.6945 77.0758 66.0989 74.853C65.1493 71.3091 63.0569 68.1776 60.1462 65.9441C57.2354 63.7106 53.669 62.5 50.0001 62.5C46.3312 62.5 42.7649 63.7106 39.8541 65.9441C36.9434 68.1776 34.851 71.3091 33.9014 74.853C33.3058 77.0757 31.021 78.3948 28.7983 77.7992C26.5755 77.2037 25.2564 74.9189 25.852 72.6961C27.2764 67.3803 30.415 62.683 34.7811 59.3328Z"
                fill={iconColorSecondary}
            />
        </Svg>
    );
};
