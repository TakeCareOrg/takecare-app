import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { usePressAnimation } from "@app/hooks/use-press-animation";
import { openHealthConnectPermissions } from "@app/services/health/open-health-connect";
import { useUiSessionStore } from "@app/stores/ui-session";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HealthOnboardingModal({ visible }: { visible: boolean }) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();
    const dismissHealthOnboarding = useUiSessionStore(
        (s) => s.dismissHealthOnboarding,
    );

    const openPress = usePressAnimation({ haptic: "medium" });
    const laterPress = usePressAnimation({ haptic: "light" });

    const handleOpen = async () => {
        await openHealthConnectPermissions();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={dismissHealthOnboarding}
        >
            <View style={styles.backdrop}>
                <View style={[styles.card, { backgroundColor: colors.box }]}>
                    <View
                        style={[
                            styles.iconWrap,
                            {
                                backgroundColor: colors.isDark
                                    ? "rgba(120, 137, 210, 0.20)"
                                    : "rgba(120, 137, 210, 0.14)",
                            },
                        ]}
                    >
                        <Ionicons
                            name="medkit-outline"
                            size={32}
                            color={colors.raw.primary[500]}
                        />
                    </View>
                    <Text
                        fontSize={18}
                        weight="800"
                        color={colors.text}
                        style={styles.title}
                    >
                        {t("HOME_PAGE.HEALTH_ONBOARDING.TITLE")}
                    </Text>
                    <Text
                        fontSize={13}
                        weight="500"
                        color={colors.secondary}
                        style={styles.body}
                    >
                        {t("HOME_PAGE.HEALTH_ONBOARDING.BODY")}
                    </Text>

                    <AnimatedPressable
                        onPress={handleOpen}
                        onPressIn={openPress.onPressIn}
                        onPressOut={openPress.onPressOut}
                        style={[
                            styles.primaryCta,
                            { backgroundColor: colors.raw.primary[500] },
                            openPress.animatedStyle,
                        ]}
                    >
                        <Text
                            fontSize={14}
                            weight="800"
                            color={colors.white}
                            style={styles.ctaText}
                        >
                            {t("HOME_PAGE.HEALTH_ONBOARDING.CTA_OPEN")}
                        </Text>
                    </AnimatedPressable>

                    <AnimatedPressable
                        onPress={dismissHealthOnboarding}
                        onPressIn={laterPress.onPressIn}
                        onPressOut={laterPress.onPressOut}
                        style={[styles.secondaryCta, laterPress.animatedStyle]}
                    >
                        <Text
                            fontSize={13}
                            weight="700"
                            color={colors.secondary}
                        >
                            {t("HOME_PAGE.HEALTH_ONBOARDING.CTA_DISMISS")}
                        </Text>
                    </AnimatedPressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    card: {
        width: "100%",
        maxWidth: 360,
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        rowGap: 12,
    },
    iconWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    title: {
        textAlign: "center",
    },
    body: {
        textAlign: "center",
        lineHeight: 19,
    },
    primaryCta: {
        marginTop: 12,
        width: "100%",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    ctaText: {
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    secondaryCta: {
        marginTop: 4,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
    },
});
