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

const DAYS_TO_SHOW = 7;

const startOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const getLast7Days = () => {
    const today = startOfDay(new Date());
    const days: Date[] = [];
    for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(d);
    }
    return days;
};

export function StreakBox({
    width,
    height,
    style,
}: {
    width?: DimensionValue;
    height?: DimensionValue;
    style?: StyleProp<ViewStyle>;
} = {}) {
    const { t } = useTranslation("full_trads");
    const { width: windowWidth } = useWindowDimensions();
    const colors = useColorTheme();
    const { cache } = useGamificationStore();

    const streak = cache?.currentStreak ?? 0;
    const activities = cache?.dailyActivities ?? [];

    const accent = colors.isDark
        ? colors.raw.orange[300]
        : colors.raw.orange[500];
    const accentSoft = colors.isDark
        ? "rgba(248, 104, 0, 0.18)"
        : "rgba(248, 104, 0, 0.12)";
    const trackMuted = colors.isDark
        ? "rgba(255,255,255,0.10)"
        : "rgba(0,0,0,0.06)";

    const last7 = getLast7Days();
    const today = startOfDay(new Date());

    const dayLabels = t("HOME_PAGE.GAMIFICATION.DAY_LABELS", {
        returnObjects: true,
    }) as string[];

    const completionByIndex = last7.map((date) => {
        const activity = activities.find((a) =>
            isSameDay(startOfDay(new Date(a.date)), date),
        );
        return Boolean(activity?.completed);
    });

    const motto =
        streak === 0
            ? t("HOME_PAGE.GAMIFICATION.STREAK_START")
            : streak >= 7
              ? t("HOME_PAGE.GAMIFICATION.STREAK_FIRE")
              : t("HOME_PAGE.GAMIFICATION.STREAK_KEEP_GOING");

    return (
        <Box
            title={t("HOME_PAGE.GAMIFICATION.STREAK_TITLE")}
            width={width ?? windowWidth - 32}
            height={typeof height === "number" ? height : undefined}
            headerStyle={{ marginBottom: 14 }}
            style={style}
        >
            <View style={styles.topRow}>
                <View style={styles.metricSection}>
                    <View
                        style={[
                            styles.flameBadge,
                            {
                                backgroundColor: accentSoft,
                                borderColor: accent,
                            },
                        ]}
                    >
                        <Text fontSize={24} style={styles.flameEmoji}>
                            🔥
                        </Text>
                    </View>
                    <View style={styles.metricText}>
                        <View style={styles.streakNumberRow}>
                            <Text
                                fontSize={42}
                                weight="900"
                                color={colors.text}
                                style={styles.streakNumber}
                            >
                                {streak}
                            </Text>
                            <Text
                                fontSize={16}
                                weight="700"
                                color={accent}
                                style={styles.streakUnit}
                            >
                                {t("HOME_PAGE.GAMIFICATION.STREAK_UNIT")}
                            </Text>
                        </View>
                        <Text
                            fontSize={10}
                            weight="700"
                            color={colors.secondary}
                            style={styles.metricLabel}
                        >
                            {t("HOME_PAGE.GAMIFICATION.STREAK_DAYS")}
                        </Text>
                    </View>
                </View>

                <View
                    style={[styles.mottoChip, { backgroundColor: accentSoft }]}
                >
                    <Text
                        fontSize={11}
                        weight="700"
                        color={accent}
                        numberOfLines={2}
                        style={styles.mottoText}
                    >
                        {motto}
                    </Text>
                </View>
            </View>

            <View style={[styles.daysRow, { borderTopColor: trackMuted }]}>
                {last7.map((date, index) => {
                    const isToday = isSameDay(date, today);
                    const completed = completionByIndex[index];
                    const prevCompleted =
                        index > 0 && completionByIndex[index - 1];
                    const nextCompleted =
                        index < DAYS_TO_SHOW - 1 &&
                        completionByIndex[index + 1];

                    return (
                        <View key={index} style={styles.dayItem}>
                            <Text
                                fontSize={10}
                                weight="700"
                                color={colors.secondary}
                                style={styles.dayLabel}
                            >
                                {dayLabels[date.getDay()]}
                            </Text>
                            <View style={styles.dayTrackWrapper}>
                                <View
                                    style={[
                                        styles.trackSegment,
                                        styles.trackLeft,
                                        {
                                            backgroundColor:
                                                completed && prevCompleted
                                                    ? accent
                                                    : "transparent",
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.trackSegment,
                                        styles.trackRight,
                                        {
                                            backgroundColor:
                                                completed && nextCompleted
                                                    ? accent
                                                    : "transparent",
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.dayCircle,
                                        {
                                            backgroundColor: completed
                                                ? accent
                                                : "transparent",
                                            borderColor:
                                                completed || isToday
                                                    ? accent
                                                    : trackMuted,
                                            borderWidth:
                                                isToday && !completed ? 2 : 1.5,
                                        },
                                    ]}
                                >
                                    {completed ? (
                                        <Text
                                            fontSize={12}
                                            weight="900"
                                            color={colors.white}
                                            style={styles.dayCheck}
                                        >
                                            ✓
                                        </Text>
                                    ) : isToday ? (
                                        <View
                                            style={[
                                                styles.todayDot,
                                                { backgroundColor: accent },
                                            ]}
                                        />
                                    ) : null}
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </Box>
    );
}

const styles = StyleSheet.create({
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    metricSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flexShrink: 1,
    },
    flameBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
    },
    flameEmoji: {
        lineHeight: 28,
    },
    metricText: {
        justifyContent: "center",
    },
    streakNumberRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 4,
    },
    streakNumber: {
        lineHeight: 44,
        letterSpacing: -1,
    },
    streakUnit: {
        lineHeight: 22,
        marginBottom: 4,
    },
    metricLabel: {
        marginTop: -2,
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    mottoChip: {
        flexShrink: 1,
        maxWidth: "42%",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    mottoText: {
        textAlign: "right",
        lineHeight: 14,
    },
    daysRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 12,
        borderTopWidth: 1,
    },
    dayItem: {
        flex: 1,
        alignItems: "center",
    },
    dayLabel: {
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    dayTrackWrapper: {
        width: "100%",
        height: 26,
        alignItems: "center",
        justifyContent: "center",
    },
    trackSegment: {
        position: "absolute",
        top: 12,
        height: 2,
        width: "50%",
    },
    trackLeft: {
        left: 0,
    },
    trackRight: {
        right: 0,
    },
    dayCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    dayCheck: {
        lineHeight: 14,
    },
    todayDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});
