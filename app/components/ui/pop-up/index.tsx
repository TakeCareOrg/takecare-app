import React, { useRef, useState } from "react";
import {
    Animated,
    Easing,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColorTheme } from "@hooks/use-color-theme";

import { Text } from "../text";

export interface Setting {
    label: string;
    onPress: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "danger";
}

type PopUpMenuProps = {
    settings: Setting[];
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
};

export const PopUpMenu = ({
    settings,
    top = 60,
    left,
    right = 15,
    bottom,
}: PopUpMenuProps) => {
    const colors = useColorTheme();
    const [pressedIndex, setPressedIndex] = useState<number | null>(null);
    const [menuVisible, setMenuVisible] = useState<boolean>(false);

    const scale = useRef(new Animated.Value(0)).current;

    const toggleMenu = (to: number) => {
        to === 1 && setMenuVisible(true);
        Animated.timing(scale, {
            toValue: to,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start(() => {
            if (to === 0) {
                setMenuVisible(false);
                setPressedIndex(null);
            }
        });
    };

    return (
        <>
            {!menuVisible && (
                <TouchableOpacity
                    onPress={() => toggleMenu(1)}
                    style={styles.menuButton}
                >
                    {/* TODO: Replace with VerticalsDotsIcon */}
                    <Animated.View
                        style={{
                            ...styles.dotsIcon,
                            backgroundColor: colors.text,
                        }}
                    />
                </TouchableOpacity>
            )}
            <Modal transparent visible={menuVisible}>
                <SafeAreaView
                    style={{ flex: 1 }}
                    onTouchEnd={() => toggleMenu(0)}
                >
                    <Animated.View
                        style={[
                            styles.popup,
                            {
                                transform: [{ scale }],
                                backgroundColor: colors.box,
                                top,
                                left,
                                right,
                                bottom,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        {settings.map((setting: Setting, index: number) => (
                            <Pressable
                                key={index}
                                style={[
                                    styles.menuItem,
                                    pressedIndex === index && {
                                        backgroundColor: colors.hover,
                                    },
                                ]}
                                onPress={() => {
                                    setting.onPress();
                                    toggleMenu(0);
                                }}
                                onPressIn={() => setPressedIndex(index)}
                            >
                                <Text
                                    fontSize={16}
                                    color={
                                        setting.variant === "danger"
                                            ? colors.error
                                            : colors.text
                                    }
                                >
                                    {setting.label}
                                </Text>
                            </Pressable>
                        ))}
                    </Animated.View>
                </SafeAreaView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
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
