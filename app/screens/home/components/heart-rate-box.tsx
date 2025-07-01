import { useEffect, useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";

import { HearthPulse } from "@app/assets/icons/heart-pulse";
import { Box } from "@app/components/ui/box";
import { Chip } from "@app/components/ui/chip";
import { Text } from "@app/components/ui/text";
import { HeartRateValue } from "@app/types/health-data-types";
import { useTranslation } from "react-i18next";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

// Adjust the path as necessary

export function HeartRateBox({ value }: { value: HeartRateValue | null }) {
    const { t } = useTranslation("full_trads");

    const color = useMemo(() => {
        if (!value) return "grey"; // Default color if no value
        if (value.value < 60) return "blue"; // Low heart rate
        if (value.value >= 60 && value.value <= 100) return "green"; // Normal heart rate
        if (value.value > 100 && value.value <= 120) return "orange"; // Elevated heart rate
        return "red"; // High heart rate
    }, [value]);

    const ChipText = useMemo(() => {
        if (!value) return t("COMMON.NO_DATA");
        if (value.value < 60) return t("HOME_PAGE.HEART_RATE.LOW");
        if (value.value >= 60 && value.value <= 100)
            return t("HOME_PAGE.HEART_RATE.NORMAL");
        if (value.value > 100 && value.value <= 120)
            return t("HOME_PAGE.HEART_RATE.HIGH");
        return t("HOME_PAGE.HEART_RATE.VERY_HIGH");
    }, [value]);

    const heartRateAnimation = useSharedValue(0.9); // Initial scale value
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withRepeat(
                        withTiming(heartRateAnimation.value, {
                            duration: 1000,
                            easing: Easing.inOut(Easing.ease),
                        }),
                        -1, // Repeat indefinitely
                        true, // Reverse the animation on each repeat
                    ),
                },
            ],
        };
    });

    // Update the animation value after render using useEffect
    useEffect(() => {
        heartRateAnimation.value = 1;
    }, [heartRateAnimation]);

    return (
        <Box
            id="HEART_RATE_BOX"
            title="Heart Rate"
            headerContent={
                value &&
                value.value && (
                    <Chip
                        text={ChipText}
                        color={color}
                        style={{
                            fontSize: 14,
                            fontFamily: "Poppins-Medium",
                        }}
                    />
                )
            }
            headerStyle={{ marginBottom: 16 }}
        >
            {value ? (
                <View style={styles.heartRateWrapper}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <Text fontSize={48} font="Poppins-SemiBold">
                            {value.value}
                        </Text>
                        <Text
                            fontSize={20}
                            font="Poppins-Medium"
                            style={styles.heartRateUnit}
                        >
                            {t("HOME_PAGE.HEART_RATE.UNIT")}
                        </Text>
                    </View>

                    <Animated.View style={[styles.heartSVG, animatedStyle]}>
                        <HearthPulse />
                    </Animated.View>
                </View>
            ) : (
                <></>
            )}
        </Box>
    );
}

const styles = StyleSheet.create({
    heartRateWrapper: {
        flexDirection: "column",
    },
    heartRateText: {
        fontSize: 24,
        fontFamily: "Poppins-Medium",
    },
    heartRateUnit: {
        marginTop: 14,
    },
    heartSVG: {
        alignSelf: "flex-end",
    },
});
