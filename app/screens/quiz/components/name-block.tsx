import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Input } from "@app/components/ui/input";
import { nameRegex } from "@app/constants/text";
import { Text } from "@components/ui/text";
import { InputQuizProps, QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

interface NameBlockProps extends InputQuizProps {
    firstname: string;
    lastname: string;
}

export function NameBlock({ firstname, lastname, onChange }: NameBlockProps) {
    const { text } = useColorTheme();
    const { t } = useTranslation();

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
                <Text fontSize={14} color={text} weight="400">
                    {t("QUIZ.NAME.FIRSTNAME_LABEL")}
                </Text>
                <Input
                    onChangeText={handleChangeFirstname}
                    value={firstname}
                    placeholder={t("QUIZ.NAME.FIRSTNAME_PLACEHOLDER")}
                />
            </View>
            <View style={styles.input_box}>
                <Text fontSize={14} color={text} weight="400">
                    {t("QUIZ.NAME.LASTNAME_LABEL")}
                </Text>
                <Input
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
        gap: 32,
    },
    input_box: {
        gap: 6,
    },
});
