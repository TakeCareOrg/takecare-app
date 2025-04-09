import React from "react";
import { G, Path, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const SendIcon: React.FC<IconType> = ({
    color,
    height = 30,
    width = 30,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
            <G clipPath="url(#clip0_348_364)">
                <Path
                    d="M28.0625 14.5L4.3125 3.25L3.75 3.125C3.41848 3.125 3.10054 3.2567 2.86612 3.49112C2.6317 3.72554 2.5 4.04348 2.5 4.375L5.8125 14.375H15C15.3266 14.3902 15.6358 14.5268 15.867 14.758C16.0982 14.9892 16.2348 15.2984 16.25 15.625C16.25 15.9565 16.1183 16.2745 15.8839 16.5089C15.6495 16.7433 15.3315 16.875 15 16.875H5.8125L2.5 26.875C2.5 27.2065 2.6317 27.5245 2.86612 27.7589C3.10054 27.9933 3.41848 28.125 3.75 28.125L4.3125 28L28.0625 16.75C28.2738 16.6476 28.4521 16.4878 28.5768 16.2889C28.7015 16.0899 28.7676 15.8598 28.7676 15.625C28.7676 15.3902 28.7015 15.1601 28.5768 14.9611C28.4521 14.7622 28.2738 14.6024 28.0625 14.5Z"
                    fill={iconColor}
                />
            </G>
        </Svg>
    );
};
