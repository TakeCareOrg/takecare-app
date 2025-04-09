import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { useColors } from "../../styles/Colors";

const Loading: React.FC = () => {
    const { main } = useColors();
    return (
        <LinearGradient
            colors={["rgba(52,111,153,1)", "rgba(116,135,207,1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color={main.white} />
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Loading;
