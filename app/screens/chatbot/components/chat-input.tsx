import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";

import { VocalButton } from "./vocal-button";

const MAX_DURATION = 90000;

interface ChatInputProps {
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    onVocalPressIn?: () => void;
    onVocalPressOut?: () => void;
    isRecording?: boolean;
    recordingDuration?: number;
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
    onVocalPressIn,
    onVocalPressOut,
    isRecording = false,
    recordingDuration = 0,
    autoCorrect = false,
    autoCapitalize = "sentences",
    placeholderTextColor,
    multiline = true,
    disabled = false,
    loading = false,
}: ChatInputProps) {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const textInputRef = useRef<TextInput>(null);
    const recordingPulse = useRef(new Animated.Value(0)).current;
    const borderAnim = useRef(new Animated.Value(0)).current;

    const themeColors = useColorTheme();

    const textColor = themeColors.text;
    const defaultPlaceholderColor = themeColors.isDark
        ? themeColors.raw.grey[600]
        : themeColors.raw.grey[200];

    const baseBorderColor = themeColors.isDark
        ? themeColors.raw.grey[600]
        : themeColors.raw.grey[200];

    useEffect(() => {
        Animated.timing(borderAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused]);

    const animatedBorderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [baseBorderColor, themeColors.raw.blue[500]],
    });

    const recordingOpacity = recordingPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.7],
    });

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleVocalPressIn = () => {
        if (onVocalPressIn && !loading && !disabled) {
            onVocalPressIn();
        }
    };

    const handleVocalPressOut = () => {
        if (onVocalPressOut) {
            onVocalPressOut();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Animated.View
                    style={[
                        styles.inputWrapper,
                        {
                            borderColor: animatedBorderColor,
                            shadowColor: themeColors.isDark
                                ? "#000"
                                : themeColors.raw.grey[400],
                        },
                        isRecording && styles.recordingBorder,
                    ]}
                >
                    {value.trim().length === 0 && onVocalPressIn && (
                        <VocalButton
                            isRecording={isRecording}
                            recordingDuration={recordingDuration}
                            maxDuration={MAX_DURATION}
                            onPressIn={handleVocalPressIn}
                            onPressOut={handleVocalPressOut}
                            disabled={loading || disabled}
                        />
                    )}

                    {isRecording && (
                        <View style={styles.recordingInfo}>
                            <Animated.View
                                style={[
                                    styles.recordingDot,
                                    {
                                        backgroundColor:
                                            themeColors.raw.red[500],
                                        opacity: recordingOpacity,
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.durationText,
                                    { color: themeColors.raw.red[500] },
                                ]}
                            >
                                {formatDuration(recordingDuration)}
                            </Text>
                        </View>
                    )}

                    {!isRecording && (
                        <TextInput
                            ref={textInputRef}
                            style={[
                                styles.textInput,
                                {
                                    color: textColor,
                                    paddingVertical:
                                        Platform.OS === "ios" ? 10 : 6,
                                    textAlignVertical:
                                        Platform.OS === "android"
                                            ? "center"
                                            : "top",
                                },
                            ]}
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
                        />
                    )}

                    {!isRecording && (
                        <Pressable
                            style={[
                                styles.sendButton,
                                {
                                    opacity:
                                        value.trim().length > 0 && !loading
                                            ? 1
                                            : 0.5,
                                },
                            ]}
                            onPress={onSend}
                            disabled={value.trim().length === 0 || loading}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={themeColors.blue}
                                />
                            ) : (
                                <View
                                    style={[
                                        styles.sendButtonInner,
                                        {
                                            backgroundColor:
                                                value.trim().length > 0
                                                    ? themeColors.raw.blue[500]
                                                    : themeColors.isDark
                                                      ? themeColors.raw
                                                            .grey[800]
                                                      : themeColors.raw
                                                            .grey[100],
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name="send"
                                        size={16}
                                        color={
                                            value.trim().length > 0
                                                ? "#fff"
                                                : themeColors.isDark
                                                  ? themeColors.raw.grey[500]
                                                  : themeColors.raw.grey[400]
                                        }
                                    />
                                </View>
                            )}
                        </Pressable>
                    )}
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
    },
    inputContainer: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 30,
        borderWidth: 2,
        paddingHorizontal: 12,
        paddingVertical: 6,
        minHeight: 44,
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    recordingBorder: {
        borderColor: "#ef4444",
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 6,
        includeFontPadding: false,
        lineHeight: 20,
        minHeight: 40,
        maxHeight: 100,
    },
    recordingInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 6,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    durationText: {
        fontSize: 15,
        fontWeight: "700",
        fontVariant: ["tabular-nums"],
    },
    sendButton: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
    sendButtonInner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ChatInput;
