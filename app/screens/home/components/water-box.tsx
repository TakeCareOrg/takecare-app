import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    DimensionValue,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { LinearGradient } from "expo-linear-gradient";

import { HEALTH_TARGETS } from "@app/constants/health-targets";
import { Text } from "@components/ui/text";
import { usePressAnimation } from "@hooks/use-press-animation";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const INCREMENT_ML = 250;
const WATER_BG_TOP = "#0F1F3A";
const WATER_BG_BOTTOM = "#1A3358";
const WAVE_BACK = "#3FBCEE";
const WAVE_FRONT = "#19D5FB";
const BUTTON_BG = "rgba(0, 0, 0, 0.55)";

const WAVE_AMPLITUDE = 5;
const WAVE_FREQUENCY = 2.5;
const WAVE_HEIGHT_OFFSET = 10;

function buildWavePath(phase: number): string {
    "worklet";
    const segments: string[] = [];
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * 100;
        const y =
            WAVE_HEIGHT_OFFSET +
            WAVE_AMPLITUDE *
                Math.sin((x / 100) * Math.PI * WAVE_FREQUENCY + phase);
        segments.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
    }
    segments.push("L100,100", "L0,100", "Z");
    return segments.join(" ");
}

export function WaterBox({
    width,
    height,
    style,
}: {
    width?: DimensionValue;
    height?: DimensionValue;
    style?: StyleProp<ViewStyle>;
}) {
    const { t } = useTranslation("full_trads");
    const targetMl = HEALTH_TARGETS.HYDRATION_ML;
    const [intakeMl, setIntakeMl] = useState(0);
    const {
        animatedStyle: pressStyle,
        onPressIn,
        onPressOut,
    } = usePressAnimation({ haptic: "medium" });

    const ratio = Math.min(intakeMl / targetMl, 1);
    const progress = useSharedValue(0);
    const phaseBack = useSharedValue(0);
    const phaseFront = useSharedValue(0);

    useEffect(() => {
        progress.value = withSpring(ratio, {
            damping: 12,
            stiffness: 110,
            mass: 1.2,
        });
    }, [ratio, progress]);

    useEffect(() => {
        phaseBack.value = withRepeat(
            withTiming(Math.PI * 2, {
                duration: 8000,
                easing: Easing.linear,
            }),
            -1,
            false,
        );
        phaseFront.value = withRepeat(
            withTiming(Math.PI * 2, {
                duration: 6000,
                easing: Easing.linear,
            }),
            -1,
            false,
        );
    }, [phaseBack, phaseFront]);

    const waterFillStyle = useAnimatedStyle(() => ({
        height: `${progress.value * 100}%`,
    }));

    const wavePathBackProps = useAnimatedProps(() => ({
        d: buildWavePath(phaseBack.value),
    }));

    const wavePathFrontProps = useAnimatedProps(() => ({
        d: buildWavePath(phaseFront.value + Math.PI / 2),
    }));

    const resolvedHeight = typeof height === "number" ? height : undefined;

    return (
        <View style={[styles.card, { width, height: resolvedHeight }, style]}>
            <LinearGradient
                colors={[WATER_BG_TOP, WATER_BG_BOTTOM]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <Animated.View
                pointerEvents="none"
                style={[styles.waterFill, waterFillStyle]}
            >
                <Svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <AnimatedPath
                        animatedProps={wavePathBackProps}
                        fill={WAVE_BACK}
                        opacity={0.55}
                    />
                    <AnimatedPath
                        animatedProps={wavePathFrontProps}
                        fill={WAVE_FRONT}
                    />
                </Svg>
            </Animated.View>

            <View style={styles.textBlock}>
                <Text fontSize={20} weight="800" color="#FFFFFF">
                    {t("HOME_PAGE.WATER.TITLE")}
                </Text>
                <View style={styles.valueRow}>
                    <Text fontSize={36} weight="900" color="#FFFFFF">
                        {intakeMl}
                    </Text>
                    <Text
                        fontSize={20}
                        weight="800"
                        color="#FFFFFF"
                        style={styles.valueUnit}
                    >
                        {t("HOME_PAGE.WATER.UNIT")}
                    </Text>
                </View>
                <Text
                    fontSize={14}
                    weight="700"
                    color="rgba(255, 255, 255, 0.78)"
                    style={styles.target}
                >
                    /{targetMl}
                </Text>
            </View>

            <AnimatedPressable
                onPress={() =>
                    setIntakeMl((current) =>
                        Math.min(current + INCREMENT_ML, targetMl),
                    )
                }
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[
                    styles.addButton,
                    { backgroundColor: BUTTON_BG },
                    pressStyle,
                ]}
            >
                <Text
                    fontSize={13}
                    weight="800"
                    color="#FFFFFF"
                    style={styles.addText}
                >
                    {t("HOME_PAGE.WATER.ADD")}
                </Text>
            </AnimatedPressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 5,
    },
    waterFill: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    textBlock: {
        position: "absolute",
        top: 16,
        left: 18,
        right: 18,
    },
    valueRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 4,
        marginTop: 14,
    },
    valueUnit: {
        marginBottom: 4,
    },
    target: {
        marginTop: 2,
        marginLeft: 4,
    },
    addButton: {
        position: "absolute",
        left: 18,
        right: 18,
        bottom: 16,
        paddingVertical: 12,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    addText: {
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
});
