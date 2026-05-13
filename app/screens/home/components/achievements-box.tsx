import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    DimensionValue,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { useGamificationStore } from "@app/stores/gamification";
import { Text } from "@components/ui/text";
import { padding } from "@utils/styles";

import { AchievementsModal } from "./achievements-box-modal";

// MOCK: décommenter pour tester sans backend
// import { Achievement } from "@app/types/gamification-types";
// const MOCK_ACHIEVEMENTS: Achievement[] = [
//     {
//         achievementId: "first_steps",
//         pointsEarned: 50,
//         completedAt: "2025-12-01T10:00:00Z",
//         metadata: {
//             title: "Premiers pas",
//             icon: "👟",
//             description: "Marcher 1 000 pas en une journée",
//         },
//     },
//     {
//         achievementId: "marathon_walker",
//         pointsEarned: 200,
//         completedAt: "2025-12-10T10:00:00Z",
//         metadata: {
//             title: "Marcheur marathon",
//             icon: "🏅",
//             description: "Atteindre 42 000 pas cumulés",
//         },
//     },
//     {
//         achievementId: "week_warrior",
//         pointsEarned: 150,
//         completedAt: "2025-12-05T10:00:00Z",
//         metadata: {
//             title: "Guerrier de la semaine",
//             icon: "🔥",
//             description: "7 jours d'activité consécutifs",
//         },
//     },
// ];

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
    const resolvedHeight = height ?? 175;

    if (!lastAchievement) {
        return (
            <LinearGradient
                colors={colors.achievement}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.container,
                    {
                        width: resolvedWidth,
                        height: resolvedHeight,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                    style,
                ]}
            >
                <Text
                    fontSize={16}
                    weight="700"
                    color={colors.white}
                    style={{ textAlign: "center", lineHeight: 20 }}
                >
                    {t("HOME_PAGE.GAMIFICATION.NO_ACHIEVEMENT")}
                </Text>
            </LinearGradient>
        );
    }

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModalVisible(true)}
                style={style}
            >
                <LinearGradient
                    colors={colors.achievement}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.container,
                        {
                            width: resolvedWidth,
                            height: resolvedHeight,
                        },
                    ]}
                >
                    <View style={styles.topRow}>
                        <Text fontSize={36} color={colors.white}>
                            {lastAchievement.metadata.icon
                                ? lastAchievement.metadata.icon
                                : "🏆"}
                        </Text>
                        <View style={styles.badgesColumn}>
                            <View style={styles.badge}>
                                <Text
                                    fontSize={11}
                                    color={colors.white}
                                    weight="700"
                                    style={{ opacity: 0.8 }}
                                >
                                    {t(
                                        "HOME_PAGE.GAMIFICATION.ACHIEVEMENTS_COUNT",
                                        { count: achievements.length },
                                    )}
                                </Text>
                            </View>
                            <View style={styles.pointsBadge}>
                                <Text
                                    fontSize={14}
                                    color={colors.white}
                                    weight="800"
                                    style={{ opacity: 0.7 }}
                                >
                                    +{lastAchievement.pointsEarned}{" "}
                                    {t("HOME_PAGE.GAMIFICATION.PTS")}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.bottomSection}>
                        <Text
                            fontSize={14}
                            color={colors.white}
                            weight="700"
                            numberOfLines={1}
                            style={styles.title}
                        >
                            {lastAchievement.metadata.title}
                        </Text>
                        {lastAchievement.metadata.description && (
                            <Text
                                fontSize={11}
                                color={colors.white}
                                weight="500"
                                numberOfLines={2}
                                style={{ opacity: 0.65 }}
                            >
                                {lastAchievement.metadata.description}
                            </Text>
                        )}
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            <AchievementsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                achievements={achievements}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        ...padding(10, 15),
        height: 175,
        minHeight: 160,
        flex: 0,
        zIndex: -1,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    badgesColumn: {
        alignItems: "flex-end",
        gap: 2,
    },
    badge: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    pointsBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    bottomSection: {
        flex: 1,
        justifyContent: "flex-end",
    },
    title: {
        marginBottom: 2,
    },
    // Modal
    modalWrapper: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "80%",
        paddingBottom: 30,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#CCC",
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 12,
    },
    modalBanner: {
        marginHorizontal: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    bannerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    bannerPoints: {
        alignItems: "flex-end",
    },
    modalList: {
        paddingHorizontal: 16,
        gap: 8,
        paddingBottom: 12,
    },
    closeButton: {
        marginHorizontal: 16,
        marginTop: 4,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
    // Achievement items
    achievementItem: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        padding: 14,
        gap: 12,
        borderWidth: 1,
    },
    achievementIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    achievementInfo: {
        flex: 1,
        gap: 2,
    },
    achievementPoints: {
        alignItems: "flex-end",
    },
});
