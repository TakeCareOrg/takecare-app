import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { InlineSelector } from "@app/components/ui/inline-selector";
import { Text } from "@app/components/ui/text";
import { InputQuizProps, Option, QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

type StressLevelProps = InputQuizProps & {
    level?: number;
    options: Option[];
};

export const StressLevel = ({ level, options, onChange }: StressLevelProps) => {
    const handleSelect = useCallback(
        (value: string | number) => {
            onChange((prev: QuizUserResponse) => ({
                ...prev,
                stress_level: value as number,
            }));
        },
        [onChange],
    );

    const optionsSelector = useMemo(
        () =>
            options.map((option) => ({
                label: option.text,
                value: option.value.toString(),
            })),
        [options],
    );

    return (
        <View style={styles.container}>
            <Text font="Inter-Bold" fontSize={180}>
                {level || "-"}
            </Text>

            <InlineSelector
                options={optionsSelector}
                onChange={handleSelect}
                value={level?.toString() || ""}
            />
            {level && options && options[level - 1] && (
                <View
                    style={{
                        opacity: 0.5,
                        marginTop: 20,
                    }}
                >
                    <Text font="Poppins-Medium" fontSize={14}>
                        {options[level - 1].description}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
});
