import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Keyboard,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";

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

export function ChatInput({
    value,
    placeholder,
    onChangeText,
    onSend,
    autoCorrect = false,
    autoCapitalize = "sentences",
    placeholderTextColor,
    multiline = true,
    disabled = false,
    loading = false,
}: ChatInputProps) {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const textInputRef = useRef<TextInput>(null);
    const focusAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [focusAnim, isFocused]);

    const themeColors = useColorTheme();

    const textColor = themeColors.text;
    const defaultPlaceholderColor = themeColors.isDark
        ? themeColors.black[500]
        : themeColors.black[50];

    const borderColor = themeColors.isDark
        ? themeColors.black[300]
        : themeColors.black[50];
    const handleOutsidePress = () => {
        if (isFocused) {
            textInputRef.current?.blur();
            Keyboard.dismiss();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View>
                <View style={styles.inputContainer}>
                    <View
                        style={[
                            styles.inputWrapper,
                            { borderColor: borderColor },
                        ]}
                    >
                        <TextInput
                            ref={textInputRef}
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
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                {
                                    opacity:
                                        value.trim().length > 0 && !loading
                                            ? 1
                                            : 0.6,
                                },
                            ]}
                            onPress={onSend}
                            disabled={value.trim().length === 0 || loading}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={themeColors.blue[200]}
                                />
                            ) : (
                                <Ionicons
                                    name="send"
                                    size={20}
                                    color={
                                        value.trim().length > 0
                                            ? themeColors.raw.blue[200]
                                            : themeColors.isDark
                                              ? themeColors.black[200]
                                              : themeColors.black[50]
                                    }
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        paddingVertical: 12,
        paddingBottom: Platform.OS === "ios" ? 28 : 12,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "flex-end",
        borderRadius: 25,
        borderWidth: 2,
        paddingHorizontal: 16,
        paddingVertical: 6,
        minHeight: 40,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        maxHeight: 100,
        paddingVertical: 6,
    },
    sendButton: {
        padding: 6,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
});

export default ChatInput;
