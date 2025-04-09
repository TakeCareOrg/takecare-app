import React from "react";
import { StyleSheet, View } from "react-native";
import { SleepIllu1 } from "../../../../../assets/images/illustrations/SleepIllu1";
import { SleepIllu2 } from "../../../../../assets/images/illustrations/SleepIllu2";
import { SleepIllu3 } from "../../../../../assets/images/illustrations/SleepIllu3";
import { SleepIllu4 } from "../../../../../assets/images/illustrations/SleepIllu4";
import { Container } from "../../../../ui/container";
import { TextComponent } from "../../../../ui/text-component";
import { ProgressBar } from "./progress-bar";
import { useColors } from "../../../../styles/Colors";

export const SleepScores = () => {
    const { sleep, main } = useColors();

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
        <Container title="Today's Sleep Scores">
            <View style={styles.sleepScoreContainer}>
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
                    <TextComponent fontSize={26}>81</TextComponent>
                    <TextComponent fontSize={26}>Good</TextComponent>
                </View>
            </View>
            <View style={styles.sleepScoreDetailsContainer}>
                <View style={styles.progressBarContainer}>
                    <View style={styles.labelRow}>
                        <TextComponent fontSize={9} color={main.secondary}>
                            Total sleep time
                        </TextComponent>
                        <TextComponent fontSize={9} color={sleep.less}>
                            6h31min
                        </TextComponent>
                    </View>
                    <ProgressBar
                        value={81}
                        backgroundColor={main.inputBackground}
                        color={sleep.less}
                    />
                </View>
                <View style={styles.progressBarContainer}>
                    <View style={styles.labelRow}>
                        <TextComponent fontSize={9} color={main.secondary}>
                            Sleep cycles
                        </TextComponent>
                        <TextComponent fontSize={9} color={sleep.sleepCycle}>
                            4 times
                        </TextComponent>
                    </View>
                    <ProgressBar
                        value={81}
                        backgroundColor={main.inputBackground}
                        color={sleep.sleepCycle}
                    />
                </View>
                <View style={styles.progressBarContainer}>
                    <View style={styles.labelRow}>
                        <TextComponent fontSize={9} color={main.secondary}>
                            Wakefulness
                        </TextComponent>
                        <TextComponent fontSize={9} color={sleep.awake}>
                            15%
                        </TextComponent>
                    </View>
                    <ProgressBar
                        value={15}
                        backgroundColor={main.inputBackground}
                        color={sleep.awake}
                    />
                </View>
                <View style={styles.progressBarContainer}>
                    <View style={styles.labelRow}>
                        <TextComponent fontSize={9} color={main.secondary}>
                            Physical recovery
                        </TextComponent>
                        <TextComponent fontSize={9} color={main.green}>
                            62%
                        </TextComponent>
                    </View>
                    <ProgressBar
                        value={62}
                        backgroundColor={main.inputBackground}
                        color={main.green}
                    />
                </View>
                <View style={styles.progressBarContainer}>
                    <View style={styles.labelRow}>
                        <TextComponent fontSize={9} color={main.secondary}>
                            Mental recovery
                        </TextComponent>
                        <TextComponent
                            fontSize={9}
                            color={sleep.mentalRecovery}
                        >
                            69%
                        </TextComponent>
                    </View>
                    <ProgressBar
                        value={69}
                        backgroundColor={main.inputBackground}
                        color={sleep.mentalRecovery}
                    />
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    sleepScoreContainer: {
        position: "relative",
    },
    sleepScore: {
        position: "absolute",
        top: 10,
        right: 20,
        textAlign: "right",
        alignItems: "flex-end",
    },

    sleepScoreDetailsContainer: {
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

    progressBarContainer: {
        width: "100%",
        flexDirection: "column",
        gap: 12,
    },
});
