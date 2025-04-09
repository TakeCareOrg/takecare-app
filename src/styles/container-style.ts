import { StyleSheet } from "react-native";
import { LightColors, DarkColors } from "./Colors";
import { padding, margin, shadow } from "./global-style";
import { DimensionValue } from "react-native";

const createContainerStyle = (isDarkMode: boolean = false) => {
    const { main } = isDarkMode ? DarkColors : LightColors;

    return StyleSheet.create({
        container: {
            backgroundColor: main.container,
            borderRadius: 15,
            ...padding(10, 15),
            ...margin(12, 0),
            width: "100%", // Default width
            height: "auto", // Default height
            minHeight: 160,
            flex: 1, // Default flex
            zIndex: -1, // To prevent that the menu is behind the container on IOS
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 10,
        },
        ...(isDarkMode ? {} : shadow()),
    });
};

export default createContainerStyle;
