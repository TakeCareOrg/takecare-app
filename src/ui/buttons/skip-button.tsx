import React from "react";
import { StyleSheet, View } from "react-native";
import { CrossIcon } from "../../../assets/icons/CrossIcon";
import { useColors } from "../../styles/Colors";
import { TextComponent } from "../text-component";

export const SkipButton: React.FC<{
    text: string;
    onChange: (value: string) => void;
}> = ({ text, onChange }) => {
    const { main, quiz } = useColors();

    return (
        <View
            style={[
                styles.button,
                {
                    backgroundColor: quiz.graduationThird,
                },
            ]}
            onTouchStart={() => {
                onChange(text);
            }}
        >
            <TextComponent
                font="Urbanist"
                textWeight="extrabold"
                fontSize={18}
                color={main.blueGray}
            >
                {text}
            </TextComponent>
            <CrossIcon color={main.blueGray} width={24} height={24} />
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 16,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
        borderRadius: 50,
        flexDirection: "row",
        gap: 10,
    },
});
