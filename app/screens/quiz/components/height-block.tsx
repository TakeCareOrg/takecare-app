import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { InlineSelector } from "@components/ui/inline-selector";
import { NumberInput } from "@components/ui/input/number-input";
import {
    HeightUnit,
    InputQuizProps,
    Option,
    QuizUserResponse,
} from "@dtypes/quiz-types";
import { convertHeight, formatDisplayValue } from "@utils/convert-unit";

type HeightBlockProps = InputQuizProps & {
    value: number;
    unitValue: HeightUnit;
    options: Option[];
};

export const HeightBlock = ({
    value,
    onChange,
    unitValue = "cm",
    options,
}: HeightBlockProps) => {
    const { t } = useTranslation("full_trads");

    const displayValue = formatDisplayValue(value, unitValue);

    const handleUnitChange = useCallback(
        (selectedUnit: HeightUnit) => {
            onChange((prev: QuizUserResponse) => {
                const currentHeight = prev.height || 0;
                const currentUnit = prev.height_unit || "cm";

                // Convert the height value to the new unit
                const convertedHeight = convertHeight(
                    currentHeight,
                    currentUnit,
                    selectedUnit,
                );

                return {
                    ...prev,
                    height: convertedHeight,
                    height_unit: selectedUnit,
                };
            });
        },
        [onChange],
    );

    const handleValueChange = useCallback(
        (selectedValue: number) => {
            if (
                isNaN(selectedValue) ||
                selectedValue === null ||
                selectedValue === undefined
            ) {
                selectedValue = 0;
            }

            const formattedValue = formatDisplayValue(selectedValue, unitValue);

            onChange((prev: QuizUserResponse) => ({
                ...prev,
                height: formattedValue,
            }));
        },
        [onChange, unitValue],
    );

    const units = useMemo(() => {
        return options.map((option) => ({
            value: option.text,
            label: t(`QUIZ.QUESTIONS.HEIGHT_OPTIONS.${option.text}`),
        }));
    }, [options, t]);

    return (
        <View style={{ gap: 32 }}>
            <InlineSelector
                options={units}
                onChange={(e: string) => handleUnitChange(e as HeightUnit)}
                value={unitValue as HeightUnit}
            />

            <NumberInput
                key={unitValue}
                value={displayValue}
                onChangeText={handleValueChange}
                placeholder="Enter your height"
                allowDecimal={true}
            />
        </View>
    );
};
