import { useCallback } from "react";
import { ScrollView } from "react-native";

import { GradientCheckbox } from "@components/ui/checkbox/gradient-checkbox";
import { InputQuizProps, Option, QuizUserResponse } from "@dtypes/quiz-types";

type HealthGoalsProps = InputQuizProps & {
    options: Option[];
    selectedGoals: string[];
};

export const HealthGoals = ({
    options,
    onChange,
    selectedGoals,
}: HealthGoalsProps) => {
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
            style={{ flexGrow: 1, height: "100%" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
        >
            {options?.map((option, i) => (
                <GradientCheckbox
                    key={i}
                    item={option.text}
                    isSelected={selectedGoals.includes(option.value as string)}
                    onChange={() => onCheckPressed(option.value as string)}
                    icon={
                        selectedGoals.includes(option.value as string)
                            ? option.iconActive
                            : option.icon
                    }
                />
            ))}
        </ScrollView>
    );
};
