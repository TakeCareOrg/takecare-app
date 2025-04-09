import React from "react";
import { Svg, Path } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const WarningIcon: React.FC<IconType> = ({
    color,
    height = 30,
    width = 30,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.6579 4.13239C12.0786 1.23712 7.92132 1.23712 6.34208 4.13239L1.95722 12.1713C0.442732 14.9479 2.45238 18.3332 5.61512 18.3332H14.3848C17.5476 18.3332 19.5572 14.9479 18.0427 12.1713L13.6579 4.13239ZM9.16667 12.4998V6.66651H10.8333V12.4998H9.16667ZM10 14.9998C10.4602 14.9998 10.8333 14.6268 10.8333 14.1665C10.8333 13.7063 10.4602 13.3332 10 13.3332C9.53976 13.3332 9.16667 13.7063 9.16667 14.1665C9.16667 14.6268 9.53976 14.9998 10 14.9998Z"
                fill={iconColor}
            />
        </Svg>
    );
};
