import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MessageBubbleProps {
    message?: string;
    customStyle?: object;
    fontSize?: number;
    borderRadius?: "left" | "right";
    customMessage?: JSX.Element | null | undefined | boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    customStyle,
    fontSize,
    borderRadius,
    customMessage,
}) => {
    return (
        <View
            style={{
                ...styles.container,
                ...customStyle,
                ...{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderBottomLeftRadius: borderRadius === "right" ? 20 : 0,
                    borderBottomRightRadius: borderRadius === "left" ? 20 : 0,
                },
            }}
        >
            {customMessage ? (
                customMessage
            ) : (
                <Text
                    style={{
                        ...styles.text,
                        ...{
                            fontSize: fontSize ? fontSize : 16,
                        },
                    }}
                >
                    {message}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: "#f2f2f2",
        minHeight: 48,
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
    },
});
