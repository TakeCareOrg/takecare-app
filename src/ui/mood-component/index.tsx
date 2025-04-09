import React from "react";
import { useColorScheme, View } from "react-native";
import { row } from "../../styles/global-style";
import { NoMoodIcon } from "../../../assets/icons/NoMoodIcon";
import { TextComponent } from "../text-component";
import { useColors } from "../../styles/Colors";
import { MoodHappyIcon } from "../../../assets/icons/MoodHappyIcon";
import { MoodSadIcon } from "../../../assets/icons/MoodSadIcon";
import { MoodDepressedIcon } from "../../../assets/icons/MoodDepressedIcon";
import { MoodNeutralIcon } from "../../../assets/icons/MoodNeutralIcon";
import { MoodOverjoyedIcon } from "../../../assets/icons/MoodOverjoyedIcon";
import { Mood } from "../../types/mood.types";
import { useTranslation } from "react-i18next";

export const MoodComponent: React.FC<Mood> = ({ mood }: Mood) => {
    const { main, pastels } = useColors();
    const isDarkmode = useColorScheme() === "dark";
    const { t } = useTranslation();

    switch (mood) {
        case "happy":
            return (
                <View style={{ ...row.row, marginRight: 15 }}>
                    <MoodHappyIcon
                        width={20}
                        height={20}
                        color={pastels.yellowText}
                        colorSecondary={pastels.yellowBackground}
                    />
                    <TextComponent
                        fontSize={16}
                        color={
                            isDarkmode
                                ? pastels.yellowText
                                : pastels.yellowBackground
                        }
                        style={{ marginLeft: 5 }}
                    >
                        {/* Happy */}
                        {t("HOME.MOOD.HAPPY")}
                    </TextComponent>
                </View>
            );
        case "sad":
            return (
                <View style={{ ...row.row, marginRight: 15 }}>
                    <MoodSadIcon
                        width={20}
                        height={20}
                        color={pastels.redText}
                        colorSecondary={pastels.redBackground}
                    />
                    <TextComponent
                        fontSize={16}
                        color={
                            isDarkmode ? pastels.redText : pastels.redBackground
                        }
                        style={{ marginLeft: 5 }}
                    >
                        {t("HOME.MOOD.SAD")}
                    </TextComponent>
                </View>
            );
        case "depressed":
            return (
                <View style={{ ...row.row, marginRight: 15 }}>
                    <MoodDepressedIcon
                        width={20}
                        height={20}
                        color={pastels.blueText}
                        colorSecondary={pastels.blueBackground}
                    />
                    <TextComponent
                        fontSize={16}
                        color={
                            isDarkmode
                                ? pastels.blueText
                                : pastels.blueBackground
                        }
                        style={{ marginLeft: 5 }}
                    >
                        {t("HOME.MOOD.DEPRESSED")}
                    </TextComponent>
                </View>
            );
        case "neutral":
            return (
                <View style={{ ...row.row, marginRight: 15 }}>
                    <MoodNeutralIcon
                        width={20}
                        height={20}
                        color={pastels.orangeText}
                        colorSecondary={pastels.orangeBackground}
                    />
                    <TextComponent
                        fontSize={16}
                        color={
                            isDarkmode
                                ? pastels.orangeText
                                : pastels.orangeBackground
                        }
                        style={{ marginLeft: 5 }}
                    >
                        {t("HOME.MOOD.NEUTRAL")}
                    </TextComponent>
                </View>
            );
        case "overjoyed":
            return (
                <View style={{ ...row.row, marginRight: 15 }}>
                    <MoodOverjoyedIcon
                        width={20}
                        height={20}
                        color={pastels.greenText}
                        colorSecondary={pastels.greenBackground}
                    />
                    <TextComponent
                        fontSize={16}
                        color={
                            isDarkmode
                                ? pastels.greenText
                                : pastels.greenBackground
                        }
                        style={{ marginLeft: 5 }}
                    >
                        {t("HOME.MOOD.VERY_HAPPY")}
                    </TextComponent>
                </View>
            );
        default:
            return (
                <View style={{ ...row.row, marginRight: 15 }}>
                    <NoMoodIcon
                        width={20}
                        height={20}
                        color={main.grey}
                        colorSecondary={main.secondary}
                    />
                    <TextComponent
                        fontSize={16}
                        color={main.secondary}
                        style={{ marginLeft: 5 }}
                    >
                        {t("HOME.MOOD.WAIT")}
                    </TextComponent>
                </View>
            );
    }
};
