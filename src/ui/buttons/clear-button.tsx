import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ResetIcon } from "../../../assets/icons/ResetIcon";

interface ClearButtonProps {
    onPress: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={[styles.button]} onPress={onPress}>
            <ResetIcon height={20} width={20} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 50,
        right: 15,
        zIndex: 1,
    },
});

export default ClearButton;
