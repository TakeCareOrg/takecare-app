import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { TextComponent } from "../text-component";
import { InfosIcon } from "../../../assets/icons/InfosIcon";
import { Advice } from "../../types/advice.types";
import { padding } from "../../styles/global-style";

export const AdviceComponent = ({
    text,
    backgroundColor,
    color,
    infoAction,
}: Advice) => {
    useEffect(() => {}, []);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: backgroundColor,
                },
            ]}
        >
            <InfosIcon width={30} height={30} color={color} />
            <View style={styles.textContainer}>
                <TextComponent color={color} font="Inter" fontSize={12}>
                    {text}
                </TextComponent>
                {infoAction && (
                    <TextComponent
                        onPress={infoAction}
                        color={color}
                        font="Inter"
                        textWeight="bold"
                        fontSize={12}
                    >
                        Learn More
                    </TextComponent>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        ...padding(7, 20),
        borderRadius: 10,
        gap: 10,
        marginBottom: 10,
    },

    textContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 7,
        flex: 1,
    },
});
