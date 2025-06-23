// Component for text styles
import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

import { useResponsive } from "@hooks/use-reponsive";

import { useColorTheme } from "@app/hooks/use-color-theme";

type FontFamily = "Inter" | "Poppins" | "Roboto" | "Open Sans";
type FontWeight = "Thin" | "Light" | "Regular" | "Medium";

type Fonts = `${FontFamily}-${FontWeight}`;

type TextProps = {
    children: React.ReactNode;
    color?: string;
    font?: Fonts;
    fontSize?: number;
    letterSpacing?: number;
} & RNTextProps;

export const Text = ({
    children,
    color,
    font = "Poppins-Regular",
    fontSize = 16,
    ...props
}: TextProps) => {
    const responsiveFont = useResponsive({
        smallScreenValue: fontSize - 2,
        largeScreenValue: fontSize,
        threshold: 700,
    });
    const colors = useColorTheme();

    return (
        <RNText
            style={[
                {
                    color: color ?? colors.text,
                    fontFamily: font,
                    fontSize: responsiveFont,
                },
                props.style,
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
};
