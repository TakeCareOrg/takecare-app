import React, { useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { InputQuizProps, Option, QuizUserResponse } from "@dtypes/quiz-types";

import { GradientCheckbox } from "./utils/gradient-checkbox";

type HealthGoalsProps = InputQuizProps & {
    options: Option[];
    selectedGoals: string[];
};

export function HealthGoals({
    options,
    onChange,
    selectedGoals,
}: HealthGoalsProps) {
    const onCheckPressed = useCallback(
        (option: string) => {
            const isSelected = selectedGoals.includes(option);
            const newGoals = isSelected
                ? selectedGoals.filter((item) => item !== option)
                : [...selectedGoals, option];

            onChange((prev: QuizUserResponse) => ({
                ...prev,
                health_goal: newGoals,
            }));
        },
        [selectedGoals, onChange],
    );

    return (
        <ScrollView
            style={styles.containerButtons}
            showsVerticalScrollIndicator={false}
        >
            {options?.map((option, i) => (
                <GradientCheckbox
                    key={i}
                    item={option.text}
                    isSelected={selectedGoals.includes(option.value as string)}
                    onChange={() => onCheckPressed(option.value as string)}
                    rigthIcon={
                        selectedGoals.includes(option.value as string)
                            ? option.iconActive
                            : option.icon
                    }
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    containerButtons: {
        gap: 5,
    },

    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        marginVertical: 5,
        borderRadius: 50,
        backgroundColor: "white",
    },

    label: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
});
