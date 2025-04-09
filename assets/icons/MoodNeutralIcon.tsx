import React from "react";
import { Path, Rect, Svg } from "react-native-svg";
import { useColors } from "../../src/styles/Colors";
import { IconType } from "../../src/types/icon.types";

export const MoodNeutralIcon: React.FC<IconType> = ({
    color = useColors().main.primary,
    colorSecondary = useColors().main.secondary,
    height = 30,
    width = 30,
    onPress = () => {},
}) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        onPress={onPress}
    >
        <Rect width="100" height="100" rx="50" fill={color} />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M74.9997 29.1666C77.3009 29.1666 79.1663 31.0321 79.1663 33.3333L79.1663 45.8333C79.1663 48.1345 77.3009 50 74.9997 50C72.6985 50 70.833 48.1345 70.833 45.8333L70.833 33.3333C70.833 31.0321 72.6985 29.1666 74.9997 29.1666Z"
            fill={colorSecondary}
        />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24.9997 29.1666C27.3009 29.1666 29.1663 31.0321 29.1663 33.3333L29.1663 45.8333C29.1663 48.1345 27.3009 50 24.9997 50C22.6985 50 20.833 48.1345 20.833 45.8333L20.833 33.3333C20.833 31.0321 22.6985 29.1666 24.9997 29.1666Z"
            fill={colorSecondary}
        />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.833 66.6667C20.833 64.3655 22.6985 62.5 24.9997 62.5H74.9997C77.3009 62.5 79.1663 64.3655 79.1663 66.6667C79.1663 68.9679 77.3009 70.8333 74.9997 70.8333H24.9997C22.6985 70.8333 20.833 68.9679 20.833 66.6667Z"
            fill={colorSecondary}
        />
    </Svg>
);
