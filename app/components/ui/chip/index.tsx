// Component for text styles
import React, { useMemo } from "react";
import { View } from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";

import { Text } from "../text";

type Colors = "red" | "green" | "blue" | "orange" | "yellow" | "black";

type TextProps = {
    text: string | React.ReactNode; // Allow text or React nodes
    color?: Colors;
    style?: object; // Allow additional styles to be passed
    numberOfLines?: number; // Number of lines to show before truncating
};

export const Chip = ({ text, color, style, numberOfLines = 1 }: TextProps) => {
    const colors = useColorTheme();
    const rawColors = colors.raw;

    const colorValue = useMemo(() => {
        switch (color) {
            case "red":
                return {
                    background: colors.isDark
                        ? rawColors.red[600]
                        : rawColors.red[500],
                    text: colors.isDark
                        ? rawColors.red[50]
                        : rawColors.white[500],
                };
            case "green":
                return {
                    background: colors.isDark
                        ? rawColors.green[900]
                        : rawColors.green[600],
                    text: rawColors.green[50],
                };
            case "blue":
                return {
                    background: colors.isDark
                        ? rawColors.blue[400]
                        : rawColors.blue[300],
                    text: rawColors.white[500],
                };
            case "orange":
                return {
                    background: colors.isDark
                        ? rawColors.orange[600]
                        : rawColors.orange[400],
                    text: colors.isDark
                        ? rawColors.orange[50]
                        : rawColors.white[500],
                };
            case "yellow":
                return {
                    background: colors.isDark
                        ? rawColors.yellow[600]
                        : rawColors.yellow[400],
                    text: colors.isDark
                        ? rawColors.yellow[50]
                        : rawColors.white[500],
                };
            default:
                return {
                    background: colors.isDark
                        ? rawColors.white[800]
                        : rawColors.black[100],
                    text: colors.isDark
                        ? rawColors.black[100]
                        : rawColors.white[800],
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
                numberOfLines={numberOfLines}
                ellipsizeMode="tail"
                fontSize={12}
                weight="700"
                color={colorValue.text}
            >
                {text}
            </Text>
        </View>
    );
};
