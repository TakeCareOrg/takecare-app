// Component for text styles
import React, { useMemo } from "react";
import { View } from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";
import { useResponsive } from "@hooks/use-reponsive";

import { Text } from "../text";

type Colors =
    | "red"
    | "green"
    | "blue"
    | "orange"
    | "purple"
    | "pink"
    | "yellow"
    | "grey";

type TextProps = {
    text: string | React.ReactNode; // Allow text or React nodes
    color?: Colors;
    style?: object; // Allow additional styles to be passed
    numberOfLines?: number; // Number of lines to show before truncating
};

export const Chip = ({ text, color, style, numberOfLines = 1 }: TextProps) => {
    const responsiveFont = useResponsive({
        smallScreenValue: 10,
        largeScreenValue: 12,
        threshold: 700,
    });
    const colors = useColorTheme();
    const rawColors = colors.raw;

    const colorValue = useMemo(() => {
        switch (color) {
            case "red":
                return {
                    background: colors.isDark
                        ? rawColors.red[600]
                        : rawColors.red[500],
                    text: colors.isDark ? rawColors.red[50] : rawColors.white,
                };
            case "green":
                return {
                    background: colors.isDark
                        ? rawColors.green[700]
                        : rawColors.green[600],
                    text: rawColors.white,
                };
            case "blue":
                return {
                    background: colors.isDark
                        ? rawColors.blue[400]
                        : rawColors.blue[300],
                    text: rawColors.white,
                };
            case "orange":
                return {
                    background: colors.isDark
                        ? rawColors.orange[600]
                        : rawColors.orange[400],
                    text: colors.isDark
                        ? rawColors.orange[50]
                        : rawColors.white,
                };
            case "purple":
                return {
                    background: colors.isDark
                        ? rawColors.purple[600]
                        : rawColors.purple[400],
                    text: colors.isDark
                        ? rawColors.purple[50]
                        : rawColors.white,
                };
            case "pink":
                return {
                    background: colors.isDark
                        ? rawColors.pink[600]
                        : rawColors.pink[300],
                    text: colors.isDark ? rawColors.pink[50] : rawColors.white,
                };
            case "yellow":
                return {
                    background: colors.isDark
                        ? rawColors.yellow[600]
                        : rawColors.yellow[400],
                    text: colors.isDark
                        ? rawColors.yellow[50]
                        : rawColors.white,
                };
            default:
                return {
                    background: colors.isDark
                        ? rawColors.grey[600]
                        : rawColors.grey[200],
                    text: colors.isDark
                        ? rawColors.grey[50]
                        : rawColors.grey[800],
                };
        }
    }, [color, rawColors, colors.isDark]);

    return (
        <View
            style={{
                backgroundColor: colorValue.background,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                ...style, // Allow additional styles to be passed
            }}
        >
            <Text
                style={[
                    {
                        color: colorValue.text,
                        fontFamily: "Poppins-Medium",
                        fontSize: responsiveFont,
                    },
                ]}
                numberOfLines={numberOfLines}
                ellipsizeMode="tail"
            >
                {text}
            </Text>
        </View>
    );
};
