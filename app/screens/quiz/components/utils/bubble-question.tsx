import React from "react";
import { View } from "react-native";

// import { PolygonBubbleIcon } from "@app/assets/icons/polygon-bubble";
import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";

type BubbleQuestionProps = {
    question: string;
};

export const BubbleQuestion = ({ question }: BubbleQuestionProps) => {
    const { text } = useColorTheme();
    return (
        <View
            style={{
                // backgroundColor: background,
                // paddingHorizontal: 20,
                // paddingVertical: 30,
                borderRadius: 20,
                // marginBottom: 10,
                // position: "relative",
            }}
        >
            <Text color={text} font="Inter-Medium" fontSize={15}>
                {question}
            </Text>
            {/* <View
                style={{
                    position: "absolute",
                    left: -20,
                    bottom: -4,
                }}
            >
                <PolygonBubbleIcon color={background} />
            </View> */}
        </View>
    );
};
