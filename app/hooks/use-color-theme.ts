import { useMemo } from "react";
import { useColorScheme } from "react-native";

import { colors } from "../constants/colors";

export interface ThemeColors {
    // Common theme colors
    grey: string;
    red: string;
    green: string;
    orange: string;
    blue: string;
    purple: string;
    pink: string;
    yellow: string;

    // UI colors
    background: string;
    card: string;
    text: string;
    border: string;
    reverse: string;

    // Status colors
    notification: string;
    error: string;
    success: string;
    warning: string;
    info: string;

    chatbot: {
        userMessage: string;
        botMessage: string;
    };

    // Raw colors for advanced usage
    raw: typeof colors;
    isDark: boolean;
}

export const useColorTheme = () => {
    const isDarkMode = useColorScheme() === "dark";

    const themeColors = useMemo(
        () =>
            ({
                // Common theme colors
                grey: isDarkMode ? colors.grey[600] : colors.grey[50],
                red: isDarkMode ? colors.red[300] : colors.red[600],
                green: isDarkMode ? colors.green[300] : colors.green[600],
                orange: isDarkMode ? colors.orange[300] : colors.orange[600],
                blue: isDarkMode ? colors.blue[300] : colors.blue[600],
                purple: isDarkMode ? colors.purple[300] : colors.purple[600],
                pink: isDarkMode ? colors.pink[300] : colors.pink[600],
                yellow: isDarkMode ? colors.yellow[300] : colors.yellow[600],

                // UI colors
                background: isDarkMode ? colors.grey[900] : colors.white,
                card: isDarkMode ? colors.grey[800] : colors.grey[50],
                text: isDarkMode ? colors.white : colors.grey[900],
                border: isDarkMode ? colors.grey[700] : colors.grey[200],
                reverse: isDarkMode ? colors.white : colors.black,

                // Status colors
                notification: isDarkMode ? colors.pink[300] : colors.pink[600],
                error: isDarkMode ? colors.red[300] : colors.red[600],
                success: isDarkMode ? colors.green[300] : colors.green[600],
                warning: isDarkMode ? colors.orange[300] : colors.orange[600],
                info: isDarkMode ? colors.blue[300] : colors.blue[600],

                chatbot: {
                    userMessage: isDarkMode
                        ? colors.blue[500]
                        : colors.blue[50],
                    botMessage: isDarkMode ? colors.grey[500] : colors.grey[50],
                },

                // Raw colors for advanced usage
                raw: colors,
                isDark: isDarkMode,
            }) as ThemeColors,
        [isDarkMode],
    );

    return themeColors;
};
