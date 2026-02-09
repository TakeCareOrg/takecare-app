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

export const SelectGender = ({
    options,
    onChange,
    gender,
}: SelectGenderProps) => {
    const { white, shadow, primary } = useColorTheme();
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
                const isSelected = gender === option.value;

                if (option.value === "other") {
                    return (
                        <View
                            key={i}
                            style={[
                                styles.otherButtonWrapper,
                                isSelected && {
                                    borderColor: primary || "#007AFF",
                                    borderWidth: 3,
                                    borderRadius: 20,
                                },
                            ]}
                        >
                            <Button
                                title={t("QUIZ.QUESTIONS.GENDER_OPTIONS.OTHER")}
                                onPress={() => handleSelect(option.value)}
                                variant={isSelected ? "primary" : "outline"}
                            />
                        </View>
                    );
                }

                return (
                    <View
                        key={i}
                        style={[
                            styles.buttonWrapper,
                            isSelected && {
                                borderColor: primary || "#007AFF",
                                borderWidth: 3,
                                shadowColor: shadow,
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowOpacity: 0.8,
                                shadowRadius: 3,
                                elevation: 10,
                            },
                        ]}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => handleSelect(option.value)}
                        >
                            <View
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: white,
                                        opacity: isSelected ? 1 : 0.7,
                                    },
                                ]}
                            >
                                {option.image}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    buttonWrapper: {
        borderRadius: 32,
        borderWidth: 3,
        borderColor: "transparent",
    },
    otherButtonWrapper: {
        borderRadius: 32,
        borderWidth: 3,
        borderColor: "transparent",
    },
    button: {
        height: height / 5,
        borderRadius: 29,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
});
