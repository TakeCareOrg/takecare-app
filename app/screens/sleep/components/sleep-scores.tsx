import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { SleepIllu1 } from "@app/assets/img/illustrations/SleepIllu1";
import { SleepIllu2 } from "@app/assets/img/illustrations/SleepIllu2";
import { SleepIllu3 } from "@app/assets/img/illustrations/SleepIllu3";
import { SleepIllu4 } from "@app/assets/img/illustrations/SleepIllu4";
import { Box } from "@app/components/ui/box";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";

import { ProgressBar } from "./progress-bar";

export const SleepScores = () => {
    const { t } = useTranslation();
    const colors = useColorTheme();

    const illustrations = [
        { day: "Monday", illustration: <SleepIllu1 /> },
        { day: "Tuesday", illustration: <SleepIllu2 /> },
        { day: "Wednesday", illustration: <SleepIllu3 /> },
        { day: "Thursday", illustration: <SleepIllu4 /> },
        { day: "Friday", illustration: <SleepIllu1 /> },
        { day: "Saturday", illustration: <SleepIllu2 /> },
        { day: "Sunday", illustration: <SleepIllu3 /> },
    ];

    const today = new Date().getDay();

    return (
        <Box title={t("SLEEP.TODAY_SLEEP_SCORES")} style={{ marginTop: 20 }}>
            <View style={styles.sleepScoreBox}>
                {illustrations.map((illustration, index) => {
                    if (index + 1 === today) {
                        return (
                            <View key={index} style={{ alignItems: "center" }}>
                                {illustration.illustration}
                            </View>
                        );
                    }
                })}
                <View style={styles.sleepScore}>
                    <Text weight="600" fontSize={26}>
                        81
                    </Text>
                    <Text weight="600" fontSize={26}>
                        {t("SLEEP.GOOD")}
                    </Text>
                </View>
            </View>
            <View style={styles.sleepScoreDetailsBox}>
                <View style={styles.progressBarBox}>
                    <View style={styles.labelRow}>
                        <Text fontSize={9} color={colors.secondary}>
                            {t("SLEEP.TOTAL_SLEEP_TIME")}
                        </Text>
                        <Text fontSize={9} color={colors.blue[100]}>
                            6h31min
                        </Text>
                    </View>
                    <ProgressBar
                        value={81}
                        backgroundColor={colors.black[200]}
                        color={colors.blue[100]}
                    />
                </View>
                <View style={styles.progressBarBox}>
                    <View style={styles.labelRow}>
                        <Text fontSize={9} color={colors.secondary}>
                            {t("SLEEP.SLEEP_CYCLES")}
                        </Text>
                        <Text fontSize={9} color={colors.blue[100]}>
                            4 {t("SLEEP.TIMES")}
                        </Text>
                    </View>
                    <ProgressBar
                        value={81}
                        backgroundColor={colors.black[200]}
                        color={colors.blue[100]}
                    />
                </View>
                <View style={styles.progressBarBox}>
                    <View style={styles.labelRow}>
                        <Text fontSize={9} color={colors.secondary}>
                            {t("SLEEP.WAKEFULNESS")}
                        </Text>
                        <Text fontSize={9} color={colors.blue[100]}>
                            15%
                        </Text>
                    </View>
                    <ProgressBar
                        value={15}
                        backgroundColor={colors.black[200]}
                        color={colors.blue[100]}
                    />
                </View>
                <View style={styles.progressBarBox}>
                    <View style={styles.labelRow}>
                        <Text fontSize={9} color={colors.secondary}>
                            {t("SLEEP.PHYSICAL_RECOVERY")}
                        </Text>
                        <Text fontSize={9} color={colors.green[500]}>
                            62%
                        </Text>
                    </View>
                    <ProgressBar
                        value={62}
                        backgroundColor={colors.black[200]}
                        color={colors.green[500]}
                    />
                </View>
                <View style={styles.progressBarBox}>
                    <View style={styles.labelRow}>
                        <Text fontSize={9} color={colors.secondary}>
                            {t("SLEEP.MENTAL_RECOVERY")}
                        </Text>
                        <Text fontSize={9} color={colors.blue[100]}>
                            69%
                        </Text>
                    </View>
                    <ProgressBar
                        value={69}
                        backgroundColor={colors.black[200]}
                        color={colors.blue[100]}
                    />
                </View>
            </View>
        </Box>
    );
};

const styles = StyleSheet.create({
    sleepScoreBox: {
        position: "relative",
    },
    sleepScore: {
        position: "absolute",
        top: 10,
        right: 20,
        textAlign: "right",
        alignItems: "flex-end",
    },

    sleepScoreDetailsBox: {
        marginTop: 20,
        flexDirection: "column",
        alignItems: "center",
        gap: 15,
    },

    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
    },

    progressBarBox: {
        width: "100%",
        flexDirection: "column",
        gap: 12,
    },
});
