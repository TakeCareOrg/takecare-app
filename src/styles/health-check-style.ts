import { StyleSheet, useColorScheme } from "react-native";
import { shadow } from "./global-style";

export function HealthCheckStyle() {
    const isDarkMode = useColorScheme() === "dark";

    const styles = StyleSheet.create({
        layoutIcon: {
            zIndex: 1,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },

        score: {
            zIndex: 2,
            position: "absolute",
            left: 25,
            top: 30,
        },

        text: {
            zIndex: 2,
            position: "absolute",
            right: 15,
            bottom: 20,
            width: 100,
            textAlign: "right",
        },
    });

    if (!isDarkMode) {
        Object.assign(styles, shadow());
    }

    return styles;
}
