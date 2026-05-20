import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    DimensionValue,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { useGamificationStore } from "@app/stores/gamification";
import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";

import { AchievementsModal } from "./achievements-box-modal";

export function AchievementsBox({
    width,
    height,
    style,
}: {
    width?: DimensionValue;
    height?: DimensionValue;
    style?: StyleProp<ViewStyle>;
} = {}) {
    const { t } = useTranslation("full_trads");
    const windowWidth = Dimensions.get("window").width;
    const colors = useColorTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const { cache } = useGamificationStore();

    const achievements = cache?.achievements ?? [];
    const lastAchievement = achievements[achievements.length - 1];
    const resolvedWidth = width ?? windowWidth / 2 - 25;
    const resolvedHeight = typeof height === "number" ? height : 200;

    const accent = colors.isDark ? colors.raw.blue[300] : colors.raw.blue[500];
    const accentSoft = colors.isDark
        ? "rgba(12, 28, 176, 0.22)"
        : "rgba(12, 28, 176, 0.10)";

    if (!lastAchievement) {
        return (
            <Box
                title={t("HOME_PAGE.GAMIFICATION.ACHIEVEMENTS_TITLE")}
                width={resolvedWidth}
                height={resolvedHeight}
                style={style}
            >
                <View style={styles.emptyWrapper}>
                    <Text
                        fontSize={14}
                        weight="700"
                        color={colors.secondary}
                        style={{ textAlign: "center" }}
                    >
                        {t("HOME_PAGE.GAMIFICATION.NO_ACHIEVEMENT")}
                    </Text>
                </View>
            </Box>
        );
    }

    return (
        <>
            <Box
                title={t("HOME_PAGE.GAMIFICATION.ACHIEVEMENTS_TITLE")}
                width={resolvedWidth}
                height={resolvedHeight}
                headerStyle={{ marginBottom: 10 }}
                onPress={() => setModalVisible(true)}
                style={style}
            >
                <View style={styles.topRow}>
                    <View
                        style={[
                            styles.iconBadge,
                            {
                                backgroundColor: accentSoft,
                                borderColor: accent,
                            },
                        ]}
                    >
                        <Text fontSize={22}>
                            {lastAchievement.metadata.icon
                                ? lastAchievement.metadata.icon
                                : "🏆"}
                        </Text>
                    </View>
                    <View style={styles.badgesColumn}>
                        <View
                            style={[
                                styles.countBadge,
                                { backgroundColor: accentSoft },
                            ]}
                        >
                            <Text
                                fontSize={10}
                                color={accent}
                                weight="800"
                                style={styles.countText}
                            >
                                {t(
                                    "HOME_PAGE.GAMIFICATION.ACHIEVEMENTS_COUNT",
                                    { count: achievements.length },
                                )}
                            </Text>
                        </View>
                        <View style={styles.pointsRow}>
                            <Text
                                fontSize={16}
                                color={colors.text}
                                weight="900"
                            >
                                +{lastAchievement.pointsEarned}
                            </Text>
                            <Text
                                fontSize={9}
                                color={colors.secondary}
                                weight="700"
                                style={styles.unitLabel}
                            >
                                {t("HOME_PAGE.GAMIFICATION.PTS")}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <Text
                        fontSize={14}
                        color={colors.text}
                        weight="700"
                        numberOfLines={1}
                        style={styles.title}
                    >
                        {lastAchievement.metadata.title}
                    </Text>
                    {lastAchievement.metadata.description && (
                        <Text
                            fontSize={11}
                            color={colors.secondary}
                            weight="500"
                            numberOfLines={2}
                        >
                            {lastAchievement.metadata.description}
                        </Text>
                    )}
                </View>
            </Box>

            <AchievementsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                achievements={achievements}
            />
        </>
    );
}

const styles = StyleSheet.create({
    emptyWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    iconBadge: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
    },
    badgesColumn: {
        alignItems: "flex-end",
        gap: 6,
    },
    countBadge: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    countText: {
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    pointsRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 3,
    },
    unitLabel: {
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    bottomSection: {
        flex: 1,
        justifyContent: "flex-end",
    },
    title: {
        marginBottom: 2,
    },
});
