import React from "react";
import { View, StyleSheet } from "react-native";
import { TextComponent } from "../text-component";
import { CopyrightIcon } from "../../../assets/icons/CopyrightIcon";
import { useColors } from "../../styles/Colors";

const Copyright = () => {
    const { main } = useColors();

    return (
        <View style={styles.container}>
            <CopyrightIcon color={main.secondary} width={10} height={10} />
            <TextComponent
                color={main.secondary}
                font="Inter"
                letterSpacing={-0.25}
                fontSize={10}
            >
                Take Care
            </TextComponent>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        width: "100%",
    },
});

export default Copyright;
