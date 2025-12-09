import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { useColorTheme } from "@hooks/use-color-theme";
import { useQuizFlow } from "../../quiz-context";

export const QuizHeader = () => {
    const { pastels } = useColorTheme();
    const { currentIndex, totalQuestions, canGoBack, goBack } = useQuizFlow();

    return (
        <View style={styles.quizHeader}>
            <View
                style={[
                    styles.numbers,
                    {
                        justifyContent:
                            currentIndex === 0 ? "flex-end" : "space-between",
                    },
                ]}
            >
                {canGoBack && (
                    <TouchableOpacity onPress={goBack}>
                        <Text style={{ fontSize: 24 }}>←</Text>
                    </TouchableOpacity>
                )}
                <View
                    style={[
                        styles.tag,
                        { backgroundColor: pastels.blueBackground },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color: pastels.blueText,
                            fontWeight: "bold",
                        }}
                    >
                        {currentIndex + 1} of {totalQuestions}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    quizHeader: {
        gap: 16,
    },
    numbers: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    tag: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 30,
    },
});
