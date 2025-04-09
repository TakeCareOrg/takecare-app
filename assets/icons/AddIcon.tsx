import React from "react";
import { Svg, Path } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const AddIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
}) => {
    const { main } = useColors();
    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
            <Path
                d="M15 5L15 25"
                stroke={color || main.primary}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <Path
                d="M5 15H25"
                stroke={color || main.primary}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </Svg>
    );
};
