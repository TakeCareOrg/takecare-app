import { useColors } from "../../src/styles/Colors";
import React from "react";
import { Svg, Path } from "react-native-svg";
import { IconType } from "../../src/types/icon.types";

export const ChatIcon: React.FC<IconType> = ({
    color,
    height = 20,
    width = 20,
}) => {
    const { main } = useColors();
    const iconColor = color || main.primary;

    return (
        <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
            <Path
                d="M23.4769 17.505V5.79844C23.4769 4.64156 22.5394 3.70219 21.3806 3.70219H3.03282C1.87501 3.70125 0.936569 4.64062 0.936569 5.79844V17.505C0.936569 18.6628 1.87501 19.6013 3.03282 19.6013H6.52876V24.4172L11.8763 19.6013H21.3797C22.5394 19.6013 23.4769 18.6628 23.4769 17.505ZM26.9672 8.30437H24.3441C24.3441 8.30437 24.3441 17.6531 24.3441 18.5316C24.3441 19.41 23.2041 20.5397 22.3256 20.5397C21.4472 20.5397 12.0647 20.5912 12.0647 20.5912C12.0647 21.7491 13.0031 22.4531 14.1609 22.4531H18.2006L23.4713 27.2362L23.4647 22.4531H26.9672C28.1259 22.4531 29.0634 21.7491 29.0634 20.5912V10.3425C29.0634 9.18562 28.1259 8.30437 26.9672 8.30437Z"
                fill={iconColor}
            />
        </Svg>
    );
};
