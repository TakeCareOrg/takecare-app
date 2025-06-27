// Component for text styles
import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

import { useResponsive } from "@hooks/use-reponsive";

import { useColorTheme } from "@app/hooks/use-color-theme";

type FontFamily = "Inter" | "Poppins" | "Roboto" | "Open Sans";
type FontWeight = "Thin" | "Light" | "Regular" | "Medium" | "SemiBold" | "Bold";

type Fonts = `${FontFamily}-${FontWeight}`;

type TextProps = {
    children: React.ReactNode;
    color?: string;
    font?: FontFamily | Fonts; // Allow specific font families or custom fonts
    fontSize?: number;
} & RNTextProps;

export const Text = ({
    children,
    color,
    font = "Poppins",
    fontSize = 16,
    style,
    ...props
}: TextProps) => {
    const responsiveFont = useResponsive({
        smallScreenValue: fontSize - 2,
        largeScreenValue: fontSize,
        threshold: 350,
        thresholdType: "width",
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
                style, // Allow additional styles to be passed
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
};
