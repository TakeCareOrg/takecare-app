import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    GestureResponderEvent,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";

import { LiveWaveform } from "./live-wave-form";
import { VocalButton } from "./vocal-button";

interface ChatInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    onVocalStart: () => void;
    onVocalEnd: () => void;
    onVocalCancel: () => void;
    isRecording: boolean;
    recordingDuration: number;
    volumeLevels: number[];
    placeholder: string;
    loading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChangeText,
    onSend,
    onVocalStart,
    onVocalEnd,
    onVocalCancel,
    isRecording,
    recordingDuration,
    volumeLevels,
    placeholder,
    loading,
}) => {
    const theme = useColorTheme();

    const [isLocked, setIsLocked] = useState(false);
    const [slideProgress, setSlideProgress] = useState(0);
    const [showIndicators, setShowIndicators] = useState(false);

    const isTouchingRef = useRef(false);
    const touchStartTimeRef = useRef<number>(0);
    const touchStartXRef = useRef<number>(0);
    const touchStartYRef = useRef<number>(0);
    const recordingTouchIdRef = useRef<number | null>(null);
    const checkTimerRef = useRef<NodeJS.Timeout | null>(null);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const cancelOpacityAnim = useRef(new Animated.Value(0)).current;
    const lockOpacityAnim = useRef(new Animated.Value(0)).current;

    // Reset states when recording stops (from HEAD)
    useEffect(() => {
        if (!isRecording) {
            setIsLocked(false);
            setSlideProgress(0);
            setShowIndicators(false);
            pulseAnim.setValue(1);
            cancelOpacityAnim.setValue(0);
            lockOpacityAnim.setValue(0);
            recordingTouchIdRef.current = null;
            isTouchingRef.current = false;
        }
    }, [isRecording, pulseAnim, cancelOpacityAnim, lockOpacityAnim]);

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
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
            ).start();
        }
    }, [isRecording, pulseAnim]);

    useEffect(() => {
        return () => {
            if (checkTimerRef.current) {
                clearTimeout(checkTimerRef.current);
            }
        };
    }, []);

    const handlersRef = useRef({
        onTouchStart: (evt: GestureResponderEvent) => {},
        onTouchMove: (evt: GestureResponderEvent) => {},
        onTouchEnd: (evt: GestureResponderEvent) => {},
    });

    useEffect(() => {
        handlersRef.current.onTouchStart = (evt: GestureResponderEvent) => {
            if (loading) return;

            const touch = evt.nativeEvent.touches[0];
            if (!touch) return;

            isTouchingRef.current = true;
            setShowIndicators(true);

            recordingTouchIdRef.current = Number(touch.identifier);
            touchStartTimeRef.current = Date.now();
            touchStartXRef.current = touch.pageX;
            touchStartYRef.current = touch.pageY;
            setIsLocked(false);
            setSlideProgress(0);

            onVocalStart();
        };
    }, [loading, onVocalStart]);

    useEffect(() => {
        handlersRef.current.onTouchMove = (evt: GestureResponderEvent) => {
            if (!isTouchingRef.current || isLocked) return;

            const touch = Array.from(evt.nativeEvent.touches).find(
                (t: any) => t.identifier === recordingTouchIdRef.current,
            );

            if (!touch) return;

            const deltaX = touch.pageX - touchStartXRef.current;
            const deltaY = touch.pageY - touchStartYRef.current;

            if (deltaY < -80 && Math.abs(deltaX) < 50) {
                if (slideProgress !== 1) {
                    setSlideProgress(1);

                    Animated.parallel([
                        Animated.timing(lockOpacityAnim, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(cancelOpacityAnim, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }
            } else if (deltaX < -120 && Math.abs(deltaY) < 50) {
                if (slideProgress !== -1) {
                    setSlideProgress(-1);

                    Animated.parallel([
                        Animated.timing(cancelOpacityAnim, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(lockOpacityAnim, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }
            } else if (slideProgress !== 0 && deltaX > -120 && deltaY > -80) {
                setSlideProgress(0);

                Animated.parallel([
                    Animated.timing(cancelOpacityAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(lockOpacityAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        };
    }, [isLocked, slideProgress, lockOpacityAnim, cancelOpacityAnim]);

    const handleManualCancel = () => {
        if (checkTimerRef.current) {
            clearTimeout(checkTimerRef.current);
            checkTimerRef.current = null;
        }

        onVocalCancel();
        setIsLocked(false);
        setSlideProgress(0);
        setShowIndicators(false);
        isTouchingRef.current = false;
    };

    const handleManualSend = () => {
        if (checkTimerRef.current) {
            clearTimeout(checkTimerRef.current);
            checkTimerRef.current = null;
        }

        onVocalEnd();
        setIsLocked(false);
        setSlideProgress(0);
        setShowIndicators(false);
        isTouchingRef.current = false;
    };

    useEffect(() => {
        handlersRef.current.onTouchEnd = (evt: GestureResponderEvent) => {
            if (!isTouchingRef.current) return;

            const endedTouch = evt.nativeEvent.changedTouches[0];

            if (
                endedTouch &&
                Number(endedTouch.identifier) !== recordingTouchIdRef.current
            ) {
                return;
            }

            isTouchingRef.current = false;
            setShowIndicators(false);

            Animated.parallel([
                Animated.timing(cancelOpacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(lockOpacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            if (slideProgress === -1) {
                handleManualCancel();
                return;
            }

            if (slideProgress === 1) {
                setIsLocked(true);
                setSlideProgress(0);
                return;
            }

            if (isLocked) {
                return;
            }

            const touchDuration = Date.now() - touchStartTimeRef.current;

            if (touchDuration < 500) {
                handleManualCancel();
                return;
            }

            checkTimerRef.current = setTimeout(() => {
                onVocalEnd();
            }, 150);
        };
    }, [
        slideProgress,
        isLocked,
        onVocalEnd,
        cancelOpacityAnim,
        lockOpacityAnim,
    ]);

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const medicalBlue = theme.isDark ? "#60A5FA" : "#3B82F6";
    const cancelRed = theme.isDark ? "#EF4444" : "#DC2626";
    const lockGreen = theme.isDark ? "#10B981" : "#059669";

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {showIndicators && !isLocked && (
                <>
                    <Animated.View
                        style={[
                            styles.slideIndicator,
                            styles.cancelIndicator,
                            {
                                opacity: cancelOpacityAnim,
                                backgroundColor: cancelRed + "20",
                                borderColor: cancelRed,
                            },
                        ]}
                        pointerEvents="none"
                    >
                        <Ionicons
                            name="close-circle"
                            size={32}
                            color={cancelRed}
                        />
                        <Text
                            style={[styles.indicatorText, { color: cancelRed }]}
                        >
                            Annuler
                        </Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.slideIndicator,
                            styles.lockIndicator,
                            {
                                opacity: lockOpacityAnim,
                                backgroundColor: lockGreen + "20",
                                borderColor: lockGreen,
                            },
                        ]}
                        pointerEvents="none"
                    >
                        <Ionicons
                            name="lock-closed"
                            size={32}
                            color={lockGreen}
                        />
                        <Text
                            style={[styles.indicatorText, { color: lockGreen }]}
                        >
                            Verrouiller
                        </Text>
                    </Animated.View>
                </>
            )}

            <View style={styles.normalContainer}>
                {isRecording ? (
                    <View style={styles.recordingInfo}>
                        <View style={styles.timerContainer}>
                            <Animated.View
                                style={[
                                    styles.recordingDot,
                                    { transform: [{ scale: pulseAnim }] },
                                ]}
                            />
                            <Text
                                style={[styles.timerText, { color: cancelRed }]}
                            >
                                {formatTime(recordingDuration)}
                            </Text>
                            {isLocked && (
                                <View
                                    style={[
                                        styles.lockBadge,
                                        { backgroundColor: lockGreen },
                                    ]}
                                >
                                    <Ionicons
                                        name="lock-closed"
                                        size={10}
                                        color="#FFFFFF"
                                    />
                                </View>
                            )}
                        </View>

                        <View style={styles.waveformContainer}>
                            <LiveWaveform
                                levels={volumeLevels}
                                width={180}
                                height={32}
                            />
                        </View>
                    </View>
                ) : (
                    <View
                        style={[
                            styles.inputWrapper,
                            {
                                backgroundColor: theme.isDark
                                    ? theme.raw.white[400]
                                    : theme.raw.white[100],
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            placeholderTextColor={theme.text + "80"}
                            multiline
                            maxLength={1000}
                            editable={!loading && !isRecording}
                        />
                    </View>
                )}

                <View style={styles.buttonsContainer}>
                    {isRecording && (
                        <TouchableOpacity
                            onPress={handleManualCancel}
                            style={styles.cancelButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="close-circle"
                                size={32}
                                color={cancelRed}
                            />
                        </TouchableOpacity>
                    )}

                    {isRecording && isLocked && (
                        <TouchableOpacity
                            onPress={handleManualSend}
                            style={[
                                styles.sendButton,
                                { backgroundColor: medicalBlue },
                            ]}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}

                    {value.trim() && !isRecording && (
                        <TouchableOpacity
                            onPress={onSend}
                            disabled={loading}
                            style={[
                                styles.sendButton,
                                {
                                    backgroundColor: medicalBlue,
                                    opacity: loading ? 0.5 : 1,
                                },
                            ]}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}

                    <VocalButton
                        theme={theme}
                        medicalBlue={medicalBlue}
                        loading={loading}
                        onTouchStart={(evt) =>
                            handlersRef.current.onTouchStart(evt)
                        }
                        onTouchMove={(evt) =>
                            handlersRef.current.onTouchMove(evt)
                        }
                        onTouchEnd={(evt) =>
                            handlersRef.current.onTouchEnd(evt)
                        }
                        visible={!value.trim()}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: Platform.OS === "ios" ? 20 : 12,
        position: "relative",
    },

    slideIndicator: {
        position: "absolute",
        borderRadius: 20,
        borderWidth: 2,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        zIndex: 1000,
    },
    cancelIndicator: {
        left: 24,
        bottom: 80,
    },
    lockIndicator: {
        right: 24,
        bottom: 120,
    },
    indicatorText: {
        fontSize: 12,
        fontWeight: "600",
    },

    normalContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
    },

    inputWrapper: {
        flex: 1,
        borderRadius: 24,
        borderWidth: 1,
        overflow: "hidden",
    },
    input: {
        minHeight: 44,
        maxHeight: 120,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        lineHeight: 20,
    },

    recordingInfo: {
        flex: 1,
        gap: 4,
        justifyContent: "center",
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    recordingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#EF4444",
    },
    timerText: {
        fontSize: 16,
        fontWeight: "700",
        fontVariant: ["tabular-nums"],
    },
    lockBadge: {
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 4,
    },
    waveformContainer: {
        paddingVertical: 2,
    },

    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    cancelButton: {
        padding: 2,
    },
});

export default ChatInput;
