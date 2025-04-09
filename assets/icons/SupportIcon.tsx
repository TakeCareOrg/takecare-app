import React from "react";
import { Svg, Path } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const SupportIcon: React.FC<IconType> = ({
    color = "#EEEEEE",
    height = 15,
    width = 15,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
            <Path
                d="M9.2491 9.26777C10.2254 8.29146 10.2254 6.70854 9.2491 5.73223C8.27279 4.75592 6.68988 4.75592 5.71357 5.73223C4.73726 6.70854 4.73726 8.29146 5.71357 9.26777C6.68988 10.2441 8.27279 10.2441 9.2491 9.26777Z"
                stroke={iconColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M11.9008 11.9194C14.3416 9.47864 14.3416 5.52136 11.9008 3.08058C9.46005 0.639806 5.50277 0.639806 3.062 3.08058C0.621219 5.52136 0.621219 9.47864 3.062 11.9194C5.50277 14.3602 9.46005 14.3602 11.9008 11.9194Z"
                stroke={iconColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M3.125 3.125L5.625 5.625"
                stroke={iconColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9.375 5.625L11.875 3.125"
                stroke={iconColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9.375 9.375L11.875 11.875"
                stroke={iconColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M5.625 9.375L3.125 11.875"
                stroke={iconColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
