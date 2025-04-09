import React from "react";
import { Path, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const ArrowLeft: React.FC<IconType> = ({
    color,
    height = 100,
    width = 100,
    onPress = () => {},
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 300 300"
            fill="none"
            onPress={onPress}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M203.25 250.918L15 150.459L203.25 50V101.459H284V198.459H203.25V250.918Z"
                fill={iconColor}
            />
        </Svg>
    );
};
