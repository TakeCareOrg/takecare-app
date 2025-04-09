import React from "react";
import { Svg, Path } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const HealthMinimalistIcon: React.FC<IconType> = ({
    color = "#FC55FF",
    height = 15,
    width = 15,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
            <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.60108 11.5429C3.76214 10.1336 1.25 7.80538 1.25 5.60408C1.25 1.92664 4.6876 0.553663 7.5 3.39444C10.3124 0.553663 13.75 1.92664 13.75 5.60406C13.75 7.80544 11.2379 10.1336 9.39894 11.5429C8.56644 12.181 8.15019 12.5 7.5 12.5C6.84981 12.5 6.43356 12.181 5.60108 11.5429ZM10.3125 3.90625C10.5714 3.90625 10.7812 4.11612 10.7812 4.375V5.15626H11.5625C11.8214 5.15626 12.0312 5.36613 12.0312 5.62501C12.0312 5.88389 11.8214 6.09376 11.5625 6.09376H10.7812V6.875C10.7812 7.13388 10.5714 7.34375 10.3125 7.34375C10.0536 7.34375 9.84375 7.13388 9.84375 6.875V6.09376H9.0625C8.80362 6.09376 8.59375 5.88389 8.59375 5.62501C8.59375 5.36613 8.80362 5.15626 9.0625 5.15626H9.84375V4.375C9.84375 4.11612 10.0536 3.90625 10.3125 3.90625Z"
                fill={iconColor}
            />
        </Svg>
    );
};
