import { View } from "react-native";
import React from "react";
import { Colors } from "../../../../styles/Colors";
import { padding } from "../../../../styles/global-style";
import { TextComponent } from "../../../../ui/text-component";
import { PolygonBubbleIcon } from "../../../../assets/images/PolygonBubble";

type BubbleQuestionProps = {
    question: string;
};

export const BubbleQuestion = ({ question }: BubbleQuestionProps) => {
    const { quiz } = Colors();
    return (
        <View
            style={{
                backgroundColor: quiz.questionBackground,
                ...padding(20, 30),
                borderRadius: 20,
                marginBottom: 10,
                position: "relative",
            }}
        >
            <TextComponent
                color={quiz.question}
                font="Inter"
                textWeight="medium"
                fontSize={15}
            >
                {question}
            </TextComponent>
            <View
                style={{
                    position: "absolute",
                    left: -20,
                    bottom: -4,
                }}
            >
                <PolygonBubbleIcon color={quiz.questionBackground} />
            </View>
        </View>
    );
};
