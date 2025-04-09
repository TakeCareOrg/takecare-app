import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const CheckIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
    style = {},
    onPress = () => {},
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            style={style}
            onPress={onPress}
        >
            <Path
                d="M5 11.9999C5 12.791 5.2346 13.5644 5.67412 14.2222C6.11365 14.88 6.73836 15.3926 7.46927 15.6954C8.20017 15.9981 9.00444 16.0774 9.78036 15.923C10.5563 15.7687 11.1569 15.4999 11.8284 14.8283L20.5 6.15674"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
