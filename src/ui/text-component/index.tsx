// Component for text styles
import React, { useContext } from "react";
import { FunctionComponent } from "react";
import { Text, TextStyle } from "react-native";
import { useColors } from "../../styles/Colors";
import { fontWeightsStyle } from "../../styles/text-style";
import { ResponsiveContext } from "../../contexts/responsive-context";

type TextProps = {
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
    textWeight?:
        | "thin"
        | "light"
        | "regular"
        | "medium"
        | "semibold"
        | "bold"
        | "extrabold"
        | "black"
        | "extraLight";
    color?: string;
    font?: "Urbanist" | "Techna" | "Inter";
    textStyle?: "italic" | "regular";
    fontSize?: number;
    letterSpacing?: number;
    onPress?: () => void;
};

export const TextComponent: FunctionComponent<TextProps> = ({
    children,
    style,
    textWeight = "regular",
    color,
    font = "Techna",
    textStyle = "regular",
    fontSize = 16,
    letterSpacing = 0,
    onPress,
}) => {
    const { fontSizeBasedPixel } = useContext(ResponsiveContext);
    const { main } = useColors();

    return (
        <Text
            onPress={onPress}
            style={[
                (
                    fontWeightsStyle(font, textStyle) as {
                        [key: string]: TextStyle;
                    }
                )[textWeight],
                {
                    color: color || main.primary,
                    fontSize: fontSizeBasedPixel(fontSize),
                    letterSpacing: letterSpacing,
                },
                { ...style },
            ]}
        >
            {children}
        </Text>
    );
};
