import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const HealthIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
            <Path
                d="M2.5 11.4214C2.5 17.5 7.52429 20.7393 11.2022 23.6386C12.5 24.6618 13.75 25.625 15 25.625C16.25 25.625 17.5 24.6618 18.7979 23.6386C22.4757 20.7393 27.5 17.5 27.5 11.4214C27.5 5.3427 20.6248 1.03183 15 6.87579C9.3752 1.03183 2.5 5.3427 2.5 11.4214Z"
                fill={iconColor}
            />
        </Svg>
    );
};
