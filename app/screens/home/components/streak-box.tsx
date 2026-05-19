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

const DAYS_TO_SHOW = 7;

const getLast7Days = () => {
    const days: { date: Date; label: string }[] = [];
    for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        days.push({ date: d, label: "" });
    }
    return days;
};

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

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

    const last7 = getLast7Days();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayLabels = t("HOME_PAGE.GAMIFICATION.DAY_LABELS", {
        returnObjects: true,
    }) as string[];

    const resolvedWidth = width ?? windowWidth - 32;

    return (
        <LinearGradient
            colors={colors.streak}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
                styles.container,
                {
                    width: resolvedWidth,
                    height,
                    shadowColor: colors.black,
                },
                style,
            ]}
        >
            <View style={styles.topRow}>
                <View style={styles.flameSection}>
                    <Text fontSize={42} style={styles.flameEmoji}>
                        🔥
                    </Text>
                    <View>
                        <Text
                            fontSize={36}
                            weight="900"
                            color={colors.white}
                            style={styles.streakNumber}
                        >
                            {streak}
                        </Text>
                        <Text
                            fontSize={12}
                            weight="600"
                            color={colors.white}
                            style={{ opacity: 0.8 }}
                        >
                            {t("HOME_PAGE.GAMIFICATION.STREAK_DAYS")}
                        </Text>
                    </View>
                </View>

                <View style={styles.mottoSection}>
                    <Text
                        fontSize={13}
                        weight="700"
                        color={colors.white}
                        style={[
                            styles.mottoText,
                            { opacity: streak > 0 ? 1 : 0.7 },
                        ]}
                        numberOfLines={2}
                    >
                        {streak === 0
                            ? t("HOME_PAGE.GAMIFICATION.STREAK_START")
                            : streak >= 7
                              ? t("HOME_PAGE.GAMIFICATION.STREAK_FIRE")
                              : t("HOME_PAGE.GAMIFICATION.STREAK_KEEP_GOING")}
                    </Text>
                </View>
            </View>

            <View style={styles.daysRow}>
                {last7.map(({ date }, index) => {
                    const activity = activities.find((a) => {
                        const d = new Date(a.date);
                        d.setHours(0, 0, 0, 0);
                        return isSameDay(d, date);
                    });
                    const isToday = isSameDay(date, today);
                    const completed = activity?.completed ?? false;

                    return (
                        <View key={index} style={styles.dayItem}>
                            <Text
                                fontSize={10}
                                weight="600"
                                color={colors.white}
                                style={{ opacity: 0.7, marginBottom: 4 }}
                            >
                                {dayLabels[date.getDay()]}
                            </Text>
                            <View
                                style={[
                                    styles.dayCircle,
                                    completed && styles.dayCircleCompleted,
                                    isToday &&
                                        !completed &&
                                        styles.dayCircleToday,
                                ]}
                            >
                                <Text fontSize={12}>
                                    {completed ? "✓" : isToday ? "·" : ""}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        ...padding(14, 16),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    flameSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    flameEmoji: {
        lineHeight: 48,
    },
    streakNumber: {
        lineHeight: 38,
    },
    mottoSection: {
        flex: 1,
        alignItems: "flex-end",
        paddingLeft: 12,
    },
    mottoText: {
        textAlign: "right",
        lineHeight: 18,
    },
    daysRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.2)",
    },
    dayItem: {
        alignItems: "center",
        flex: 1,
    },
    dayCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.25)",
        justifyContent: "center",
        alignItems: "center",
    },
    dayCircleCompleted: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderColor: "rgba(255,255,255,1)",
    },
    dayCircleToday: {
        borderColor: "rgba(255,255,255,0.8)",
        borderWidth: 2,
    },
});
