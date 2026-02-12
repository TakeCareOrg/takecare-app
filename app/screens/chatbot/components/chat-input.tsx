import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";

interface ChatInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    onVocalStart: () => void;
    onVocalEnd: () => void;
    onVocalCancel: () => void;
    onImagePress: () => void;
    isRecording: boolean;
    recordingDuration: number;
    placeholder: string;
    loading: boolean;
    imageUploadTitle: string;
}

const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const ChatInput = ({
    value,
    onChangeText,
    onSend,
    onVocalStart,
    onVocalEnd,
    onVocalCancel,
    onImagePress,
    isRecording,
    recordingDuration,
    placeholder,
    loading,
    imageUploadTitle,
}: ChatInputProps) => {
    const theme = useColorTheme();
    const accentBlue = theme.info;
    const accentRed = theme.error;
    const [showDrawer, setShowDrawer] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const drawerAnim = useRef(new Animated.Value(0)).current;

    // Pulse animation while recording
    useEffect(() => {
        if (isRecording) {
            const anim = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.15,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
            );
            anim.start();
            return () => anim.stop();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording, pulseAnim]);

    // Close drawer when recording starts
    useEffect(() => {
        if (isRecording && showDrawer) {
            setShowDrawer(false);
            Animated.spring(drawerAnim, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
            }).start();
        }
    }, [isRecording, showDrawer, drawerAnim]);

    const toggleDrawer = useCallback(() => {
        setShowDrawer((prev) => {
            const next = !prev;
            Animated.spring(drawerAnim, {
                toValue: next ? 1 : 0,
                useNativeDriver: true,
                friction: 8,
            }).start();
            return next;
        });
    }, [drawerAnim]);

    const handleImagePressInternal = useCallback(() => {
        setShowDrawer(false);
        Animated.spring(drawerAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
        }).start();
        onImagePress();
    }, [drawerAnim, onImagePress]);

    const canSend = !!value.trim() || isRecording;

    return (
        <View style={[styles.container]}>
            <View style={styles.row}>
                <View
                    style={[
                        styles.inputWrapper,
                        {
                            backgroundColor: theme.isDark
                                ? theme.raw.black[400]
                                : theme.raw.white[600],
                            borderColor: isRecording
                                ? accentRed + "60"
                                : theme.border,
                        },
                    ]}
                >
                    {isRecording ? (
                        <View style={styles.recordingIndicator}>
                            <Animated.View
                                style={[
                                    styles.recordingDot,
                                    {
                                        backgroundColor: accentRed,
                                        transform: [{ scale: pulseAnim }],
                                    },
                                ]}
                            />
                            <Text
                                style={[styles.timerText, { color: accentRed }]}
                            >
                                {formatTime(recordingDuration)}
                            </Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={toggleDrawer}
                            disabled={loading}
                            style={styles.drawerButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={showDrawer ? "chevron-down" : "add"}
                                size={24}
                                color={theme.text}
                            />
                        </TouchableOpacity>
                    )}

                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={
                            isRecording ? "Écoute en cours..." : placeholder
                        }
                        placeholderTextColor={
                            isRecording
                                ? accentRed + "80"
                                : theme.isDark
                                  ? theme.raw.white[700]
                                  : theme.raw.black[200]
                        }
                        multiline
                        maxLength={1000}
                        editable={!loading && !isRecording}
                    />

                    <TouchableOpacity
                        onPress={isRecording ? onVocalEnd : onSend}
                        disabled={loading || !canSend}
                        style={[
                            styles.sendButton,
                            {
                                backgroundColor: canSend
                                    ? accentBlue
                                    : accentBlue + "40",
                            },
                        ]}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="send" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={isRecording ? onVocalCancel : onVocalStart}
                    disabled={loading}
                    style={[
                        styles.micButton,
                        {
                            backgroundColor: isRecording
                                ? accentRed + "18"
                                : theme.isDark
                                  ? theme.raw.white[500]
                                  : theme.raw.white[600],
                            borderColor: isRecording
                                ? accentRed + "60"
                                : accentBlue + "30",
                            opacity: loading ? 0.5 : 1,
                        },
                    ]}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={isRecording ? "mic-off-outline" : "mic-outline"}
                        size={24}
                        color={isRecording ? accentRed : accentBlue}
                    />
                </TouchableOpacity>
            </View>

            {showDrawer && !isRecording && (
                <Animated.View
                    style={[
                        styles.drawer,
                        {
                            opacity: drawerAnim,
                            transform: [
                                {
                                    translateY: drawerAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0],
                                    }),
                                },
                            ],
                            backgroundColor: theme.background,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.drawerContent,
                            {
                                backgroundColor: theme.isDark
                                    ? theme.raw.black[400]
                                    : theme.raw.white[600],
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={handleImagePressInternal}
                            disabled={loading}
                            style={styles.drawerOption}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.optionIcon,
                                    {
                                        backgroundColor: accentBlue + "15",
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="image"
                                    size={20}
                                    color={accentBlue}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.optionText,
                                    { color: theme.text },
                                ]}
                            >
                                {imageUploadTitle}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: Platform.OS === "ios" ? 20 : 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
    },
    inputWrapper: {
        flex: 1,
        minHeight: 44,
        borderRadius: 24,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },
    drawerButton: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        paddingRight: 8,
        paddingVertical: 12,
        fontSize: 16,
        lineHeight: 20,
    },
    sendButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
    },
    recordingIndicator: {
        flexDirection: "row",
        alignItems: "center",
        height: 44,
        gap: 5,
        paddingLeft: 12,
        paddingRight: 4,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    timerText: {
        fontSize: 13,
        fontWeight: "700",
        fontVariant: ["tabular-nums"],
    },
    micButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
    },
    drawer: {
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 68,
        zIndex: 100,
    },
    drawerContent: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 4,
        overflow: "hidden",
    },
    drawerOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 12,
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    optionText: {
        fontSize: 16,
        fontWeight: "500",
    },
});

export default ChatInput;
