import React from "react";
import { StyleSheet, View } from "react-native";

import { Message } from "@dtypes/chatbot/chatbot-types";

import { ImageMessage } from "./image-message";

interface AnimatedMessageWrapperProps {
    message: Message;
    isSendByUser: boolean;
    children: React.ReactNode;
}

export const AnimatedMessageWrapper: React.FC<AnimatedMessageWrapperProps> = ({
    message,
    isSendByUser,
    children,
}) => {
    const hasImage = message.imageUri && isSendByUser;

    return (
        <View style={styles.container}>
            {hasImage && (
                <View style={styles.imageWrapper}>
                    <ImageMessage
                        imageUri={message.imageUri!}
                        complexity={message.imageAnalysis?.complexity}
                        modelUsed={message.imageAnalysis?.modelUsed}
                    />
                </View>
            )}

            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    imageWrapper: {
        marginBottom: 4,
    },
});
