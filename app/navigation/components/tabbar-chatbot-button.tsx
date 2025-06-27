import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

import { ChatEye } from "@app/assets/icons/ChatEye";
import { useColorTheme } from "@app/hooks/use-color-theme";

interface TabBarFloatButtonProps {
    onPress: () => void;
    isOnChatScreen?: boolean;
}

export function TabBarFloatButton({
    onPress,
    isOnChatScreen = false,
}: TabBarFloatButtonProps) {
    const colors = useColorTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const targetScale = isOnChatScreen ? 0.8 : 1;
        const targetOpacity = isOnChatScreen ? 0.4 : 1;

        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: targetScale,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: targetOpacity,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isOnChatScreen, scaleAnim, opacityAnim]);

    return (
        <View
            pointerEvents="box-none"
            style={{ backgroundColor: colors.background }}
        >
            <Animated.View
                style={{
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                }}
            >
                <TouchableOpacity
                    style={[styles.button, { shadowColor: colors.blue }]}
                    onPress={onPress}
                    activeOpacity={0.9}
                    hitSlop={20}
                >
                    <ChatEye animate />
                </TouchableOpacity>
            </Animated.View>
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
