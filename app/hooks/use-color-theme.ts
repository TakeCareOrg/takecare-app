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

    // UI colors
    background: string;
    card: string;
    text: string;
    border: string;

    // Status colors
    error: string;
    success: string;
    warning: string;
    info: string;

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
                white: colors.white[500],

                // UI colors - sémantiques
                background: isDarkMode ? colors.black[450] : colors.white[500],
                card: isDarkMode ? colors.black[400] : colors.white[100],
                text: isDarkMode ? colors.white[500] : colors.black[500],
                border: isDarkMode ? colors.black[300] : colors.white[200],

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
