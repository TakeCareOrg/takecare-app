import React from "react";
import { Svg, Path } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const SearchIcon: React.FC<IconType> = ({
    color = useColors().main.primary,
    height = 30,
    width = 30,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 50 50" fill="none">
            <Path
                d="M34.7344 34.6692L43.75 43.75M39.5833 22.9167C39.5833 32.1215 32.1215 39.5833 22.9167 39.5833C13.7119 39.5833 6.25 32.1215 6.25 22.9167C6.25 13.7119 13.7119 6.25 22.9167 6.25C32.1215 6.25 39.5833 13.7119 39.5833 22.9167Z"
                stroke={iconColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
