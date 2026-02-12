import { useMemo } from "react";
import { useColorScheme } from "react-native";

import { colors } from "../constants/colors";

export interface ThemeColors {
    // Semantic colors with shades
    blue: typeof colors.blue;
    green: typeof colors.green;
    red: typeof colors.red;
    orange: typeof colors.orange;
    yellow: typeof colors.yellow;

    black: string;
    white: string;
    grey: string;
    shadow: string;

    // UI colors
    background: string;
    input: string;
    button: string;
    progress: string;
    card: string;
    text: string;
    secondary: string;
    border: string;
    hover: string;
    reverse: string;
    placeholder: string;
    disabled: string;

    // Status colors
    error: string;
    success: string;
    warning: string;
    info: string;

    // Box app
    box: string;
    achievement: [string, string, ...string[]];
    level: [string, string, ...string[]];

    // Raw colors for advanced usage
    raw: typeof colors;
    isDark: boolean;
}

export const useColorTheme = () => {
    const isDarkMode = useColorScheme() === "dark";

    const themeColors = useMemo(
        () =>
            ({
                // Color palettes
                blue: colors.blue,
                green: colors.green,
                red: colors.red,
                orange: colors.orange,
                yellow: colors.yellow,

                black: colors.black[500],
                grey: colors.black[300],
                white: colors.white[500],
                shadow: colors.black[300],

                // UI colors - sémantiques
                background: isDarkMode ? colors.black[500] : colors.white[500],
                input: isDarkMode ? colors.black[450] : colors.white,
                button: isDarkMode ? colors.black[450] : colors.primary[500],
                progress: isDarkMode ? colors.black[300] : colors.white[700],
                card: isDarkMode ? colors.black[300] : colors.white[600],
                text: isDarkMode ? colors.white[500] : colors.black[500],
                secondary: isDarkMode ? colors.black[100] : colors.black[200],
                border: isDarkMode ? colors.black[300] : colors.white[600],
                hover: isDarkMode ? colors.hover.dark : colors.hover.light,
                reverse: isDarkMode ? colors.black[500] : colors.white[500],
                placeholder: isDarkMode ? colors.white[700] : colors.black[100],
                disabled: isDarkMode ? colors.black[400] : colors.white[600],

                // Box app
                box: isDarkMode ? "#1E1E2E" : "#F2EFF8",
                achievement: isDarkMode
                    ? ["#1e40af", "#1d4ed8", "#2563eb"]
                    : ["#60a5fa", "#3b82f6", "#2563eb"],
                level: isDarkMode
                    ? ["#6b21a8", "#7c3aed", "#8b5cf6"]
                    : ["#a78bfa", "#818cf8", "#6366f1"],

                // Status colors
                error: colors.red[500],
                success: colors.green[500],
                warning: colors.yellow[500],
                info: colors.blue[500],

                // Raw access & mode
                raw: colors,
                isDark: isDarkMode,
            }) as ThemeColors,
        [isDarkMode],
    );

    return themeColors;
};
