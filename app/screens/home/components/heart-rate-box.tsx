import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    DimensionValue,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

import { HearthPulse } from "@app/assets/icons/heart-pulse";
import { Chip } from "@app/components/ui/chip";
import { Text } from "@app/components/ui/text";
import { HeartRateValue } from "@app/types/health-data-types";
import { Box } from "@components/ui/box";

// Adjust the path as necessary
const screenWidth = Dimensions.get("window").width;

export function HeartRateBox({
    value,
    width,
    style,
}: {
    value: HeartRateValue | null;
    width?: DimensionValue;
    style?: StyleProp<ViewStyle>;
}) {
    const { t } = useTranslation("full_trads");
    const navigation = useNavigation();

    const color = useMemo(() => {
        if (!value) return "black"; // Default color if no value
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
    }, [t, value]);

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
                        }}
                    />
                )
            }
            width={width || screenWidth / 2 - 25}
            headerStyle={{ marginBottom: 16, columnGap: 1 }}
            aspectRatio={true}
            style={style}
            onPress={() => {
                navigation.navigate("Heart");
            }}
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
                        <Text fontSize={48} weight="700">
                            {value.value}
                        </Text>
                        <Text
                            fontSize={20}
                            weight="600"
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
                <View style={styles.noData}>
                    <Text fontSize={14} weight="600">
                        {t("COMMON.NO_DATA")}
                    </Text>
                </View>
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
    },
    heartRateUnit: {
        marginTop: 14,
    },
    heartSVG: {
        alignSelf: "flex-end",
    },
    noData: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
