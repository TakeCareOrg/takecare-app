import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@components/ui/button";
import { InputQuizProps, Option } from "@dtypes/quiz-types";

import { BoxItem } from "./utils/box-item";

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
            onChange((prev) => ({
                ...prev,
                [fieldKey]: selectedValue,
            }));
        },
        [onChange, fieldKey],
    );

    return (
        <View style={styles.container}>
            {options?.map((option, i) => (
                <BoxItem
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
