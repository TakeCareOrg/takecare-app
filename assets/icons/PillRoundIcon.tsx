import React from "react";
import { Circle, Path, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const PillRoundIcon: React.FC<IconType> = ({
    color = useColors().main.primary,
    height = 30,
    width = 30,
}) => (
    <Svg width={width} height={height} fill="none">
        <Circle
            cx="12"
            cy="12"
            r="9"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
        />
        <Path
            d="M12 3V21"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
        />
    </Svg>
);
