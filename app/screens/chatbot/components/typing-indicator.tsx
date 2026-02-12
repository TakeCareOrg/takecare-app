import React from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";
import { MessageAvatar } from "@screens/chatbot/components/message-avatar";

import { AnimatedDots } from "./animated-dots";

export const TypingIndicator = () => {
    const theme = useColorTheme();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MessageAvatar isSendByUser={false} />
                <Text style={styles.nameText}>AI Doc</Text>
            </View>
            <View
                style={[
                    styles.bubble,
                    {
                        backgroundColor: theme.isDark ? theme.grey : theme.box,
                    },
                ]}
            >
                <AnimatedDots color={theme.text} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        alignItems: "flex-start",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 2,
    },
    nameText: {
        fontSize: 14,
        fontWeight: "600",
    },
    bubble: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 18,
        borderTopLeftRadius: 4,
        marginLeft: 4,
        marginBottom: 16,
    },
});
