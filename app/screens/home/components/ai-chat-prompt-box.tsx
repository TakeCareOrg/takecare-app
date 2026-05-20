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
import { GradientBox } from "@components/ui/gradient-box";
import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";

export function AIChatPromptBox({
    width,
    height,
    style,
}: {
    width?: DimensionValue;
    height?: DimensionValue;
    style?: StyleProp<ViewStyle>;
}) {
    const { t } = useTranslation("full_trads");
    const navigation = useNavigation();
    const colors = useColorTheme();
    const dismissAiChatPrompt = useUiSessionStore((s) => s.dismissAiChatPrompt);

    const gradient: [string, string] = [
        colors.raw.primary[500],
        colors.raw.blue[400],
    ];

    const handleDismiss = () => {
        Haptics.selectionAsync();
        dismissAiChatPrompt();
    };

    return (
        <GradientBox
            width={width}
            height={typeof height === "number" ? height : undefined}
            style={style}
            gradient={gradient}
            onPress={() => {
                navigation.navigate("Chat");
            }}
        >
            <View style={styles.content}>
                <View style={styles.avatar}>
                    <Text fontSize={28} style={styles.avatarEmoji}>
                        💬
                    </Text>
                </View>
                <View style={styles.textBlock}>
                    <Text
                        fontSize={15}
                        weight="700"
                        color={colors.white}
                        numberOfLines={1}
                    >
                        {t("HOME_PAGE.AI_CHAT.GREETING")}
                    </Text>
                    <Text
                        fontSize={11}
                        weight="500"
                        color="rgba(255, 255, 255, 0.82)"
                        numberOfLines={2}
                        style={styles.subtext}
                    >
                        {t("HOME_PAGE.AI_CHAT.SUBTEXT")}
                    </Text>
                </View>
                <View style={styles.cta}>
                    <Text
                        fontSize={12}
                        weight="800"
                        color={colors.white}
                        style={styles.ctaText}
                    >
                        {t("HOME_PAGE.AI_CHAT.CTA")}
                    </Text>
                    <Text fontSize={14} color={colors.white} weight="800">
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
                    color={colors.white}
                    style={styles.closeText}
                >
                    ✕
                </Text>
            </Pressable>
        </GradientBox>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 12,
        paddingRight: 24,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.20)",
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
        backgroundColor: "rgba(255, 255, 255, 0.20)",
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
