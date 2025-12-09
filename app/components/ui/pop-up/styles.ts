import { StyleSheet } from "react-native";

export const PopUpStyles = StyleSheet.create({
    menuButton: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    dotsIcon: {
        width: 4,
        height: 20,
        borderRadius: 2,
    },
    popup: {
        position: "absolute",
        borderRadius: 10,
        borderWidth: 1,
    },
    menuItem: {
        minWidth: 150,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});
