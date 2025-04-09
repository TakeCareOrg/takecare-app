import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const FlagIcon: React.FC<IconType> = ({
    color,
    height = 30,
    width = 30,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M10 4C7.23858 4 5 6.23858 5 9V21H7V14H11.5858L13.5858 16H15C17.7614 16 20 13.7614 20 11C20 8.23858 17.7614 6 15 6H14.4142L12.4142 4H10Z"
                fill={iconColor}
            />
        </Svg>
    );
};
