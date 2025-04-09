import React from "react";
import { Path, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const ProfileMinimalistIcon: React.FC<IconType> = ({
    color = useColors().main.primary,
    height = 15,
    width = 15,
}) => (
    <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
        <Path
            opacity="0.4"
            d="M7.5 1.25C5.8625 1.25 4.53125 2.58125 4.53125 4.21875C4.53125 5.825 5.7875 7.125 7.425 7.18125C7.475 7.175 7.525 7.175 7.5625 7.18125C7.575 7.18125 7.58125 7.18125 7.59375 7.18125C7.6 7.18125 7.6 7.18125 7.60625 7.18125C9.20625 7.125 10.4625 5.825 10.4688 4.21875C10.4688 2.58125 9.1375 1.25 7.5 1.25Z"
            fill="#FF9D55"
        />
        <Path
            d="M10.6756 8.8438C8.93181 7.6813 6.08809 7.6813 4.33184 8.8438C3.53809 9.37505 3.10059 10.0938 3.10059 10.8625C3.10059 11.6313 3.53809 12.3438 4.32559 12.8688C5.20059 13.4563 6.35056 13.75 7.50056 13.75C8.65056 13.75 9.80056 13.4563 10.6756 12.8688C11.4631 12.3375 11.9006 11.625 11.9006 10.85C11.8943 10.0813 11.4631 9.3688 10.6756 8.8438Z"
            fill="#FF9D55"
        />
    </Svg>
);
