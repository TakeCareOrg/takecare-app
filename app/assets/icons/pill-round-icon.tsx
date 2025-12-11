import { Circle, Path, Svg } from "react-native-svg";

import { colors } from "@constants/colors";
import { IconType } from "@dtypes/icon";

export const PillRoundIcon = ({
    color = colors.white[500],
    height = 30,
    width = 30,
}: IconType) => (
    <Svg width={width} height={height} fill="none">
        <Circle
            cx="12"
            cy="12"
            r="9"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
        />
        <Path
            d="M12 3V21"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
        />
    </Svg>
);
