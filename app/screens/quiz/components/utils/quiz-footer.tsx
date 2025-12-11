import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button } from "@app/components/ui/button";

import { useQuizFlow } from "../../quiz-context";

export const QuizFooter = () => {
    const { t } = useTranslation("full_trads");
    const {
        currentIndex,
        totalQuestions,
        canContinue,
        isLoading,
        goNext,
        completeQuiz,
    } = useQuizFlow();

    const isLastQuestion = currentIndex === totalQuestions - 1;

    const handleNext = useCallback(async () => {
        if (isLastQuestion) {
            await completeQuiz();
        } else {
            goNext();
        }
    }, [isLastQuestion, completeQuiz, goNext]);

    return (
        <View style={{ marginBottom: 12 }}>
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
        </View>
    );
};
