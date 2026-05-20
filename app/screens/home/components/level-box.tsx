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
import { GradientBox } from "@components/ui/gradient-box";
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

    // Saturated violet gradient → "level / progression" semantic.
    // The box is now dark all the time, so every embedded foreground
    // element flips to a white-tint scale (rgba(255,255,255,…)) to
    // keep AA contrast.
    const gradient: [string, string] = [
        colors.raw.primary[500],
        colors.raw.blue[700],
    ];
    const accent = colors.white;
    const accentSoft = "rgba(255,255,255,0.20)";
    const trackMuted = "rgba(255,255,255,0.18)";
    const onGradientPrimary = colors.white;
    const onGradientSecondary = "rgba(255,255,255,0.85)";

    if (!levelInfo) {
        return (
            <GradientBox
                title={t("HOME_PAGE.GAMIFICATION.LEVEL_TITLE")}
                width={resolvedWidth}
                height={resolvedHeight}
                style={style}
                gradient={gradient}
                titleColor={onGradientPrimary}
            >
                <View style={styles.emptyWrapper}>
                    <Text
                        fontSize={14}
                        weight="700"
                        color={onGradientSecondary}
                        style={{ textAlign: "center" }}
                    >
                        {t("HOME_PAGE.GAMIFICATION.NO_LEVEL")}
                    </Text>
                </View>
            </GradientBox>
        );
    }

    return (
        <GradientBox
            title={t("HOME_PAGE.GAMIFICATION.LEVEL_TITLE")}
            width={resolvedWidth}
            height={resolvedHeight}
            headerStyle={{ marginBottom: 10 }}
            style={style}
            gradient={gradient}
            titleColor={onGradientPrimary}
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
                    <Text fontSize={18} weight="900" color={onGradientPrimary}>
                        {totalPoints}
                    </Text>
                    <Text
                        fontSize={9}
                        weight="700"
                        color={onGradientSecondary}
                        style={styles.unitLabel}
                    >
                        {t("HOME_PAGE.GAMIFICATION.PTS")}
                    </Text>
                </View>
            </View>

            <View style={styles.bottomSection}>
                <Text
                    fontSize={14}
                    color={onGradientPrimary}
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
                    <Text
                        fontSize={10}
                        color={onGradientSecondary}
                        weight="700"
                    >
                        {levelInfo.progressToNextLevel}%
                    </Text>
                </View>

                <Text
                    fontSize={10}
                    color={onGradientSecondary}
                    weight="600"
                    numberOfLines={1}
                >
                    {t("HOME_PAGE.GAMIFICATION.NEXT_LEVEL", {
                        level: levelInfo.level + 1,
                        points: levelInfo.pointsForNextLevel,
                    })}
                </Text>
            </View>
        </GradientBox>
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
