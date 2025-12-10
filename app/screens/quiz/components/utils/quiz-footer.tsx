import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@app/components/ui/button";
import { QuizUserResponse } from "@app/types/quiz-types";
import { useUserData } from "@contexts/user-data-context";

import { useQuizFlow } from "../../quiz-context";

export const QuizFooter = () => {
    const { t } = useTranslation("full_trads");
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
        (field: keyof QuizUserResponse, value: string | number) => {
            updateField(field, value);
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

            {currentStep !== "AlcoholBlock" && currentStep !== "SmokeBlock" && (
                <Button
                    title={
                        isLoading
                            ? t("COMMON.LOADING")
                            : isLastQuestion
                              ? t("COMMON.FINISH")
                              : t("COMMON.NEXT")
                    }
                    onPress={handleNext}
                    isLoading={isLoading}
                    disabled={!canContinue || isLoading}
                    variant="primary"
                />
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
