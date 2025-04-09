import React from "react";
import { Svg, Path, Circle } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";
import { useColors } from "../../src/styles/Colors";

export const DrugContainerIcon: React.FC<IconType> = ({
    color,
    height = 30,
    width = 30,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M8 7.5C8 7.22386 8.22386 7 8.5 7H15.5C15.7761 7 16 7.22386 16 7.5V17C16 19.2091 14.2091 21 12 21V21C9.79086 21 8 19.2091 8 17V7.5Z"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <Path
                d="M6 5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V5C18 6.10457 17.1046 7 16 7H8C6.89543 7 6 6.10457 6 5V5Z"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <Path
                d="M10 3L10 7"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <Path
                d="M14 3V7"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <Circle cx="12" cy="12" r="1" fill={iconColor} />
            <Circle cx="12" cy="15" r="1" fill={iconColor} />
        </Svg>
    );
};
