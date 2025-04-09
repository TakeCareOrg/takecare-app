import React, { useCallback } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { QuizUserResponse } from "../../../../types/quiz.types";
import { NextButton } from "../../../../ui/buttons/next-button";
import { SkipButton } from "../../../../ui/buttons/skip-button";

export const QuizFooter: React.FC<{
    step: string;
    updateUserResponse: (key: keyof QuizUserResponse, _value: any) => void;
    onContinue: () => void;
    onSave: () => void;
}> = ({ step, updateUserResponse, onContinue, onSave }) => {
    const handleChange = useCallback(
        (key: keyof QuizUserResponse, _value: any) => {
            updateUserResponse(key, _value);
            if (step !== "SelectGender") {
                onContinue();
            }
        },
        [updateUserResponse]
    );
    const { t } = useTranslation();

    return (
        <View style={{ marginBottom: 12, gap: 10 }}>
            {step === "SelectGender" && (
                <SkipButton
                    text={t("QUIZ.SKIP_BUTTON")}
                    onChange={() => handleChange("gender", "other")}
                />
            )}
            {step === "AlcoholBlock" && (
                <SkipButton
                    text={t("QUIZ.SKIP_BUTTON_ALCOHOL")}
                    onChange={() => handleChange("alcohol", "never")}
                />
            )}
            {step === "SmokeBlock" && (
                <SkipButton
                    text={t("QUIZ.SKIP_BUTTON_SMOKE")}
                    onChange={() => handleChange("smoking", "never")}
                />
            )}

            {step !== "SelectGender" && (
                <NextButton
                    handleSubmission={() =>
                        step === "EndMessage" ? onSave() : onContinue()
                    }
                />
            )}
        </View>
    );
};
