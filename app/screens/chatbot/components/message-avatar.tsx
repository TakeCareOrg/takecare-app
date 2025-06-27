import React from "react";
import { Image, StyleSheet } from "react-native";

const AIIcon = require("@assets/img/chatbot/ai-blob.png");

interface MessageAvatarProps {
    isSendByUser: boolean;
}

export const MessageAvatar: React.FC<MessageAvatarProps> = ({
    isSendByUser,
}) => {
    if (isSendByUser) return null;
    return <Image source={AIIcon} style={styles.avatar} />;
};

const styles = StyleSheet.create({
    avatar: {
        width: 60,
        height: 60,
    },
});
