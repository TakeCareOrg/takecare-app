import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { Text } from "@components/ui/text";
import { InputQuizProps, QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

interface NameBlockProps extends InputQuizProps {
    firstname: string;
    lastname: string;
}

export function NameBlock({ firstname, lastname, onChange }: NameBlockProps) {
    const { text, shadow } = useColorTheme();
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
                <Text fontSize={16} color={text}>
                    {t("QUIZ.NAME.FIRSTNAME_LABEL")}
                </Text>
                <TextInput
                    style={{ ...styles.input, shadowColor: shadow }}
                    onChangeText={handleChangeFirstname}
                    value={firstname}
                    placeholder={t("QUIZ.NAME.FIRSTNAME_PLACEHOLDER")}
                />
            </View>
            <View style={styles.input_box}>
                <Text fontSize={16} color={text}>
                    {t("QUIZ.NAME.LASTNAME_LABEL")}
                </Text>
                <TextInput
                    style={{ ...styles.input, shadowColor: shadow }}
                    onChangeText={handleChangeLastname}
                    value={lastname}
                    placeholder={t("QUIZ.NAME.LASTNAME_PLACEHOLDER")}
                />
            </View>
        </View>
    );
}

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
