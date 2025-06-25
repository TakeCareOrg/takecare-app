import React from "react";
import { StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { MessageText } from "./message-text";

interface MessageBubbleProps {
    isSendByUser: boolean;
    messageText: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    isSendByUser,
    messageText,
}) => {
    const bubbleStyle = isSendByUser ? styles.userBubble : styles.botBubble;

    if (isSendByUser) {
        return (
            <LinearGradient
                colors={["#3E73A1", "#5A82FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.chatBubble, bubbleStyle]}
            >
                <MessageText
                    isSendByUser={isSendByUser}
                    messageText={messageText}
                />
            </LinearGradient>
        );
    } else {
        return (
            <View
                style={[
                    styles.chatBubble,
                    bubbleStyle,
                    { backgroundColor: "#DFDFDF" },
                ]}
            >
                <MessageText
                    isSendByUser={isSendByUser}
                    messageText={messageText}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    chatBubble: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginVertical: 8,
        maxWidth: "90%",
    },
    userBubble: {
        alignSelf: "flex-end",
        borderBottomRightRadius: 0,
    },
    botBubble: {
        alignSelf: "flex-start",
        borderBottomLeftRadius: 0,
        maxWidth: "80%",
    },
});
