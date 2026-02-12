import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
    placeholder: string;
    loading: boolean;
    imageUploadTitle: string;
}

interface TouchWithIdentifier extends NativeTouchEvent {
    identifier: string;
}

// Moved outside component — pure function, no deps on props/state
const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Moved outside component — static constants
const MEDICAL_BLUE = "#0066FF";
const CANCEL_RED = "#EF4444";
const LOCK_GREEN = "#10B981";

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

    // ──────────────────────────────────────────────────────────────
    // Single ref that always holds the latest props & state.
    // Updated synchronously during render — no useEffect needed.
    // Stable useCallback handlers read from this ref so they never
    // go stale, yet they keep a stable identity (no re-renders).
    // ──────────────────────────────────────────────────────────────
    const latestRef = useRef({
        loading,
        onVocalStart,
        onVocalEnd,
        onVocalCancel,
        onImagePress,
        isLocked,
        slideProgress,
    });
    latestRef.current.loading = loading;
    latestRef.current.onVocalStart = onVocalStart;
    latestRef.current.onVocalEnd = onVocalEnd;
    latestRef.current.onVocalCancel = onVocalCancel;
    latestRef.current.onImagePress = onImagePress;
    latestRef.current.isLocked = isLocked;
    latestRef.current.slideProgress = slideProgress;

    // ──────────────────────────────────────────────────────────────
    // useEffect #1 — Combined recording lifecycle (was 2 effects)
    // Handles both: reset on stop + pulse animation on start.
    // The cleanup function stops the animation when isRecording
    // changes, preventing leaks.
    // ──────────────────────────────────────────────────────────────
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

    // ──────────────────────────────────────────────────────────────
    // useEffect #2 — Cleanup timer on unmount (legitimate cleanup)
    // ──────────────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (checkTimerRef.current) {
                clearTimeout(checkTimerRef.current);
            }
        };
    }, []);

    // ──────────────────────────────────────────────────────────────
    // Shared helpers — stable via useCallback with no changing deps
    // ──────────────────────────────────────────────────────────────
    const clearCheckTimer = useCallback(() => {
        if (checkTimerRef.current) {
            clearTimeout(checkTimerRef.current);
            checkTimerRef.current = null;
        }
    }, []);

    const resetRecordingState = useCallback(() => {
        setIsLocked(false);
        setSlideProgress(0);
        setShowIndicators(false);
        isTouchingRef.current = false;
    }, []);

    // ──────────────────────────────────────────────────────────────
    // Manual cancel / send — read callbacks from latestRef
    // (replaces 2 useEffects that kept refs in sync)
    // ──────────────────────────────────────────────────────────────
    const handleManualCancel = useCallback(() => {
        clearCheckTimer();
        latestRef.current.onVocalCancel();
        resetRecordingState();
    }, [clearCheckTimer, resetRecordingState]);

    const handleManualSend = useCallback(() => {
        clearCheckTimer();
        latestRef.current.onVocalEnd();
        resetRecordingState();
    }, [clearCheckTimer, resetRecordingState]);

    // ──────────────────────────────────────────────────────────────
    // Drawer toggle — animation moved into the handler
    // (replaces 1 useEffect that watched showDrawer)
    // ──────────────────────────────────────────────────────────────
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
        latestRef.current.onImagePress();
    }, [drawerAnim]);

    // ──────────────────────────────────────────────────────────────
    // Touch handlers — stable callbacks reading from latestRef
    // (replaces 3 useEffects that kept handlersRef in sync)
    // ──────────────────────────────────────────────────────────────
    const handleTouchStart = useCallback((evt: GestureResponderEvent) => {
        if (latestRef.current.loading) return;

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

        latestRef.current.onVocalStart();
    }, []);

    const handleTouchMove = useCallback(
        (evt: GestureResponderEvent) => {
            if (!isTouchingRef.current || latestRef.current.isLocked) return;

            const touch = Array.from(evt.nativeEvent.touches).find(
                (t) =>
                    (t as unknown as TouchWithIdentifier).identifier ===
                    recordingTouchIdRef.current,
            ) as TouchWithIdentifier | undefined;

            if (!touch) return;

            const deltaX = touch.pageX - touchStartXRef.current;
            const deltaY = touch.pageY - touchStartYRef.current;
            const currentSlideProgress = latestRef.current.slideProgress;

            if (deltaY < -80 && Math.abs(deltaX) < 50) {
                if (currentSlideProgress !== 1) {
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
                if (currentSlideProgress !== -1) {
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
            } else if (
                currentSlideProgress !== 0 &&
                deltaX > -120 &&
                deltaY > -80
            ) {
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
        },
        [cancelOpacityAnim, lockOpacityAnim],
    );

    const handleTouchEnd = useCallback(
        (evt: GestureResponderEvent) => {
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

            const currentSlideProgress = latestRef.current.slideProgress;

            if (currentSlideProgress === 1) {
                setIsLocked(true);
                setSlideProgress(0);
                Animated.timing(lockOpacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            } else if (currentSlideProgress === -1) {
                clearCheckTimer();
                latestRef.current.onVocalCancel();
                setSlideProgress(0);
                Animated.timing(cancelOpacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            } else {
                const recordingTime = Date.now() - touchStartTimeRef.current;

                clearCheckTimer();

                if (recordingTime < 500) {
                    latestRef.current.onVocalCancel();
                } else {
                    latestRef.current.onVocalEnd();
                }
            }
        },
        [lockOpacityAnim, cancelOpacityAnim, clearCheckTimer],
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {showIndicators && (
                <>
                    <Animated.View
                        style={[
                            styles.slideIndicator,
                            styles.cancelIndicator,
                            {
                                borderColor: CANCEL_RED,
                                backgroundColor: theme.background + "F0",
                                opacity: cancelOpacityAnim,
                            },
                        ]}
                    >
                        <Ionicons
                            name="close-circle"
                            size={32}
                            color={CANCEL_RED}
                        />
                        <Text
                            style={[
                                styles.indicatorText,
                                { color: CANCEL_RED },
                            ]}
                        >
                            Annuler
                        </Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.slideIndicator,
                            styles.lockIndicator,
                            {
                                borderColor: LOCK_GREEN,
                                backgroundColor: theme.background + "F0",
                                opacity: lockOpacityAnim,
                            },
                        ]}
                    >
                        <Ionicons
                            name="lock-closed"
                            size={32}
                            color={LOCK_GREEN}
                        />
                        <Text
                            style={[
                                styles.indicatorText,
                                { color: LOCK_GREEN },
                            ]}
                        >
                            Verrouiller
                        </Text>
                    </Animated.View>
                </>
            )}

            <View style={styles.normalContainer}>
                <View
                    style={[
                        styles.inputWrapper,
                        {
                            backgroundColor: theme.isDark
                                ? theme.raw.black[400]
                                : theme.raw.white[600],
                            borderColor: isRecording
                                ? CANCEL_RED + "60"
                                : theme.border,
                        },
                    ]}
                >
                    {isRecording ? (
                        <View style={styles.recordingIndicator}>
                            <Animated.View
                                style={[
                                    styles.recordingDot,
                                    { transform: [{ scale: pulseAnim }] },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.timerText,
                                    { color: CANCEL_RED },
                                ]}
                            >
                                {formatTime(recordingDuration)}
                            </Text>
                            {isLocked && (
                                <View
                                    style={[
                                        styles.lockBadge,
                                        { backgroundColor: LOCK_GREEN },
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
                                ? CANCEL_RED + "80"
                                : theme.isDark
                                  ? theme.raw.white[700]
                                  : theme.raw.black[200]
                        }
                        multiline
                        maxLength={1000}
                        editable={!loading && !isRecording}
                    />
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
                                            backgroundColor:
                                                MEDICAL_BLUE + "15",
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name="image"
                                        size={20}
                                        color={MEDICAL_BLUE}
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

                <View style={styles.buttonsContainer}>
                    {isRecording && isLocked && (
                        <TouchableOpacity
                            onPress={handleManualCancel}
                            style={styles.cancelButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="close-circle"
                                size={32}
                                color={CANCEL_RED}
                            />
                        </TouchableOpacity>
                    )}

                    {isRecording && isLocked && (
                        <TouchableOpacity
                            onPress={handleManualSend}
                            style={[
                                styles.sendButton,
                                { backgroundColor: MEDICAL_BLUE },
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
                                    backgroundColor: MEDICAL_BLUE,
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
                        medicalBlue={MEDICAL_BLUE}
                        loading={loading}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        isRecording={isRecording}
                        visible={
                            (!value.trim() && !isRecording) ||
                            (isRecording && !isLocked)
                        }
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

    recordingIndicator: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingLeft: 12,
        paddingRight: 4,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#EF4444",
    },
    timerText: {
        fontSize: 13,
        fontWeight: "700",
        fontVariant: ["tabular-nums"],
    },
    lockBadge: {
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 2,
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
