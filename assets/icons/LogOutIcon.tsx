import React from "react";
import { Svg, Path } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const LogOutIcon: React.FC<IconType> = ({
    color = "#C93434",
    height = 15,
    width = 15,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
            <Path
                d="M11.7188 0.9375H7.5V1.875H11.7188C11.8431 1.875 11.9623 1.92439 12.0502 2.01229C12.1381 2.1002 12.1875 2.21943 12.1875 2.34375V12.6562C12.1875 12.7806 12.1381 12.8998 12.0502 12.9877C11.9623 13.0756 11.8431 13.125 11.7188 13.125H7.5V14.0625H11.7188C12.0917 14.0625 12.4494 13.9143 12.7131 13.6506C12.9768 13.3869 13.125 13.0292 13.125 12.6562V2.34375C13.125 1.97079 12.9768 1.6131 12.7131 1.34938C12.4494 1.08566 12.0917 0.9375 11.7188 0.9375Z"
                fill={iconColor}
            />
            <Path
                d="M10.1158 7.96875V7.03125H3.2814L5.1564 5.15625L4.49078 4.47656L2.14703 6.82031C2.05986 6.90738 1.99071 7.01078 1.94353 7.12459C1.89635 7.2384 1.87207 7.36039 1.87207 7.48359C1.87207 7.6068 1.89635 7.72879 1.94353 7.8426C1.99071 7.95641 2.05986 8.05981 2.14703 8.14687L4.49078 10.4906L5.1564 9.84375L3.2814 7.96875H10.1158Z"
                fill={iconColor}
            />
        </Svg>
    );
};
