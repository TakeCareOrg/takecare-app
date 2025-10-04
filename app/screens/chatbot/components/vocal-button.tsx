import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { useColorTheme } from "@hooks/use-color-theme";

const CIRCLE_RADIUS = 20;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface VocalButtonProps {
    isRecording: boolean;
    recordingDuration: number;
    maxDuration: number;
    onPressIn: () => void;
    onPressOut: () => void;
    disabled?: boolean;
}

export const VocalButton: React.FC<VocalButtonProps> = ({
    isRecording,
    recordingDuration,
    maxDuration,
    onPressIn,
    onPressOut,
    disabled = false,
}) => {
    const themeColors = useColorTheme();

    const pulseAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const waveAnim1 = useRef(new Animated.Value(0)).current;
    const waveAnim2 = useRef(new Animated.Value(0)).current;
    const waveAnim3 = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const recordingTouchId = useRef<number | null>(null);

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 0,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();

            Animated.loop(
                Animated.timing(waveAnim1, {
                    toValue: 1,
                    duration: 2500,
                    useNativeDriver: true,
                }),
            ).start();

            Animated.loop(
                Animated.timing(waveAnim2, {
                    toValue: 1,
                    duration: 2500,
                    delay: 800,
                    useNativeDriver: true,
                }),
            ).start();

            Animated.loop(
                Animated.timing(waveAnim3, {
                    toValue: 1,
                    duration: 2500,
                    delay: 1600,
                    useNativeDriver: true,
                }),
            ).start();
        } else {
            pulseAnim.setValue(0);
            progressAnim.setValue(0);
            glowAnim.setValue(0);
            waveAnim1.setValue(0);
            waveAnim2.setValue(0);
            waveAnim3.setValue(0);
            recordingTouchId.current = null;
        }
    }, [isRecording]);

    useEffect(() => {
        if (isRecording) {
            const progress = Math.min(recordingDuration / maxDuration, 1);
            Animated.timing(progressAnim, {
                toValue: progress,
                duration: 100,
                useNativeDriver: false,
            }).start();
        }
    }, [recordingDuration, isRecording, maxDuration]);
    const pulseScale = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.08],
    });

    const pulseOpacity = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 0.6],
    });

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.6],
    });

    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCLE_CIRCUMFERENCE, 0],
    });

    const createWaveStyle = (anim: Animated.Value) => ({
        transform: [
            {
                scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 2.5],
                }),
            },
        ],
        opacity: anim.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: [0.6, 0.3, 0],
        }),
    });

    const handleTouchStart = (e: any) => {
        if (disabled || isRecording) return;

        const touch = e.nativeEvent.touches[0];
        if (touch) {
            recordingTouchId.current = touch.identifier;

            Animated.spring(scaleAnim, {
                toValue: 0.94,
                useNativeDriver: true,
                tension: 300,
                friction: 10,
            }).start();

            onPressIn();
        }
    };

    const handleTouchEnd = (e: any) => {
        const changedTouch = e.nativeEvent.changedTouches[0];

        if (
            changedTouch &&
            changedTouch.identifier === recordingTouchId.current
        ) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 300,
                friction: 10,
            }).start();

            onPressOut();
            recordingTouchId.current = null;
        }
    };

    const medicalBlue = themeColors.isDark ? "#60A5FA" : "#3B82F6";
    const medicalRed = "#EF4444";

    return (
        <View style={styles.container}>
            {isRecording && (
                <>
                    <Animated.View
                        style={[
                            styles.wave,
                            createWaveStyle(waveAnim1),
                            {
                                backgroundColor: medicalRed + "20",
                                borderColor: medicalRed + "40",
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.wave,
                            createWaveStyle(waveAnim2),
                            {
                                backgroundColor: medicalRed + "15",
                                borderColor: medicalRed + "30",
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.wave,
                            createWaveStyle(waveAnim3),
                            {
                                backgroundColor: medicalRed + "10",
                                borderColor: medicalRed + "20",
                            },
                        ]}
                    />
                </>
            )}

            {isRecording && (
                <Animated.View
                    style={[
                        styles.glow,
                        {
                            opacity: glowOpacity,
                            backgroundColor: medicalRed,
                            shadowColor: medicalRed,
                        },
                    ]}
                />
            )}
            <View
                style={styles.touchArea}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <Animated.View
                    style={[
                        styles.button,
                        {
                            transform: [
                                { scale: isRecording ? pulseScale : scaleAnim },
                            ],
                            backgroundColor: isRecording
                                ? themeColors.isDark
                                    ? "#1F2937"
                                    : "#F9FAFB"
                                : themeColors.isDark
                                  ? "#374151"
                                  : "#F3F4F6",
                            borderColor: isRecording
                                ? medicalRed + "40"
                                : medicalBlue + "30",
                            borderWidth: isRecording ? 2 : 1.5,
                        },
                    ]}
                >
                    <Animated.View
                        style={{
                            opacity: pulseOpacity,
                        }}
                    >
                        {!isRecording && (
                            <Ionicons
                                name="mic-outline"
                                size={22}
                                color={medicalBlue}
                            />
                        )}

                        {isRecording && (
                            <View style={styles.waveformContainer}>
                                <Ionicons
                                    name="pulse"
                                    size={24}
                                    color={medicalRed}
                                />
                            </View>
                        )}
                    </Animated.View>

                    {isRecording && (
                        <View style={styles.progressRing}>
                            <Svg width={52} height={52}>
                                <Defs>
                                    <RadialGradient
                                        id="grad"
                                        cx="50%"
                                        cy="50%"
                                        r="50%"
                                    >
                                        <Stop
                                            offset="0%"
                                            stopColor={medicalRed}
                                            stopOpacity="0.8"
                                        />
                                        <Stop
                                            offset="100%"
                                            stopColor={medicalRed}
                                            stopOpacity="0.4"
                                        />
                                    </RadialGradient>
                                </Defs>
                                <Circle
                                    cx={26}
                                    cy={26}
                                    r={CIRCLE_RADIUS}
                                    stroke={medicalRed + "20"}
                                    strokeWidth={2}
                                    fill="none"
                                />
                                <AnimatedCircle
                                    cx={26}
                                    cy={26}
                                    r={CIRCLE_RADIUS}
                                    stroke="url(#grad)"
                                    strokeWidth={3}
                                    fill="none"
                                    strokeDasharray={CIRCLE_CIRCUMFERENCE}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    transform={`rotate(-90 26 26)`}
                                />
                            </Svg>
                        </View>
                    )}
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    touchArea: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    wave: {
        position: "absolute",
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
    },
    glow: {
        position: "absolute",
        width: 44,
        height: 44,
        borderRadius: 22,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 8,
    },
    progressRing: {
        position: "absolute",
        width: 52,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
    },
    waveformContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});
