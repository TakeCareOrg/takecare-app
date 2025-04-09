import React from "react";
import { StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useColors } from "../../../styles/Colors";
import { MessageText } from "./message-text";

interface MessageBubbleProps {
    isSendByUser: boolean;
    messageText: string;
}

// MessageBubble Component
export const MessageBubble: React.FC<MessageBubbleProps> = ({
    isSendByUser,
    messageText,
}) => {
    const { chat } = useColors();

    const bubbleStyle = isSendByUser
        ? styles.userBubble
        : { ...styles.botBubble, backgroundColor: chat.aiMessageBackground };
    const gradientColors = isSendByUser
        ? chat.userMessageBackground
        : [chat.aiMessageBackground, chat.aiMessageBackground];

    return (
        <LinearGradient
            colors={gradientColors}
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
};

// Styles
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
