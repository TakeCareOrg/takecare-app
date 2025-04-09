import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { TextComponent } from "../text-component";
import { row } from "../../styles/global-style";
import { useColors } from "../../styles/Colors";
import { VisibilityContext } from "../../contexts/visibility-context";

type ModalInputProps = {
    onClose?: () => void;
    children: React.ReactNode;
};

const ModalInput = ({ onClose, children }: ModalInputProps) => {
    const { toggleVisibility, toggleInvisibility } =
        useContext(VisibilityContext);

    const styles = ModalBottomStyles();
    const { main } = useColors();

    useEffect(() => {
        toggleInvisibility();
        return () => {
            toggleVisibility();
        };
    }, []);

    return (
        <View style={styles.overlay}>
            <View
                style={[
                    StyleSheet.absoluteFill, // Ensures the container ignores parent's padding
                    styles.container,
                    {
                        backgroundColor: main.container,
                    },
                ]}
            >
                <View style={[{ ...row.row }, styles.buttonsContainer]}>
                    <TextComponent fontSize={20} onPress={onClose}>
                        Close
                    </TextComponent>
                </View>
                {children}
            </View>
        </View>
    );
};

function ModalBottomStyles() {
    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1000,
        },
        container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            minHeight: 300,
            zIndex: 1001,
        },
        buttonsContainer: {
            justifyContent: "center",
            alignItems: "flex-end",
            marginTop: "auto",
            gap: 20,
            marginBottom: 25,
            paddingTop: 50,
        },
    });

    return styles;
}

export default ModalInput;
