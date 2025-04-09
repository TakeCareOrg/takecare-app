import React from "react";
import { Svg, Path } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const SmokeIcon: React.FC<IconType> = ({
    color,
    height = 7,
    width = 31,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 31 7" fill="none">
            <Path
                d="M29.1363 2.09082H25.0454V4.81807H29.1363V2.09082Z"
                fill={iconColor}
            />
            <Path
                d="M23.6819 2.09082H7.31821V4.81807H23.6819V2.09082Z"
                fill={iconColor}
            />
            <Path
                d="M29.8182 0.727539H6.63636C6.25931 0.727539 5.95456 1.03228 5.95456 1.40934V5.50029C5.95456 5.87734 6.25931 6.18209 6.63636 6.18209H29.8182C30.1952 6.18209 30.4999 5.87734 30.4999 5.50029V1.40939C30.5 1.03234 30.1953 0.727539 29.8182 0.727539ZM7.31821 2.09119H23.6819V4.81844H7.31821V2.09119ZM29.1364 4.8185H25.0455V2.09125H29.1364V4.8185Z"
                fill={iconColor}
            />
            <Path
                d="M3.90909 6.18203C3.53204 6.18203 3.22729 5.87658 3.22729 5.50024V1.40934C3.22729 1.03299 3.53204 0.727539 3.90909 0.727539C4.28614 0.727539 4.59089 1.03299 4.59089 1.40934V5.50024C4.59089 5.87658 4.28614 6.18203 3.90909 6.18203Z"
                fill={iconColor}
            />
            <Path
                d="M1.1818 6.18203C0.804746 6.18203 0.5 5.87658 0.5 5.50024V1.40934C0.5 1.03299 0.804746 0.727539 1.1818 0.727539C1.55885 0.727539 1.86359 1.03299 1.86359 1.40934V5.50024C1.86365 5.87658 1.55885 6.18203 1.1818 6.18203Z"
                fill={iconColor}
            />
        </Svg>
    );
};
