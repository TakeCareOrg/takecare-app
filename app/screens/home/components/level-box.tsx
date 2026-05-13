import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    DimensionValue,
    StyleProp,
    StyleSheet,
    useWindowDimensions,
    View,
    ViewStyle,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { useGamificationStore } from "@app/stores/gamification";
import { Text } from "@components/ui/text";
import { padding } from "@utils/styles";

// MOCK: décommenter pour tester sans backend
// const MOCK_LEVEL_INFO = {
//     level: 7,
//     title: "Explorateur",
//     currentPoints: 1450,
//     pointsForCurrentLevel: 1200,
//     pointsForNextLevel: 1800,
//     progressToNextLevel: 42,
// };
// const MOCK_TOTAL_POINTS = 1450;

export function LevelBox({
    width,
    height,
    style,
}: {
    width?: DimensionValue;
    height?: DimensionValue;
    style?: StyleProp<ViewStyle>;
} = {}) {
    const { t } = useTranslation("full_trads");
    const windowWidth = useWindowDimensions().width;
    const colors = useColorTheme();
    const { cache, fetchProgress } = useGamificationStore();

    useEffect(() => {
        fetchProgress();
    }, [fetchProgress]);

    const levelInfo = cache?.levelInfo;
    const totalPoints = cache?.totalPoints ?? 0;
    const resolvedWidth = width ?? windowWidth / 2 - 25;
    const resolvedHeight = height ?? 175;

    if (!levelInfo) {
        return (
            <LinearGradient
                colors={colors.level}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.container,
                    {
                        width: resolvedWidth,
                        height: resolvedHeight,
                        shadowColor: colors.black,
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
                    {t("HOME_PAGE.GAMIFICATION.NO_LEVEL")}
                </Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={colors.level}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                styles.container,
                {
                    width: resolvedWidth,
                    height: resolvedHeight,
                    shadowColor: colors.black,
                },
                style,
            ]}
        >
            <View style={styles.topRow}>
                <View style={styles.levelCircle}>
                    <Text fontSize={22} weight="800" color={colors.white}>
                        {levelInfo.level}
                    </Text>
                </View>
                <View style={styles.pointsBadge}>
                    <Text fontSize={13} weight="700" color={colors.white}>
                        {totalPoints}
                    </Text>
                    <Text
                        fontSize={9}
                        weight="600"
                        color={colors.white}
                        style={{
                            opacity: 0.65,
                        }}
                    >
                        {t("HOME_PAGE.GAMIFICATION.PTS")}
                    </Text>
                </View>
            </View>

            <View style={styles.bottomSection}>
                <Text
                    fontSize={15}
                    color={colors.white}
                    weight="700"
                    numberOfLines={1}
                    style={styles.title}
                >
                    {levelInfo.title}
                </Text>

                <View style={styles.progressRow}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${levelInfo.progressToNextLevel}%`,
                                    backgroundColor: colors.white,
                                    shadowColor: colors.white,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                },
                            ]}
                        />
                    </View>
                    <Text
                        fontSize={10}
                        color={colors.white}
                        weight="600"
                        style={{ opacity: 0.7 }}
                    >
                        {levelInfo.progressToNextLevel}%
                    </Text>
                </View>

                <Text
                    fontSize={10}
                    color={colors.white}
                    weight="500"
                    style={{ opacity: 0.6 }}
                >
                    {t("HOME_PAGE.GAMIFICATION.NEXT_LEVEL", {
                        level: levelInfo.level + 1,
                        points: levelInfo.pointsForNextLevel,
                    })}
                </Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        ...padding(12, 15),
        height: 175,
        minHeight: 160,
        flex: 0,
        zIndex: -1,
        overflow: "hidden",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    levelCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "rgba(255,255,255,0.15)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.25)",
    },
    pointsBadge: {
        alignItems: "flex-end",
    },
    bottomSection: {
        flex: 1,
        justifyContent: "flex-end",
    },
    title: {
        marginBottom: 8,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },
    progressBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.15)",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 3,
    },
});
