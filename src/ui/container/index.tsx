import React from "react";
import { FunctionComponent } from "react";
import {
    Dimensions,
    DimensionValue,
    TextStyle,
    TouchableOpacity,
} from "react-native";
import { TextComponent } from "../text-component";
import { useColors } from "../../styles/Colors";
import ContainerStyle from "../../styles/container-style";
import { View } from "react-native";
import { TagComponent } from "../tag-component";
import { useNavigation } from "@react-navigation/native";
import { InfosIcon } from "../../../assets/icons/InfosIcon";
import { Advice } from "../../types/advice.types";
import { AdviceComponent } from "../advice-component";

type SmallContainerProps = {
    title?: string;
    children: React.ReactNode;
    tagContent?: string;
    style?: TextStyle;
    tagBackgroundColor?: string;
    tagColor?: string;
    width?: DimensionValue;
    height?: DimensionValue;
    flex?: number;
    borderWidth?: number;
    borderColor?: string;
    infoLink?: string;
    advice?: Advice;
    preset?: "default" | "little" | "medium";
    colorTitle?: string;
    tagFontSize?: number;
};

export const Container: FunctionComponent<SmallContainerProps> = ({
    title,
    children,
    tagContent,
    style,
    tagBackgroundColor,
    tagColor,
    width = "100%",
    height = Dimensions.get("window").height / 5,
    flex = 0,
    borderWidth = 0,
    borderColor,
    infoLink,
    advice,
    colorTitle,
    tagFontSize,
}) => {
    const containerStyle = ContainerStyle();
    const navigation = useNavigation();
    const { main, pastels } = useColors();

    if (tagContent && infoLink) {
        console.error(
            "Error: Both 'tagContent' and 'infoContent' cannot be provided simultaneously. Please provide only one of them.",
        );
        return null;
    }

    return (
        <View
            style={[
                style,
                {
                    borderWidth: borderWidth,
                    borderColor: borderColor || main.primary,
                },
                containerStyle.container,
            ]}
        >
            <View style={containerStyle.header}>
                {title && (
                    <TextComponent
                        fontSize={18}
                        color={colorTitle ? colorTitle : main.containerTitle}
                    >
                        {title}
                    </TextComponent>
                )}
                {tagContent && (
                    <TagComponent
                        tag={tagContent}
                        backgroundColor={
                            tagBackgroundColor || pastels.blueBackground
                        }
                        color={tagColor || pastels.blueText}
                        tagFontSize={tagFontSize}
                    />
                )}
                {infoLink && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate(infoLink as never)}
                    >
                        <InfosIcon
                            color={main.containerTitle}
                            height={20}
                            width={20}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {advice && (
                <AdviceComponent
                    text={advice.text}
                    backgroundColor={advice.backgroundColor}
                    color={advice.color}
                    infoAction={advice.infoAction}
                />
            )}
            <View>{children}</View>
        </View>
    );
};
