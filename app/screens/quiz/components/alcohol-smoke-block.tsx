import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@app/components/ui/button";
import { InputQuizProps, Option, QuizUserResponse } from "@dtypes/quiz-types";

import { AlcoholSmokeItem } from "./utils/alcohol-smoke-item";

type AlcoholSmokeBlockProps = InputQuizProps & {
    options: Option[];
    value?: string;
    fieldKey: "alcohol" | "smoking";
};

export const AlcoholSmokeBlock = ({
    options,
    onChange,
    value,
    fieldKey,
}: AlcoholSmokeBlockProps) => {
    const { t } = useTranslation("full_trads");

    const handleChange = useCallback(
        (selectedValue: string | number) => {
            onChange((prev: QuizUserResponse) => ({
                ...prev,
                [fieldKey]: selectedValue,
            }));
        },
        [onChange, fieldKey],
    );

    return (
        <View style={styles.container}>
            {options?.map((option, i) => (
                <AlcoholSmokeItem
                    key={i}
                    option={option}
                    onChange={handleChange}
                    value={value}
                />
            ))}
            <Button
                title={
                    fieldKey === "alcohol"
                        ? t("QUIZ.SKIP_BUTTON_ALCOHOL")
                        : t("QUIZ.SKIP_BUTTON_SMOKE")
                }
                onPress={() => handleChange("never")}
                variant={value === "never" ? "primary" : "outline"}
                style={{ marginTop: 10, width: "100%" }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
    },
});
