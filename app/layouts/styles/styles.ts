import { StyleSheet } from "react-native";

export const PageContainerStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: 15,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    staticContent: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    menuButton: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    popup: {
        position: "absolute",
        borderRadius: 10,
        top: 60,
        right: 15,
        borderWidth: 1,
    },
    menuItem: {
        minWidth: 150,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});
