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
    onVocalPress?: () => void;
    isRecording?: boolean;
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
    onVocalPress,
    isRecording = false,
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
    const recordingAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [focusAnim, isFocused]);

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(recordingAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(recordingAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        } else {
            recordingAnim.setValue(0);
        }
    }, [isRecording, recordingAnim]);

    const themeColors = useColorTheme();

    const textColor = themeColors.text;
    const defaultPlaceholderColor = themeColors.isDark
        ? themeColors.raw.grey[600]
        : themeColors.raw.grey[200];

    const borderColor = themeColors.isDark
        ? themeColors.raw.grey[600]
        : themeColors.raw.grey[200];

    const handleOutsidePress = () => {
        if (isFocused) {
            textInputRef.current?.blur();
            Keyboard.dismiss();
        }
    };

    const recordingScale = recordingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2],
    });

    const recordingOpacity = recordingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.6],
    });

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View>
                <View style={styles.inputContainer}>
                    <View
                        style={[
                            styles.inputWrapper,
                            { borderColor: borderColor },
                            isRecording && styles.recordingBorder,
                        ]}
                    >
                        {value.trim().length === 0 && onVocalPress && (
                            <TouchableOpacity
                                style={styles.micButton}
                                onPress={onVocalPress}
                                disabled={loading || disabled}
                                activeOpacity={0.7}
                            >
                                <Animated.View
                                    style={{
                                        transform: [{ scale: recordingScale }],
                                        opacity: recordingOpacity,
                                    }}
                                >
                                    <Ionicons
                                        name={
                                            isRecording ? "mic" : "mic-outline"
                                        }
                                        size={20}
                                        color={
                                            isRecording
                                                ? themeColors.raw.red[400]
                                                : themeColors.isDark
                                                  ? themeColors.raw.grey[600]
                                                  : themeColors.raw.grey[200]
                                        }
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        )}

                        <TextInput
                            ref={textInputRef}
                            style={[styles.textInput, { color: textColor }]}
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={
                                isRecording ? "Recording..." : placeholder
                            }
                            placeholderTextColor={
                                placeholderTextColor || defaultPlaceholderColor
                            }
                            autoCorrect={autoCorrect}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            autoCapitalize={autoCapitalize}
                            multiline={multiline}
                            editable={!disabled && !loading && !isRecording}
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
                                    color={themeColors.blue}
                                />
                            ) : (
                                <Ionicons
                                    name="send"
                                    size={20}
                                    color={
                                        value.trim().length > 0
                                            ? themeColors.raw.blue[200]
                                            : themeColors.isDark
                                              ? themeColors.raw.grey[600]
                                              : themeColors.raw.grey[200]
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
    recordingBorder: {
        borderColor: "#ef4444",
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        maxHeight: 100,
        paddingVertical: 6,
    },
    micButton: {
        padding: 6,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    sendButton: {
        padding: 6,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
});

export default ChatInput;
