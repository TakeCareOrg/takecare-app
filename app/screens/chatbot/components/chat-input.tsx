import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Easing,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

import { BlurView } from "expo-blur";

import { Ionicons } from "@expo/vector-icons";

interface ChatInputProps {
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    onMessagePhotoReceived?: (message: string) => void;
    onMessageFileReceived?: (message: string) => void;
    onInputPressed?: () => void;
    autoCorrect?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    placeholderTextColor?: string;
    multiline?: boolean;
    disabled?: boolean;
    loading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    placeholder,
    onChangeText,
    onSend,
    // onMessagePhotoReceived,
    // onMessageFileReceived,
    // onInputPressed,
    autoCorrect = false,
    autoCapitalize = "sentences",
    placeholderTextColor,
    multiline = true,
    disabled = false,
    loading = false,
}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [showButtons, setShowButtons] = useState<boolean>(false);
    const [buttonsVisible, setButtonsVisible] = useState<boolean>(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const focusAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showButtons) {
            setButtonsVisible(true);
            Animated.timing(opacity, {
                toValue: 1,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start(() => setButtonsVisible(false));
        }
    }, [showButtons, opacity]);

    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused]);

    const isDarkMode = useColorScheme() === "dark";
    const textColor = isDarkMode ? "#FFFFFF" : "#000000";
    const defaultPlaceholderColor = isDarkMode ? "#8E8E93" : "#8E8E93";
    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [isDarkMode ? "#3C3C3E" : "#E0E0E0", "#4A90E2"],
    });

    return (
        <BlurView
            intensity={80}
            tint={isDarkMode ? "dark" : "light"}
            style={styles.inputContainer}
        >
            <Animated.View
                style={[
                    styles.inputWrapper,
                    {
                        backgroundColor: isDarkMode
                            ? "rgba(44,44,46,0.8)"
                            : "rgba(248,248,248,0.8)",
                        borderColor,
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={() => setShowButtons(!showButtons)}
                    style={styles.toggleButton}
                >
                    <Ionicons
                        name={showButtons ? "chevron-down" : "chevron-up"}
                        size={24}
                        color={textColor}
                    />
                </TouchableOpacity>
                <TextInput
                    style={[styles.textInput, { color: textColor }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={
                        placeholderTextColor || defaultPlaceholderColor
                    }
                    autoCorrect={autoCorrect}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize={autoCapitalize}
                    multiline={multiline}
                    editable={!disabled && !loading}
                    maxLength={500}
                    textAlignVertical="center"
                />
                {buttonsVisible && (
                    <Animated.View
                        style={[styles.buttonsContainer, { opacity }]}
                    >
                        {/*<PhotoButton
                            onMessageReceived={onMessagePhotoReceived}
                            onInputPressed={onInputPressed}
                            loading={loading}
                        />
                        <FileButton
                            onMessageReceived={onMessageFileReceived}
                            onInputPressed={onInputPressed}
                            loading={loading}
                        />*/}
                    </Animated.View>
                )}
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        {
                            backgroundColor:
                                value.trim().length > 0 && !loading
                                    ? "#4A90E2"
                                    : "#CCCCCC",
                            opacity:
                                value.trim().length > 0 && !loading ? 1 : 0.6,
                        },
                    ]}
                    onPress={onSend}
                    disabled={value.trim().length === 0 || loading}
                    activeOpacity={0.7}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name="send" size={20} color="white" />
                    )}
                </TouchableOpacity>
            </Animated.View>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: Platform.OS === "ios" ? 34 : 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "flex-end",
        borderRadius: 25,
        borderWidth: 2,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 50,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        maxHeight: 100,
        paddingVertical: 8,
    },
    toggleButton: {
        padding: 8,
        alignSelf: "center",
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 8,
    },
    sendButton: {
        padding: 8,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
});

export default ChatInput;
