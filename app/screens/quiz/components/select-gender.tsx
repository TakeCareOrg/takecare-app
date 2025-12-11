import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import { Button } from "@app/components/ui/button";
import { InputQuizProps, Option, QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

const { height } = Dimensions.get("window");

type SelectGenderProps = InputQuizProps & {
    options: Option[];
    gender: QuizUserResponse["gender"];
};

export function SelectGender({ options, onChange, gender }: SelectGenderProps) {
    const { white, shadow } = useColorTheme();
    const { t } = useTranslation("full_trads");

    const handleSelect = useCallback(
        (value: string | number) => {
            onChange((prev: QuizUserResponse) => ({
                ...prev,
                gender: value as QuizUserResponse["gender"],
            }));
        },
        [onChange],
    );

    return (
        <View style={styles.container}>
            {options?.map((option, i) => {
                if (option.value === "other") {
                    return (
                        <Button
                            key={i}
                            title={t("QUIZ.QUESTIONS.GENDER_OPTIONS.OTHER")}
                            onPress={() => handleSelect(option.value)}
                            variant={
                                gender === option.value ? "primary" : "outline"
                            }
                        />
                    );
                }
                return (
                    <View
                        key={i}
                        style={{
                            ...(gender === option.value && {
                                shadowColor: shadow,
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowOpacity: 0.8,
                                shadowRadius: 3,
                                elevation: 10,
                                zIndex: 1,
                            }),
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => handleSelect(option.value)}
                        >
                            <View
                                style={{
                                    ...styles.button,
                                    backgroundColor: white,
                                }}
                            >
                                {option.image}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    button: {
        height: height / 5,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 2,
    },
});
