import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { MoodDepressedIcon } from "../../../../../assets/icons/MoodDepressedIcon";
import { MoodHappyIcon } from "../../../../../assets/icons/MoodHappyIcon";
import { MoodNeutralIcon } from "../../../../../assets/icons/MoodNeutralIcon";
import { MoodOverjoyedIcon } from "../../../../../assets/icons/MoodOverjoyedIcon";
import { MoodSadIcon } from "../../../../../assets/icons/MoodSadIcon";
import { MoonIcon } from "../../../../../assets/icons/MoonIcon";
import { useColors } from "../../../../styles/Colors";
import { TextComponent } from "../../../../ui/text-component";

export const SleepRate = () => {
    const [moodSelected, setMoodSelected] = useState<number>(0);
    // Renders
    useEffect(() => {}, []);

    const { pastels, sleep } = useColors();

    return (
        <LinearGradient
            colors={sleep.rate}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <View style={styles.label}>
                <MoonIcon width={30} height={30} color={pastels.blueText} />
                <TextComponent
                    color={pastels.blueText}
                    style={{ marginLeft: 6 }}
                    fontSize={15}
                >
                    Rate your night
                </TextComponent>
            </View>
            <View style={styles.moodContainer}>
                <MoodDepressedIcon
                    width={30}
                    height={30}
                    color={
                        moodSelected === 1
                            ? pastels.blueText
                            : sleep.moodUnselectedBackground
                    }
                    colorSecondary={
                        moodSelected === 1
                            ? pastels.blueBackground
                            : sleep.moodUnselectedText
                    }
                    onPress={() => {
                        if (moodSelected === 1) setMoodSelected(0);
                        else setMoodSelected(1);
                    }}
                />
                <MoodSadIcon
                    width={30}
                    height={30}
                    color={
                        moodSelected === 2
                            ? pastels.redText
                            : sleep.moodUnselectedBackground
                    }
                    colorSecondary={
                        moodSelected === 2
                            ? pastels.redBackground
                            : sleep.moodUnselectedText
                    }
                    onPress={() => {
                        if (moodSelected === 2) setMoodSelected(0);
                        else setMoodSelected(2);
                    }}
                />
                <MoodNeutralIcon
                    width={30}
                    height={30}
                    color={
                        moodSelected === 3
                            ? pastels.orangeText
                            : sleep.moodUnselectedBackground
                    }
                    colorSecondary={
                        moodSelected === 3
                            ? pastels.orangeBackground
                            : sleep.moodUnselectedText
                    }
                    onPress={() => {
                        if (moodSelected === 3) setMoodSelected(0);
                        else setMoodSelected(3);
                    }}
                />
                <MoodHappyIcon
                    width={30}
                    height={30}
                    color={
                        moodSelected === 4
                            ? pastels.yellowText
                            : sleep.moodUnselectedBackground
                    }
                    colorSecondary={
                        moodSelected === 4
                            ? pastels.yellowBackground
                            : sleep.moodUnselectedText
                    }
                    onPress={() => {
                        if (moodSelected === 4) setMoodSelected(0);
                        else setMoodSelected(4);
                    }}
                />
                <MoodOverjoyedIcon
                    width={30}
                    height={30}
                    color={
                        moodSelected === 5
                            ? pastels.greenText
                            : sleep.moodUnselectedBackground
                    }
                    colorSecondary={
                        moodSelected === 5
                            ? pastels.greenBackground
                            : sleep.moodUnselectedText
                    }
                    onPress={() => {
                        if (moodSelected === 5) setMoodSelected(0);
                        else setMoodSelected(5);
                    }}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        flex: 1,
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    label: {
        flexDirection: "row",
        alignItems: "center",
    },

    moodContainer: {
        flexDirection: "row",
        gap: 15,
    },
});
