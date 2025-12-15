import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { InlineSelector } from "@components/ui/inline-selector";
import { NumberInput } from "@components/ui/input/number-input";
import {
    InputQuizProps,
    Option,
    QuizUserResponse,
    WeightUnit,
} from "@dtypes/quiz-types";
import { convertWeight, formatDisplayValue } from "@utils/convert-unit";

interface WeightBlockProps extends InputQuizProps {
    value: number;
    unitValue: WeightUnit;
    options: Option[];
}

export const WeightBlock = ({
    value,
    onChange,
    unitValue,
    options,
}: WeightBlockProps) => {
    const { t } = useTranslation("full_trads");
    const displayValue = formatDisplayValue(value, unitValue);

    const handleValueChange = useCallback(
        (val: number) => {
            if (isNaN(val) || val === null || val === undefined) {
                val = 0;
            }

            const roundedValue = Math.round(val * 5) / 5;

            onChange((prev: QuizUserResponse) => ({
                ...prev,
                weight: roundedValue,
            }));
        },
        [onChange],
    );

    const handleUnitChange = useCallback(
        (selectedUnit: WeightUnit) => {
            onChange((prev: QuizUserResponse) => {
                const currentWeight = prev.weight || 0;
                const currentUnit = prev.weight_unit || "kg";

                // Convert the weight value to the new unit
                const convertedWeight = convertWeight(
                    currentWeight,
                    currentUnit,
                    selectedUnit,
                );

                return {
                    ...prev,
                    weight: convertedWeight,
                    weight_unit: selectedUnit,
                };
            });
        },
        [onChange],
    );

    const units = useMemo(() => {
        return options.map((option) => ({
            value: option.text,
            label: t(`QUIZ.QUESTIONS.WEIGHT_OPTIONS.${option.text}`),
        }));
    }, [options, t]);

    return (
        <View style={{ gap: 32 }}>
            <InlineSelector
                options={units}
                onChange={(e: string) => handleUnitChange(e as WeightUnit)}
                value={unitValue}
            />

            <NumberInput
                key={unitValue}
                value={displayValue}
                onChangeText={handleValueChange}
                placeholder={t("QUIZ.QUESTIONS.WEIGHT_PLACEHOLDER")}
                allowDecimal={true}
            />
        </View>
    );
};
