import { StyleSheet, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { useColors } from "../../styles/Colors";
import { BackArrowIcon } from "../../../assets/icons/BackArrowIcon";
import { TextComponent } from "../text-component";

export const PreviousButton = ({
    handlePrevious,
}: {
    handlePrevious: () => void;
}) => {
    const { main } = useColors();
    const { t } = useTranslation();
    return (
        <View style={styles.container} onTouchStart={handlePrevious}>
            <BackArrowIcon width={24} height={24} color={main.primary} />
            <TextComponent
                fontSize={16}
                color={main.primary}
                font="Urbanist"
                textWeight="bold"
                letterSpacing={0.25}
            >
                {t("QUIZ.PREVIOUS_BUTTON")}
            </TextComponent>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        zIndex: 100,
    },
});
