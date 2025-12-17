import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";

interface ImageMessageProps {
    imageUri: string;
    complexity?: "simple" | "normal" | "complex";
    modelUsed?: string;
    onPress?: () => void;
}

export const ImageMessage: React.FC<ImageMessageProps> = ({
    imageUri,
    complexity,
    modelUsed,
    onPress,
}) => {
    const themeColors = useColorTheme();

    const getComplexityColor = () => {
        switch (complexity) {
            case "simple":
                return "#4CAF50";
            case "normal":
                return "#FF9800";
            case "complex":
                return "#F44336";
            default:
                return themeColors.grey;
        }
    };

    const getComplexityIcon = () => {
        switch (complexity) {
            case "simple":
                return "checkmark-circle";
            case "normal":
                return "alert-circle";
            case "complex":
                return "warning";
            default:
                return "image";
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={styles.imageContainer}
            >
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {complexity && (
                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: getComplexityColor() },
                        ]}
                    >
                        <Ionicons
                            name={getComplexityIcon()}
                            size={12}
                            color="white"
                        />
                        <Text style={styles.badgeText}>
                            {complexity.charAt(0).toUpperCase() +
                                complexity.slice(1)}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {modelUsed && (
                <View
                    style={[
                        styles.infoContainer,
                        { backgroundColor: themeColors.grey },
                    ]}
                >
                    <Ionicons
                        name="analytics-outline"
                        size={12}
                        color={
                            themeColors.isDark
                                ? themeColors.white[50]
                                : themeColors.black[500]
                        }
                    />
                    <Text
                        style={[
                            styles.infoText,
                            {
                                color: themeColors.isDark
                                    ? themeColors.white[50]
                                    : themeColors.black[500],
                            },
                        ]}
                    >
                        {modelUsed}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
    },
    imageContainer: {
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 12,
    },
    badge: {
        position: "absolute",
        top: 8,
        right: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    badgeText: {
        color: "white",
        fontSize: 10,
        fontWeight: "600",
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 4,
        gap: 4,
        alignSelf: "flex-start",
    },
    infoText: {
        fontSize: 10,
        fontWeight: "500",
    },
});
