import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
    DimensionValue,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

import * as Haptics from "expo-haptics";

import { useUiSessionStore } from "@app/stores/ui-session";
import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";

/**
 * Compact greeting banner rendered ABOVE the home grid (no longer a
 * grid widget) so its height matches the content + Box padding only.
 * Theme-adaptive sombre background via the regular `Box`; all text /
 * accents read off `colors.text` / `colors.secondary` / `colors.raw.blue`.
 */
export function AIChatPromptBox({
    width,
    style,
}: {
    width?: DimensionValue;
    style?: StyleProp<ViewStyle>;
}) {
    const { t } = useTranslation("full_trads");
    const navigation = useNavigation();
    const colors = useColorTheme();
    const dismissAiChatPrompt = useUiSessionStore((s) => s.dismissAiChatPrompt);

    const accent = colors.isDark ? colors.raw.blue[300] : colors.raw.blue[500];
    const accentSoft = colors.isDark
        ? "rgba(60, 73, 192, 0.22)"
        : "rgba(60, 73, 192, 0.10)";

    const handleDismiss = () => {
        Haptics.selectionAsync();
        dismissAiChatPrompt();
    };

    return (
        <Box
            width={width ?? "100%"}
            style={[styles.fullWidth, style]}
            onPress={() => {
                navigation.navigate("Chat");
            }}
        >
            <View style={styles.content}>
                <View style={[styles.avatar, { backgroundColor: accentSoft }]}>
                    <Text fontSize={28} style={styles.avatarEmoji}>
                        💬
                    </Text>
                </View>
                <View style={styles.textBlock}>
                    <Text
                        fontSize={15}
                        weight="700"
                        color={colors.text}
                        numberOfLines={1}
                    >
                        {t("HOME_PAGE.AI_CHAT.GREETING")}
                    </Text>
                    <Text
                        fontSize={11}
                        weight="500"
                        color={colors.secondary}
                        numberOfLines={2}
                        style={styles.subtext}
                    >
                        {t("HOME_PAGE.AI_CHAT.SUBTEXT")}
                    </Text>
                </View>
                <View style={[styles.cta, { backgroundColor: accentSoft }]}>
                    <Text
                        fontSize={12}
                        weight="800"
                        color={accent}
                        style={styles.ctaText}
                    >
                        {t("HOME_PAGE.AI_CHAT.CTA")}
                    </Text>
                    <Text fontSize={14} color={accent} weight="800">
                        →
                    </Text>
                </View>
            </View>
            <Pressable
                onPress={handleDismiss}
                hitSlop={12}
                style={styles.closeButton}
            >
                <Text
                    fontSize={14}
                    weight="900"
                    color={colors.secondary}
                    style={styles.closeText}
                >
                    ✕
                </Text>
            </Pressable>
        </Box>
    );
}

const styles = StyleSheet.create({
    fullWidth: {
        alignSelf: "stretch",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 12,
        paddingRight: 24,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarEmoji: {
        lineHeight: 32,
    },
    textBlock: {
        flex: 1,
        rowGap: 2,
    },
    subtext: {
        lineHeight: 15,
    },
    cta: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
    },
    ctaText: {
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    closeButton: {
        position: "absolute",
        top: 6,
        right: 8,
        width: 22,
        height: 22,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    closeText: {
        lineHeight: 16,
    },
});
