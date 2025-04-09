import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const DrugStoreIcon: React.FC<IconType> = ({
    color,
    height = 30,
    width = 30,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M11 16L16 11C17.1046 9.89543 18.8954 9.89543 20 11C21.1046 12.1046 21.1046 13.8954 20 15L15 20C13.8954 21.1046 12.1046 21.1046 11 20C9.89543 18.8954 9.89543 17.1046 11 16Z"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <Path
                d="M22 9V7C22 4.79086 20.2091 3 18 3H6C3.79086 3 2 4.79086 2 7V9V9.5C2 10.8807 3.11929 12 4.5 12V12C5.88071 12 7 10.8807 7 9.5V9"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <Path
                d="M7 8V9.5C7 10.8807 8.11929 12 9.5 12V12C10.8807 12 12 10.8807 12 9.5V8"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <Path
                d="M8 21V21C5.79086 21 4 19.2091 4 17V12"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <Path
                d="M13 13L18 18"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
