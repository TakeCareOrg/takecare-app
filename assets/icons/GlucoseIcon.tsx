import React from "react";
import { Path, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const GlucoseIcon: React.FC<IconType> = ({
    color,
    colorSecondary,
    height = 20,
    width = 20,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;
    const iconColorSecondary = colorSecondary || main.secondary;

    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
            <Path
                d="M17.5 24.3125C16.4226 25.2762 15.0897 25.908 13.6617 26.1319C12.2337 26.3558 10.7713 26.1622 9.45073 25.5745C8.13011 24.9869 7.00745 24.0301 6.21784 22.8193C5.42824 21.6086 5.00532 20.1955 5 18.75C5 13.75 7.5 12.5 12.5 3.75C15.1 8.2875 17.0125 10.8125 18.2625 12.875"
                stroke={iconColorSecondary}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M20 10C16.6625 15.8375 15 16.6625 15 20C15 21.3261 15.5268 22.5979 16.4645 23.5355C17.4021 24.4732 18.6739 25 20 25C21.3261 25 22.5979 24.4732 23.5355 23.5355C24.4732 22.5979 25 21.3261 25 20C25 16.6625 23.3375 15.8375 20 10Z"
                stroke={iconColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
