import { useTranslation } from "react-i18next";
import {
    Text as RNText,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";

import { useQuizFlow } from "../../../contexts/quiz/quiz-context";

export const QuizHeader = () => {
    const { t } = useTranslation("full_trads");
    const { blue, text } = useColorTheme();
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
                        <RNText style={{ fontSize: 24, color: text }}>←</RNText>
                    </TouchableOpacity>
                )}
                <View style={[styles.tag, { backgroundColor: blue[100] }]}>
                    <Text fontSize={14} weight="600">
                        {t("COMMON.QUESTION")} {currentIndex + 1}{" "}
                        {t("COMMON.OF")} {totalQuestions}
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
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 30,
    },
});
