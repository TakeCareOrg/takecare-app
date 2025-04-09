import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const DeleteIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} fill="none">
            <Path
                d="M3.82129 1.66667C3.99288 1.18117 4.45591 0.833336 5.00016 0.833336C5.54441 0.833336 6.00746 1.18117 6.17904 1.66667"
                stroke={iconColor}
                strokeWidth="0.5"
                strokeLinecap="round"
            />
            <Path
                d="M8.54163 2.5H1.45825"
                stroke={iconColor}
                strokeWidth="0.5"
                strokeLinecap="round"
            />
            <Path
                d="M7.84705 3.54167L7.65538 6.4163C7.58163 7.52251 7.54475 8.07563 7.18434 8.4128C6.82392 8.75001 6.26959 8.75001 5.16092 8.75001H4.83871C3.73003 8.75001 3.17569 8.75001 2.81527 8.4128C2.45485 8.07563 2.41798 7.52251 2.34423 6.4163L2.15259 3.54167"
                stroke={iconColor}
                strokeWidth="0.5"
                strokeLinecap="round"
            />
            <Path
                d="M3.95825 4.58333L4.16659 6.66666"
                stroke={iconColor}
                strokeWidth="0.5"
                strokeLinecap="round"
            />
            <Path
                d="M6.04159 4.58333L5.83325 6.66666"
                stroke={iconColor}
                strokeWidth="0.5"
                strokeLinecap="round"
            />
        </Svg>
    );
};
