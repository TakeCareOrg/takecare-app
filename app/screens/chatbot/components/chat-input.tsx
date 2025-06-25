import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface ChatInputProps {
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    onMessagePhotoReceived: (message: string) => void;
    onMessageFileReceived: (message: string) => void;
    onInputPressed: () => void;
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

    const isDarkMode = useColorScheme() === "dark";

    const primaryColor = isDarkMode ? "#007AFF" : "#007AFF";
    const textColor = isDarkMode ? "#EEEEEE" : "#0B0B0B";
    const borderColor = isDarkMode ? "#EEEEEE" : "#0B0B0B";
    const defaultPlaceholderColor = isDarkMode ? "#888888" : "#CCCCCC";

    return (
        <View
            style={[
                styles.inputContainer,
                {
                    borderColor: borderColor,
                    borderWidth: isFocused && Platform.OS === "ios" ? 2 : 1,
                },
            ]}
        >
            <View style={styles.contentContainer}>
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

                <View style={styles.inputWrapper}>
                    <TextInput
                        value={value}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                        autoCorrect={autoCorrect}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        autoCapitalize={autoCapitalize}
                        placeholderTextColor={
                            placeholderTextColor || defaultPlaceholderColor
                        }
                        multiline={multiline}
                        editable={!disabled && !loading}
                        style={[
                            styles.textInput,
                            {
                                color: textColor,
                                maxHeight: multiline ? 100 : 48,
                            },
                        ]}
                        textAlignVertical="center"
                    />
                </View>

                {buttonsVisible && (
                    <Animated.View
                        style={[styles.buttonsContainer, { opacity }]}
                    >
                        {/*<PhotoButton*/}
                        {/*    onMessageReceived={onMessagePhotoReceived}*/}
                        {/*    onInputPressed={onInputPressed}*/}
                        {/*    loading={loading}*/}
                        {/*/>*/}
                        {/*<FileButton*/}
                        {/*    onMessageReceived={onMessageFileReceived}*/}
                        {/*    onInputPressed={onInputPressed}*/}
                        {/*    loading={loading}*/}
                        {/*/>*/}
                    </Animated.View>
                )}
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    onPress={onSend}
                    disabled={loading || !value.trim()}
                    style={styles.sendButton}
                >
                    <Ionicons
                        name="send"
                        size={24}
                        color={
                            loading || !value.trim() ? "#AAAFB4" : primaryColor
                        }
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderRadius: 16,
        minHeight: 48,
        marginVertical: 8,
        paddingVertical: 8,
    },
    contentContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
    },
    toggleButton: {
        padding: 8,
        alignSelf: "center",
    },
    inputWrapper: {
        flex: 1,
        justifyContent: "center",
    },
    textInput: {
        fontSize: 14,
        paddingHorizontal: 8,
        paddingVertical: Platform.OS === "ios" ? 12 : 8,
        minHeight: 32,
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 8,
    },
    actionButton: {
        padding: 8,
        marginHorizontal: 4,
    },
    actionsContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 8,
    },
    sendButton: {
        padding: 8,
    },
});

export default ChatInput;
