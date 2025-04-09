import React from "react";
import { StyleSheet, View } from "react-native";
import { useColors } from "../../../../styles/Colors";
import { PreviousButton } from "../../../../ui/buttons/previous-button";
import { TextComponent } from "../../../../ui/text-component";
import { QuestionsQuiz } from "../../../../utils/questions-quiz";
import { BubbleQuestion } from "./bubble-question";

export const QuizHeader: React.FC<{
    onPrevious: () => void;
    indexQ: number;
}> = ({ onPrevious, indexQ }) => {
    const { pastels } = useColors();
    const questions = QuestionsQuiz();

    return (
        <View style={styles.quizHeader}>
            <View
                style={[
                    styles.numbers,
                    {
                        justifyContent:
                            indexQ === 0 ? "flex-end" : "space-between",
                    },
                ]}
            >
                {indexQ > 0 && <PreviousButton handlePrevious={onPrevious} />}
                <View
                    style={[
                        styles.tag,
                        { backgroundColor: pastels.blueBackground },
                    ]}
                >
                    <TextComponent
                        fontSize={14}
                        color={pastels.blueText}
                        textWeight="bold"
                        font="Urbanist"
                        letterSpacing={-0.2}
                    >
                        {indexQ + 1} of {questions.length}
                    </TextComponent>
                </View>
            </View>
            <BubbleQuestion question={questions[indexQ].question} />
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
