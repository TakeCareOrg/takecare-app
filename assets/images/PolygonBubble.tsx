import React from "react";
import { Svg, Path } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const PolygonBubbleIcon: React.FC<IconType> = ({ color }) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width="50" height="23" viewBox="0 0 50 23" fill="none">
            <Path
                d="M-35 -226H6739V-228H-35V-226ZM6740 -225V1928H6742V-225H6740ZM6739 1929H-35.0002V1931H6739V1929ZM-36 1928V-225H-38V1928H-36ZM-35.0002 1929C-35.5524 1929 -36 1928.55 -36 1928H-38C-38 1929.66 -36.6572 1931 -35.0002 1931V1929ZM6740 1928C6740 1928.55 6739.55 1929 6739 1929V1931C6740.66 1931 6742 1929.66 6742 1928H6740ZM6739 -226C6739.55 -226 6740 -225.552 6740 -225H6742C6742 -226.657 6740.66 -228 6739 -228V-226ZM-35 -228C-36.6568 -228 -38 -226.657 -38 -225H-36C-36 -225.552 -35.5523 -226 -35 -226V-228Z"
                fill={iconColor}
                fillOpacity="0.1"
            />
            <Path
                d="M0.270387 22.2471L24.9136 0.628017L49.6307 18.2977L0.270387 22.2471Z"
                fill={iconColor}
            />
        </Svg>
    );
};
