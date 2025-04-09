import React, { useState, useRef } from "react";
import {
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    Animated,
    Easing,
} from "react-native";
import { useColors } from "../../styles/Colors";
import { padding } from "../../styles/global-style";
import { TextComponent } from "../text-component";
import { Setting } from "../../types/settings.types";
import { VerticalsDotsIcon } from "../../../assets/icons/VerticalsDotsIcon";

type PopUpMenuProps = {
    settings: Setting[];
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
};

const PopUpMenu = ({
    settings,
    top = 20,
    left,
    right = 20,
    bottom,
}: PopUpMenuProps) => {
    const styles = MenuStyle({ top, left, right, bottom });
    const [pressedIndex, setPressedIndex] = useState<number | null>(null);
    const [menuVisible, setMenuVisible] = useState<boolean>(false);

    const scale = useRef(new Animated.Value(0)).current;
    const { main } = useColors();

    const resizeBox = (to: number) => {
        if (to === 1) {
            setMenuVisible(true);
        }
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
                <TouchableOpacity onPress={() => resizeBox(1)}>
                    <VerticalsDotsIcon width={30} height={30} />
                </TouchableOpacity>
            )}
            <Modal transparent visible={menuVisible}>
                <SafeAreaView
                    style={{ flex: 1 }}
                    onTouchEnd={() => resizeBox(0)}
                >
                    <Animated.View
                        style={[styles.popup, { transform: [{ scale }] }]}
                    >
                        {settings.map((setting: Setting, index: number) => (
                            <Pressable
                                key={index}
                                style={{
                                    backgroundColor:
                                        pressedIndex === index
                                            ? main.selectItem
                                            : "transparent",
                                    zIndex: 1,
                                    ...padding(10, 20),
                                    minWidth: 150,
                                }}
                                onPress={() => {
                                    setting.action(); // Don't forget to call the action function
                                    resizeBox(0);
                                }}
                                onPressIn={() => setPressedIndex(index)}
                            >
                                <View style={{ padding: 10 }}>
                                    <TextComponent
                                        fontSize={16}
                                        color={main.primary}
                                        font="Inter"
                                    >
                                        {setting.name}
                                    </TextComponent>
                                </View>
                            </Pressable>
                        ))}
                    </Animated.View>
                </SafeAreaView>
            </Modal>
        </>
    );
};

const MenuStyle = ({
    top,
    left,
    right,
    bottom,
}: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}) => {
    const { main } = useColors();

    return StyleSheet.create({
        popup: {
            backgroundColor: main.menuBackground,
            position: "absolute",
            borderRadius: 10,
            top: top,
            left: left,
            right: right,
            bottom: bottom,
        },
        blur: {
            flex: 1,
        },
    });
};

export default PopUpMenu;
