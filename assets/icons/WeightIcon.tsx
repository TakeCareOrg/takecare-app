import React from "react";
import { Svg, Path } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const WeightIcon: React.FC<IconType> = ({
    color = "#F1FF55",
    height = 15,
    width = 15,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
            <Path
                opacity="0.4"
                d="M4.27778 13.75H9.72222C11.7639 13.75 13.125 12.5 13.125 10.625V4.375C13.125 2.5 11.7639 1.25 9.72222 1.25H4.27778C2.23611 1.25 0.875 2.5 0.875 4.375V10.625C0.875 12.5 2.23611 13.75 4.27778 13.75Z"
                fill={iconColor}
            />
            <Path
                d="M10.9229 4.99995C8.6895 3.2562 5.31442 3.2562 3.0739 4.99995C2.974 5.0812 2.9526 5.2062 3.02395 5.29995L4.57947 7.48747C4.62229 7.54372 4.69364 7.58747 4.765 7.59372C4.84349 7.60622 4.92198 7.58122 4.97906 7.53747C6.12788 6.64372 7.85465 6.64372 9.00346 7.53747C9.05341 7.57497 9.11763 7.59372 9.18184 7.59372C9.19612 7.59372 9.21039 7.59372 9.21752 7.59372C9.29601 7.58122 9.36737 7.54372 9.40304 7.48747L10.9586 5.29995C11.0442 5.2062 11.0228 5.0812 10.9229 4.99995Z"
                fill={iconColor}
            />
        </Svg>
    );
};
