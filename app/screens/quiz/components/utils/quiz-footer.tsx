import React, { useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import { useQuizFlow } from "../../quiz-context";
import { useUserData } from "@contexts/user-data-context";

export const QuizFooter = () => {
    const { t } = useTranslation();
    const {
        currentQuestion,
        currentIndex,
        totalQuestions,
        canContinue,
        isLoading,
        goNext,
        completeQuiz,
    } = useQuizFlow();
    const { updateField } = useUserData();

    const isLastQuestion = currentIndex === totalQuestions - 1;
    const currentStep = currentQuestion?.component;

    const handleSkip = useCallback(
        (field: string, value: any) => {
            updateField(field as any, value);
            goNext();
        },
        [updateField, goNext],
    );

    const handleNext = useCallback(async () => {
        if (isLastQuestion) {
            await completeQuiz();
        } else {
            goNext();
        }
    }, [isLastQuestion, completeQuiz, goNext]);

    return (
        <View style={{ marginBottom: 12, gap: 10 }}>
            {currentStep === "SelectGender" && (
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => handleSkip("gender", "other")}
                >
                    <Text style={styles.skipButtonText}>
                        {t("QUIZ.SKIP_BUTTON")}
                    </Text>
                </TouchableOpacity>
            )}
            {currentStep === "AlcoholBlock" && (
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => handleSkip("alcohol", "never")}
                >
                    <Text style={styles.skipButtonText}>
                        {t("QUIZ.SKIP_BUTTON_ALCOHOL")}
                    </Text>
                </TouchableOpacity>
            )}
            {currentStep === "SmokeBlock" && (
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => handleSkip("smoking", "never")}
                >
                    <Text style={styles.skipButtonText}>
                        {t("QUIZ.SKIP_BUTTON_SMOKE")}
                    </Text>
                </TouchableOpacity>
            )}

            {currentStep !== "SelectGender" && (
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        (!canContinue || isLoading) && styles.disabledButton,
                    ]}
                    onPress={handleNext}
                    disabled={!canContinue || isLoading}
                >
                    <Text style={styles.nextButtonText}>
                        {isLoading
                            ? t("QUIZ.LOADING")
                            : isLastQuestion
                              ? t("QUIZ.FINISH")
                              : t("QUIZ.NEXT")}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    skipButton: {
        padding: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        alignItems: "center",
    },
    skipButtonText: {
        fontSize: 16,
        color: "#666",
    },
    nextButton: {
        padding: 16,
        backgroundColor: "#007AFF",
        borderRadius: 8,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    nextButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
});
