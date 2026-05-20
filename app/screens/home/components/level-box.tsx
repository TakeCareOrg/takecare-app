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

import { useColorTheme } from "@app/hooks/use-color-theme";
import { useGamificationStore } from "@app/stores/gamification";
import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";

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
    const resolvedHeight = typeof height === "number" ? height : 200;

    const accent = colors.raw.primary[500];
    const accentSoft = colors.isDark
        ? "rgba(120, 137, 210, 0.20)"
        : "rgba(120, 137, 210, 0.14)";
    const trackMuted = colors.isDark
        ? "rgba(255,255,255,0.10)"
        : "rgba(0,0,0,0.06)";

    if (!levelInfo) {
        return (
            <Box
                title={t("HOME_PAGE.GAMIFICATION.LEVEL_TITLE")}
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
                        {t("HOME_PAGE.GAMIFICATION.NO_LEVEL")}
                    </Text>
                </View>
            </Box>
        );
    }

    return (
        <Box
            title={t("HOME_PAGE.GAMIFICATION.LEVEL_TITLE")}
            width={resolvedWidth}
            height={resolvedHeight}
            headerStyle={{ marginBottom: 10 }}
            style={style}
        >
            <View style={styles.topRow}>
                <View
                    style={[
                        styles.levelCircle,
                        {
                            backgroundColor: accentSoft,
                            borderColor: accent,
                        },
                    ]}
                >
                    <Text fontSize={20} weight="900" color={accent}>
                        {levelInfo.level}
                    </Text>
                </View>
                <View style={styles.pointsBadge}>
                    <Text fontSize={18} weight="900" color={colors.text}>
                        {totalPoints}
                    </Text>
                    <Text
                        fontSize={9}
                        weight="700"
                        color={colors.secondary}
                        style={styles.unitLabel}
                    >
                        {t("HOME_PAGE.GAMIFICATION.PTS")}
                    </Text>
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
                    {levelInfo.title}
                </Text>

                <View style={styles.progressRow}>
                    <View
                        style={[
                            styles.progressBar,
                            { backgroundColor: trackMuted },
                        ]}
                    >
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${levelInfo.progressToNextLevel}%`,
                                    backgroundColor: accent,
                                },
                            ]}
                        />
                    </View>
                    <Text fontSize={10} color={colors.secondary} weight="700">
                        {levelInfo.progressToNextLevel}%
                    </Text>
                </View>

                <Text
                    fontSize={10}
                    color={colors.secondary}
                    weight="600"
                    numberOfLines={1}
                >
                    {t("HOME_PAGE.GAMIFICATION.NEXT_LEVEL", {
                        level: levelInfo.level + 1,
                        points: levelInfo.pointsForNextLevel,
                    })}
                </Text>
            </View>
        </Box>
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
        alignItems: "center",
    },
    levelCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
    },
    pointsBadge: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 3,
    },
    unitLabel: {
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 3,
    },
    bottomSection: {
        flex: 1,
        justifyContent: "flex-end",
        gap: 6,
    },
    title: {
        marginBottom: 2,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    progressBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 3,
    },
});
