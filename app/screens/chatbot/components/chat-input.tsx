import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    GestureResponderEvent,
    NativeTouchEvent,
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
    onImagePress: () => void;
    isRecording: boolean;
    recordingDuration: number;
    volumeLevels: number[];
    placeholder: string;
    loading: boolean;
    imageUploadTitle: string;
}

interface TouchWithIdentifier extends NativeTouchEvent {
    identifier: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChangeText,
    onSend,
    onVocalStart,
    onVocalEnd,
    onVocalCancel,
    onImagePress,
    isRecording,
    recordingDuration,
    volumeLevels,
    placeholder,
    loading,
    imageUploadTitle,
}) => {
    const theme = useColorTheme();

    const [isLocked, setIsLocked] = useState(false);
    const [slideProgress, setSlideProgress] = useState(0);
    const [showIndicators, setShowIndicators] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);

    const isTouchingRef = useRef(false);
    const touchStartTimeRef = useRef<number>(0);
    const touchStartXRef = useRef<number>(0);
    const touchStartYRef = useRef<number>(0);
    const recordingTouchIdRef = useRef<string | null>(null);
    const checkTimerRef = useRef<NodeJS.Timeout | null>(null);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const cancelOpacityAnim = useRef(new Animated.Value(0)).current;
    const lockOpacityAnim = useRef(new Animated.Value(0)).current;
    const drawerAnim = useRef(new Animated.Value(0)).current;

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
        Animated.spring(drawerAnim, {
            toValue: showDrawer ? 1 : 0,
            useNativeDriver: true,
            friction: 8,
        }).start();
    }, [showDrawer, drawerAnim]);

    useEffect(() => {
        return () => {
            if (checkTimerRef.current) {
                clearTimeout(checkTimerRef.current);
            }
        };
    }, []);

    const handleManualCancel = useRef(() => {
        if (checkTimerRef.current) {
            clearTimeout(checkTimerRef.current);
            checkTimerRef.current = null;
        }

        onVocalCancel();
        setIsLocked(false);
        setSlideProgress(0);
        setShowIndicators(false);
        isTouchingRef.current = false;
    });

    const handleManualSend = useRef(() => {
        if (checkTimerRef.current) {
            clearTimeout(checkTimerRef.current);
            checkTimerRef.current = null;
        }

        onVocalEnd();
        setIsLocked(false);
        setSlideProgress(0);
        setShowIndicators(false);
        isTouchingRef.current = false;
    });

    useEffect(() => {
        handleManualCancel.current = () => {
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
    }, [onVocalCancel]);

    useEffect(() => {
        handleManualSend.current = () => {
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
    }, [onVocalEnd]);

    const handlersRef = useRef({
        onTouchStart: (evt: GestureResponderEvent) => {},
        onTouchMove: (evt: GestureResponderEvent) => {},
        onTouchEnd: (evt: GestureResponderEvent) => {},
    });

    useEffect(() => {
        handlersRef.current.onTouchStart = (evt: GestureResponderEvent) => {
            if (loading) return;

            const touch = evt.nativeEvent
                .touches[0] as unknown as TouchWithIdentifier;
            if (!touch) return;

            isTouchingRef.current = true;
            setShowIndicators(true);

            recordingTouchIdRef.current = touch.identifier;
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
                (t) =>
                    (t as unknown as TouchWithIdentifier).identifier ===
                    recordingTouchIdRef.current,
            ) as TouchWithIdentifier | undefined;

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
    }, [isLocked, slideProgress, cancelOpacityAnim, lockOpacityAnim]);

    useEffect(() => {
        handlersRef.current.onTouchEnd = (evt: GestureResponderEvent) => {
            if (!isTouchingRef.current) return;

            const allTouches = evt.nativeEvent.touches;
            const isOurTouch = Array.from(allTouches).some(
                (t) =>
                    (t as unknown as TouchWithIdentifier).identifier ===
                    recordingTouchIdRef.current,
            );

            if (isOurTouch) return;

            isTouchingRef.current = false;
            recordingTouchIdRef.current = null;
            setShowIndicators(false);

            if (slideProgress === 1) {
                setIsLocked(true);
                setSlideProgress(0);
                Animated.timing(lockOpacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            } else if (slideProgress === -1) {
                if (checkTimerRef.current) {
                    clearTimeout(checkTimerRef.current);
                    checkTimerRef.current = null;
                }
                onVocalCancel();
                setSlideProgress(0);
                Animated.timing(cancelOpacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            } else {
                const recordingTime = Date.now() - touchStartTimeRef.current;

                if (recordingTime < 500) {
                    if (checkTimerRef.current) {
                        clearTimeout(checkTimerRef.current);
                        checkTimerRef.current = null;
                    }
                    onVocalCancel();
                } else {
                    if (checkTimerRef.current) {
                        clearTimeout(checkTimerRef.current);
                        checkTimerRef.current = null;
                    }
                    onVocalEnd();
                }
            }
        };
    }, [
        slideProgress,
        onVocalCancel,
        onVocalEnd,
        lockOpacityAnim,
        cancelOpacityAnim,
    ]);

    const formatTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const medicalBlue = "#0066FF";
    const cancelRed = "#EF4444";
    const lockGreen = "#10B981";

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {showIndicators && (
                <>
                    <Animated.View
                        style={[
                            styles.slideIndicator,
                            styles.cancelIndicator,
                            {
                                borderColor: cancelRed,
                                backgroundColor: theme.background + "F0",
                                opacity: cancelOpacityAnim,
                            },
                        ]}
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
                                borderColor: lockGreen,
                                backgroundColor: theme.background + "F0",
                                opacity: lockOpacityAnim,
                            },
                        ]}
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
                    <>
                        <View
                            style={[
                                styles.inputWrapper,
                                {
                                    backgroundColor: theme.isDark
                                        ? theme.raw.white[500]
                                        : theme.raw.white[600],
                                    borderColor: theme.border,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => setShowDrawer(!showDrawer)}
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

                        {showDrawer && (
                            <Animated.View
                                style={[
                                    styles.drawer,
                                    {
                                        opacity: drawerAnim,
                                        transform: [
                                            {
                                                translateY:
                                                    drawerAnim.interpolate({
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
                                                ? theme.raw.white[500]
                                                : theme.raw.white[600],
                                            borderColor: theme.border,
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowDrawer(false);
                                            onImagePress();
                                        }}
                                        disabled={loading}
                                        style={styles.drawerOption}
                                        activeOpacity={0.7}
                                    >
                                        <View
                                            style={[
                                                styles.optionIcon,
                                                {
                                                    backgroundColor:
                                                        medicalBlue + "15",
                                                },
                                            ]}
                                        >
                                            <Ionicons
                                                name="image"
                                                size={20}
                                                color={medicalBlue}
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
                    </>
                )}

                <View style={styles.buttonsContainer}>
                    {isRecording && isLocked && (
                        <TouchableOpacity
                            onPress={() => handleManualCancel.current()}
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
                            onPress={() => handleManualSend.current()}
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
        paddingBottom: Platform.OS === "ios" ? 20 : 8,
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
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },
    drawerButton: {
        paddingLeft: 12,
        paddingRight: 8,
        paddingVertical: 12,
        justifyContent: "center",
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        paddingRight: 16,
        paddingVertical: 12,
        fontSize: 16,
        lineHeight: 20,
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
    },
    cancelButton: {
        padding: 2,
    },
});

export default ChatInput;
