import React from "react";
import { useColors } from "../../src/styles/Colors";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const ArrowRightIcon: React.FC<IconType> = ({
    color,
    height = 30,
    width = 30,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M2 12L21 12"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <Path
                d="M16.5529 17.7956C17.8287 17.4537 18.9561 16.7004 19.7601 15.6526C20.5642 14.6047 21 13.3208 21 12C21 10.6792 20.5642 9.3953 19.7601 8.34743C18.9561 7.29957 17.8287 6.54629 16.5529 6.20445"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
