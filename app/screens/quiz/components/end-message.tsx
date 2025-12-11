import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { Text } from "@components/ui/text";
import { InputQuizProps, QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

type EndMessageProps = InputQuizProps & { value: string };

export function EndMessage({ onChange, value }: EndMessageProps) {
    const { shadow, card, border, text } = useColorTheme();
    const { t } = useTranslation();

    const handleChangeText = useCallback(
        (text: string) => {
            if (text.length <= 250) {
                onChange((prev: QuizUserResponse) => ({
                    ...prev,
                    summary_message: text,
                }));
            }
        },
        [onChange],
    );

    return (
        <View style={styles.container}>
            <TextInput
                multiline={true}
                numberOfLines={10}
                style={{
                    ...styles.textarea,
                    shadowColor: shadow,
                    backgroundColor: card,
                    borderWidth: 1,
                    borderColor: border,
                    color: text,
                    fontSize: 16,
                }}
                onChangeText={handleChangeText}
                value={value}
                textAlignVertical="top"
                placeholder={t("QUIZ.TYPE_SOMETHING")}
            />
            <Text
                weight="600"
                fontSize={12}
                style={{
                    opacity: 0.5,
                    position: "absolute",
                    bottom: 10,
                    right: 20,
                    zIndex: 10,
                }}
            >
                {value.length}/250
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        minHeight: 200,
        maxHeight: 300,
    },
    textarea: {
        borderRadius: 32,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flex: 1,
        alignItems: "flex-start",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 10,
        zIndex: 1,
    },
});
