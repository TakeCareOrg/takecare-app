import React from "react";
import { FunctionComponent } from "react";
import { StyleSheet, TextStyle } from "react-native";
import { TextComponent } from "../text-component";
import { View } from "react-native";
import { padding } from "../../styles/global-style";

type TagProps = {
    tag: string;
    backgroundColor: string;
    color: string;
    style?: TextStyle;
    font?: "Urbanist" | "Techna" | "Inter";
    tagFontSize?: number;
};

export const TagComponent: FunctionComponent<TagProps> = ({
    tag,
    backgroundColor,
    color,
    style,
    font = "Techna",
    tagFontSize = 10,
}) => {
    return (
        <View
            style={[
                { backgroundColor: backgroundColor },
                style,
                styles.tagContainer,
            ]}
        >
            <TextComponent fontSize={tagFontSize} color={color} font={font}>
                {tag}
            </TextComponent>
        </View>
    );
};

const styles = StyleSheet.create({
    tagContainer: {
        borderRadius: 30,
        ...padding(5, 10),
    },
});
