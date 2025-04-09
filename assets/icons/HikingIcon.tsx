import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const HikingIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} fill="none">
            <Path
                d="M35.1895 55.1807V40.1807L30.1895 35.1807M30.1895 35.1807L32.6895 20.1807M30.1895 35.1807H25.1895M32.6895 20.1807C35.1895 23.0973 39.1895 27.6807 45.1895 27.6807M32.6895 20.1807L32.2425 19.7338C30.8307 18.3219 28.415 19.0533 28.0235 21.0112L25.1895 35.1807M25.1895 35.1807L20.1895 55.1807M45.1895 23.9307V55.1807M20.1895 17.6807H19.4914C18.4153 17.6807 17.4599 18.3692 17.1197 19.3901L13.9395 28.9307L17.6895 30.1807L20.1895 17.6807ZM36.4395 8.93066C36.4395 10.3114 35.3202 11.4307 33.9395 11.4307C32.5587 11.4307 31.4395 10.3114 31.4395 8.93066C31.4395 7.54996 32.5587 6.43066 33.9395 6.43066C35.3202 6.43066 36.4395 7.54996 36.4395 8.93066Z"
                stroke={iconColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
