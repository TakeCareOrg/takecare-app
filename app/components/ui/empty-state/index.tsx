import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { useColorTheme } from "@app/hooks/use-color-theme";

import { Box } from "../box";
import { Text } from "../text";

interface EmptyStateProps {
    icon: ReactNode;
    iconColor?: string;
    title: string;
    message: string;
    inline?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    message,
    inline = false,
}) => {
    const colors = useColorTheme();

    const content = (
        <View style={styles.content}>
            <View style={styles.iconContainer}>{icon}</View>
            <Text fontSize={18} weight="600" style={styles.title}>
                {title}
            </Text>
            <Text fontSize={14} color={colors.secondary} style={styles.message}>
                {message}
            </Text>
        </View>
    );

    if (inline) {
        return content;
    }

    return <Box style={styles.container}>{content}</Box>;
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    content: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    iconContainer: {
        opacity: 0.5,
    },
    title: {
        textAlign: "center",
    },
    message: {
        textAlign: "center",
        lineHeight: 20,
        maxWidth: 280,
    },
});
