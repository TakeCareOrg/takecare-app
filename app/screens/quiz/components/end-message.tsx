import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { Text } from "@components/ui/text";
import { InputQuizProps, QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

type EndMessageProps = InputQuizProps & { value: string };

export function EndMessage({ onChange, value }: EndMessageProps) {
    const { black, shadow } = useColorTheme();
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
                style={{ ...styles.textarea, shadowColor: shadow }}
                onChangeText={handleChangeText}
                value={value}
                textAlignVertical="top"
                placeholder={t("QUIZ.TYPE_SOMETHING")}
            />
            <Text
                style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: black,
                    opacity: 0.5,
                    position: "absolute",
                    bottom: 10,
                    right: 30,
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
        justifyContent: "center",
        alignItems: "center",
    },
    textarea: {
        minHeight: 200,
        maxHeight: 300,
        backgroundColor: "white",
        borderRadius: 32,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
        width: "90%",
        alignItems: "flex-start",
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
