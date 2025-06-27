import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ChatEye } from "@app/assets/icons/ChatEye";
import { useColorTheme } from "@app/hooks/use-color-theme";

export function TabBarFloatButton({ onPress }: { onPress: () => void }) {
    const colors = useColorTheme();
    return (
        <View
            pointerEvents="box-none"
            style={{ backgroundColor: colors.background }}
        >
            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: colors.blue, shadowColor: colors.blue },
                ]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <ChatEye animate />
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
        shadowOpacity: 2,
        shadowRadius: 10,
        elevation: 5,
    },
});
