import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { ChatIcon } from "../../../assets/icons/ChatIcon";
import { useColors } from "../../styles/Colors";
import { TabBg } from "../../../assets/svg/TabBg";

type props = {
    onPress: () => void;
};

const TabBarFloatButton: React.FC<props> = ({ ...props }) => {
    const { main, takecare } = useColors();

    return (
        <View style={styles.container} pointerEvents="box-none">
            <TabBg style={styles.background} />
            <TouchableOpacity style={styles.button} onPress={props.onPress}>
                <ChatIcon color={main.white} />
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: 75,
        alignItems: "center",
        elevation: 0,
    },
    background: {
        position: "absolute",
        top: 0,
    },
    button: {
        top: -22.5,
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        borderRadius: 27,
        // backgroundColor: takecare[0],
    },
});

// export default TabBarFloatButton;
// Export TabBarFloatButton and CustomTabBar
export { TabBarFloatButton };
