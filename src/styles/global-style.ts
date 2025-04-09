import { useColors } from "./Colors";
import { StyleSheet } from "react-native";

export function padding(a: number, b?: number, c?: number, d?: number) {
    return {
        paddingTop: a,
        paddingRight: b !== undefined ? b : a,
        paddingBottom: c !== undefined ? c : a,
        paddingLeft: d !== undefined ? d : b !== undefined ? b : a,
    };
}

export function margin(a: number, b?: number, c?: number, d?: number) {
    return {
        marginTop: a,
        marginRight: b !== undefined ? b : a,
        marginBottom: c !== undefined ? c : a,
        marginLeft: d !== undefined ? d : b !== undefined ? b : a,
    };
}

export function border(a: number, b?: string, c?: number) {
    return {
        borderWidth: a,
        borderColor: b !== undefined ? b : "black",
        borderRadius: c !== undefined ? c : a,
    };
}

export function shadow() {
    const { main } = useColors();
    return {
        shadowOffset: { width: 0, height: 5 },
        shadowColor: main.shadow,
        shadowOpacity: 0.25,
        elevation: 4,
    };
}

export function shadowWelcome() {
    const { quiz } = useColors();
    return {
        shadowOffset: { width: 15, height: 15 },
        shadowColor: quiz.shadow,
        shadowOpacity: 1,
        elevation: 3,
    };
}

export const row = StyleSheet.create({
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
});
