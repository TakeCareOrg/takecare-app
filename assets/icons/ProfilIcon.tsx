import React from "react";
import { Path, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const ProfilIcon: React.FC<IconType> = ({
    color = useColors().main.primary,
    height = 30,
    width = 30,
}) => (
    <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
        <Path
            d="M15 14.5341C16.2535 14.5341 17.4557 14.0361 18.3421 13.1497C19.2284 12.2634 19.7264 11.0612 19.7264 9.80766C19.7264 8.55413 19.2284 7.35195 18.3421 6.46558C17.4557 5.57921 16.2535 5.08125 15 5.08125C13.7465 5.08125 12.5443 5.57921 11.6579 6.46558C10.7716 7.35195 10.2736 8.55413 10.2736 9.80766C10.2736 11.0612 10.7716 12.2634 11.6579 13.1497C12.5443 14.0361 13.7465 14.5341 15 14.5341ZM15 16.6106C8.71594 16.6106 4.6875 20.0784 4.6875 21.7669V24.9197H25.3125V21.7669C25.3125 19.725 21.4988 16.6106 15 16.6106Z"
            fill={color}
        />
    </Svg>
);
