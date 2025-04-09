import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const EditIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
            <Path
                d="M17.7333 5.33337L9.78325 13.2833C8.99158 14.075 6.64156 14.4417 6.11656 13.9167C5.59156 13.3917 5.94989 11.0417 6.74156 10.25L14.6999 2.29168C14.8962 2.07756 15.1338 1.90545 15.3984 1.7857C15.663 1.66595 15.9492 1.60103 16.2396 1.59491C16.5299 1.5888 16.8186 1.64159 17.088 1.7501C17.3574 1.8586 17.6021 2.0206 17.8072 2.22627C18.0123 2.43194 18.1736 2.67702 18.2813 2.94674C18.3891 3.21646 18.4412 3.50521 18.4343 3.79559C18.4273 4.08596 18.3616 4.37195 18.2412 4.63625C18.1207 4.90054 17.9479 5.1377 17.7333 5.33337Z"
                stroke={iconColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9.16675 3.33333H5.00008C4.11602 3.33333 3.26823 3.68451 2.64311 4.30964C2.01799 4.93476 1.66675 5.7826 1.66675 6.66666V15C1.66675 15.8841 2.01799 16.7319 2.64311 17.357C3.26823 17.9822 4.11602 18.3333 5.00008 18.3333H14.1667C16.0084 18.3333 16.6667 16.8333 16.6667 15V10.8333"
                stroke={iconColor}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
