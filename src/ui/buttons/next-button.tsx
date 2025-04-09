import { StyleSheet, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { TextComponent } from "../text-component";
import { ArrowRightIcon } from "../../../assets/icons/ArrowRightIcon";
import { useColors } from "../../styles/Colors";

export const NextButton = ({
    handleSubmission,
}: {
    handleSubmission: () => void;
}) => {
    const { t } = useTranslation();
    const { main, chat } = useColors();

    return (
        <View
            style={[
                styles.button,
                {
                    backgroundColor: chat.chatInput,
                },
            ]}
            onTouchStart={() => {
                handleSubmission();
            }}
        >
            <TextComponent
                font="Urbanist"
                textWeight="extrabold"
                fontSize={18}
                color={main.white}
            >
                {t("QUIZ.CONTINUE_BUTTON")}
            </TextComponent>
            <ArrowRightIcon color={main.white} width={24} height={24} />
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
