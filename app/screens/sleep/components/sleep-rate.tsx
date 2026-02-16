import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { MoodDepressedIcon } from "@app/assets/icons/MoodDepressedIcon";
import { MoodHappyIcon } from "@app/assets/icons/MoodHappyIcon";
import { MoodNeutralIcon } from "@app/assets/icons/MoodNeutralIcon";
import { MoodOverjoyedIcon } from "@app/assets/icons/MoodOverjoyedIcon";
import { MoodSadIcon } from "@app/assets/icons/MoodSadIcon";
import { MoonIcon } from "@app/assets/icons/MoonIcon";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";

export const SleepRate = () => {
    const { t } = useTranslation();
    const [moodSelected, setMoodSelected] = useState<number>(0);
    const colors = useColorTheme();

    const moods = [
        {
            id: 1,
            Icon: MoodDepressedIcon,
            color: colors.red[700],
            colorSecondary: colors.red[100],
        },
        {
            id: 2,
            Icon: MoodSadIcon,
            color: colors.blue[700],
            colorSecondary: colors.blue[100],
        },
        {
            id: 3,
            Icon: MoodNeutralIcon,
            color: colors.orange[700],
            colorSecondary: colors.orange[100],
        },
        {
            id: 4,
            Icon: MoodHappyIcon,
            color: colors.yellow[700],
            colorSecondary: colors.yellow[100],
        },
        {
            id: 5,
            Icon: MoodOverjoyedIcon,
            color: colors.green[700],
            colorSecondary: colors.green[100],
        },
    ];

    const handleMoodPress = (id: number) => {
        setMoodSelected(moodSelected === id ? 0 : id);
    };

    return (
        <LinearGradient
            colors={[colors.blue[400], colors.blue[800]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.container]}
        >
            <View style={styles.label}>
                <MoonIcon width={30} height={30} color={colors.blue[100]} />
                <Text
                    color={colors.blue[100]}
                    style={{ marginLeft: 4 }}
                    fontSize={15}
                    weight="600"
                >
                    {t("SLEEP.RATE_YOUR_NIGHT")}
                </Text>
            </View>
            <View style={styles.moodContainer}>
                {moods.map((mood) => {
                    const isSelected = moodSelected === mood.id;
                    return (
                        <TouchableOpacity
                            key={mood.id}
                            onPress={() => {
                                handleMoodPress(mood.id);
                            }}
                            activeOpacity={0.6}
                            style={styles.moodButton}
                        >
                            <View pointerEvents="none">
                                <mood.Icon
                                    width={30}
                                    height={30}
                                    color={
                                        isSelected
                                            ? mood.color
                                            : colors.blue[300]
                                    }
                                    colorSecondary={
                                        isSelected
                                            ? mood.colorSecondary
                                            : colors.blue[900]
                                    }
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        height: 50,
        width: "100%",
    },

    label: {
        flexDirection: "row",
        alignItems: "center",
    },

    moodContainer: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
    },

    moodButton: {
        padding: 4,
    },
});
