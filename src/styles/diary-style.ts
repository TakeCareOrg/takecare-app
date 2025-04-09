import { StyleSheet, useColorScheme } from "react-native";
import { shadow } from "./global-style";

export function DiaryStyle() {
    const isDarkMode = useColorScheme() === "dark";

    const styles = StyleSheet.create({
        text: {
            textAlign: "left",
            lineHeight: 25,
            letterSpacing: 1,
            position: "absolute",
            top: 40,
            left: 15,
        },
    });

    if (!isDarkMode) {
        Object.assign(styles, shadow());
    }

    return styles;
}
