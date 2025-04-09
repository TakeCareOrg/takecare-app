import { StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import { TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { InputQuizProps, QuizUserResponse } from "../../../types/quiz.types";
import { useColors } from "../../../styles/Colors";
import { TextComponent } from "../../../ui/text-component";

interface NameBlockProps extends InputQuizProps {
    firstname: string;
    lastname: string;
}

export const NameBlock = ({
    lastname,
    firstname,
    onChange,
}: NameBlockProps) => {
    const { quiz } = useColors();
    const { t } = useTranslation();

    const nameRegex = /^[a-zA-ZÀ-ÿ '-]+$/;

    const handleChangeFirstname = useCallback(
        (text: string) => {
            if (nameRegex.test(text) || text.length === 0) {
                onChange((prev: QuizUserResponse) => ({
                    ...prev,
                    first_name: text,
                }));
            }
        },
        [onChange],
    );

    const handleChangeLastname = useCallback(
        (text: string) => {
            if (nameRegex.test(text) || text.length === 0) {
                onChange((prev: QuizUserResponse) => ({
                    ...prev,
                    last_name: text,
                }));
            }
        },
        [onChange],
    );

    return (
        <View style={styles.container}>
            <View style={styles.input_box}>
                <TextComponent fontSize={16} color={quiz.text}>
                    {t("QUIZ.NAME.FIRSTNAME_LABEL")}
                </TextComponent>
                <TextInput
                    style={{ ...styles.input, shadowColor: quiz.shadow }}
                    onChangeText={handleChangeFirstname}
                    value={firstname}
                    placeholder={t("QUIZ.NAME.FIRSTNAME_PLACEHOLDER")}
                />
            </View>
            <View style={styles.input_box}>
                <TextComponent fontSize={16} color={quiz.text}>
                    {t("QUIZ.NAME.LASTNAME_LABEL")}
                </TextComponent>
                <TextInput
                    style={{ ...styles.input, shadowColor: quiz.shadow }}
                    onChangeText={handleChangeLastname}
                    value={lastname}
                    placeholder={t("QUIZ.NAME.LASTNAME_PLACEHOLDER")}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-evenly",
        alignItems: "center",
        gap: 32,
    },
    input_box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: 10,
    },
    input: {
        backgroundColor: "white",
        width: "90%",
        borderRadius: 32,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.8,
        shadowRadius: 6.27,
        elevation: 10,
        zIndex: 1,
        color: "black",
    },
});
