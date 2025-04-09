import React from "react";
import { Svg, Path } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const LockKeyholeIcon: React.FC<IconType> = ({
    color = "#EEEEEE",
    height = 15,
    width = 15,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
            <Path
                d="M2 9.5C2 7.8501 2 7.02515 2.48327 6.51258C2.96655 6 3.74436 6 5.3 6H9.7C11.2556 6 12.0334 6 12.5167 6.51258C13 7.02515 13 7.8501 13 9.5C13 11.1499 13 11.9748 12.5167 12.4874C12.0334 13 11.2556 13 9.7 13H5.3C3.74436 13 2.96655 13 2.48327 12.4874C2 11.9748 2 11.1499 2 9.5Z"
                stroke={iconColor}
                strokeWidth="0.75"
            />
            <Path
                opacity="0.5"
                d="M7.5 10.25C8.19036 10.25 8.75 9.69036 8.75 9C8.75 8.30964 8.19036 7.75 7.5 7.75C6.80964 7.75 6.25 8.30964 6.25 9C6.25 9.69036 6.80964 10.25 7.5 10.25Z"
                stroke={iconColor}
                strokeWidth="0.75"
            />
            <Path
                opacity="0.5"
                d="M3.75 6.25V5C3.75 2.92893 5.42893 1.25 7.5 1.25C9.57106 1.25 11.25 2.92893 11.25 5V6.25"
                stroke={iconColor}
                strokeWidth="0.75"
                strokeLinecap="round"
            />
        </Svg>
    );
};
