// Component for text styles
import {
    Urbanist_100Thin,
    Urbanist_100Thin_Italic,
    Urbanist_200ExtraLight,
    Urbanist_200ExtraLight_Italic,
    Urbanist_300Light,
    Urbanist_300Light_Italic,
    Urbanist_400Regular,
    Urbanist_400Regular_Italic,
    Urbanist_500Medium,
    Urbanist_500Medium_Italic,
    Urbanist_600SemiBold,
    Urbanist_600SemiBold_Italic,
    Urbanist_700Bold,
    Urbanist_700Bold_Italic,
    Urbanist_800ExtraBold,
    Urbanist_800ExtraBold_Italic,
    Urbanist_900Black,
    Urbanist_900Black_Italic,
    useFonts,
} from "@expo-google-fonts/urbanist";
import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";
import { useResponsive } from "@hooks/use-reponsive";

type FontWeight =
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";

type TextProps = {
    children: React.ReactNode;
    color?: string;
    weight?: FontWeight;
    italic?: boolean;
    fontSize?: number;
} & RNTextProps;

export const Text = ({
    children,
    color,
    weight = "400",
    italic = false,
    fontSize = 16,
    style,
    ...props
}: TextProps) => {
    const [fontsLoaded] = useFonts({
        Urbanist_100Thin,
        Urbanist_200ExtraLight,
        Urbanist_300Light,
        Urbanist_400Regular,
        Urbanist_500Medium,
        Urbanist_600SemiBold,
        Urbanist_700Bold,
        Urbanist_800ExtraBold,
        Urbanist_900Black,
        Urbanist_100Thin_Italic,
        Urbanist_200ExtraLight_Italic,
        Urbanist_300Light_Italic,
        Urbanist_400Regular_Italic,
        Urbanist_500Medium_Italic,
        Urbanist_600SemiBold_Italic,
        Urbanist_700Bold_Italic,
        Urbanist_800ExtraBold_Italic,
        Urbanist_900Black_Italic,
    });

    const responsiveFont = useResponsive({
        smallScreenValue: fontSize - 2,
        largeScreenValue: fontSize,
        threshold: 350,
        thresholdType: "width",
    });
    const colors = useColorTheme();

    const getFontFamily = () => {
        const weightMap: Record<FontWeight, string> = {
            "100": italic ? "Urbanist_100Thin_Italic" : "Urbanist_100Thin",
            "200": italic
                ? "Urbanist_200ExtraLight_Italic"
                : "Urbanist_200ExtraLight",
            "300": italic ? "Urbanist_300Light_Italic" : "Urbanist_300Light",
            "400": italic
                ? "Urbanist_400Regular_Italic"
                : "Urbanist_400Regular",
            "500": italic ? "Urbanist_500Medium_Italic" : "Urbanist_500Medium",
            "600": italic
                ? "Urbanist_600SemiBold_Italic"
                : "Urbanist_600SemiBold",
            "700": italic ? "Urbanist_700Bold_Italic" : "Urbanist_700Bold",
            "800": italic
                ? "Urbanist_800ExtraBold_Italic"
                : "Urbanist_800ExtraBold",
            "900": italic ? "Urbanist_900Black_Italic" : "Urbanist_900Black",
        };

        return weightMap[weight];
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <RNText
            style={[
                {
                    color: color ?? colors.text,
                    fontFamily: getFontFamily(),
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
