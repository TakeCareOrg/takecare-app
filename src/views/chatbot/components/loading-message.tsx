import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useColors } from "../../../styles/Colors";
import LoadingDots from "../../../ui/loading/loading-dots";
import DoctorIcon from "../../../../assets/images/doctor-icon.jpeg";

export const LoadingMessage = () => {
    const { chat } = useColors();

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={DoctorIcon} style={{ ...styles.avatar }} />
            <View
                style={{
                    ...styles.loadingContainer,
                    backgroundColor: chat.aiMessageBackground,
                }}
            >
                <LoadingDots
                    size={8}
                    dots={3}
                    colors={["#0C0C0C", "#0C0C0C", "#0C0C0C"]}
                    bounceHeight={8}
                />
            </View>
        </View>
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
    messageContainer: {
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginVertical: 8,
        borderBottomLeftRadius: 0,
        width: "20%",
        height: 40,
    },
});
