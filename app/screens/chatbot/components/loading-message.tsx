import React from "react";
import { Image, StyleSheet, View } from "react-native";

import LoadingDots from "@components/ui/loading/loading-dots";

const DoctorIcon = require("@assets/img/chatbot/doctor-icon.jpeg");

export const LoadingMessage = () => {
    return (
        <View style={styles.container}>
            <Image source={DoctorIcon} style={styles.avatar} />
            <View
                style={[
                    styles.loadingContainer,
                    { backgroundColor: "#DFDFDF" },
                ]}
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

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
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
