import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { FontAwesome } from "@expo/vector-icons";

interface ClearButtonProps {
    onPress: () => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <FontAwesome
                    name="refresh"
                    size={20}
                    color="black"
                    accessibilityLabel="Reset"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 50,
        right: 15,
        zIndex: 1,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default ClearButton;
