import React from "react";
import { Path, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const ProfileCircleIcon: React.FC<IconType> = ({
    color = useColors().main.primary,
    height = 15,
    width = 15,
}) => (
    <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
        <Path
            opacity="0.4"
            d="M7.57519 7.98756C7.53144 7.98131 7.4752 7.98131 7.4252 7.98756C6.3252 7.95006 5.4502 7.05006 5.4502 5.9438C5.4502 4.81255 6.3627 3.8938 7.50019 3.8938C8.63144 3.8938 9.55019 4.81255 9.55019 5.9438C9.54394 7.05006 8.67519 7.95006 7.57519 7.98756Z"
            stroke="#EEEEEE"
            stroke-width="0.75"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <Path
            opacity="0.34"
            d="M11.7126 12.1126C10.6001 13.1313 9.12512 13.7501 7.50012 13.7501C5.8751 13.7501 4.4001 13.1313 3.2876 12.1126C3.3501 11.5251 3.7251 10.9501 4.39385 10.5001C6.10635 9.3626 8.90637 9.3626 10.6064 10.5001C11.2751 10.9501 11.6501 11.5251 11.7126 12.1126Z"
            stroke="#EEEEEE"
            stroke-width="0.75"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <Path
            d="M7.5 13.75C10.9517 13.75 13.75 10.9517 13.75 7.5C13.75 4.04822 10.9517 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9517 4.04822 13.75 7.5 13.75Z"
            stroke="#EEEEEE"
            stroke-width="0.75"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </Svg>
);
