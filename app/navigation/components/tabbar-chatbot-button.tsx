import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { TestIcon } from "@assets/icons/TestIcon";
import { useColorTheme } from "@hooks/use-color-theme";

export function TabBarFloatButton({ onPress }: { onPress: () => void }) {
    const colors = useColorTheme();
    return (
        <View
            pointerEvents="box-none"
            style={{ backgroundColor: colors.background }}
        >
            <TouchableOpacity
                style={[styles.button, { shadowColor: colors.blue[500] }]}
                onPress={onPress}
                activeOpacity={0.9}
                hitSlop={20}
            >
                <TestIcon />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        top: -25,
        justifyContent: "center",
        alignItems: "center",
        width: "auto",
        height: 0,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 5,
    },
});
