import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { TextComponent } from "../text-component";
import { row } from "../../styles/global-style";
import { Button } from "../buttons/button";
import { useColors } from "../../styles/Colors";
import { VisibilityContext } from "../../contexts/visibility-context";

type ModalProps = {
    onClose?: () => void;
    children: React.ReactNode;
    onAccept: () => void;
    title: string;
    acceptText: string;
    closeText?: string;
    closeColor?: string;
    acceptColor?: string;
    error?: string;
};

const ModalBottom = ({
    onClose,
    children,
    onAccept,
    title,
    acceptText,
    closeText,
    closeColor,
    acceptColor,
    error,
}: ModalProps) => {
    // States
    const { toggleVisibility, toggleInvisibility } =
        useContext(VisibilityContext);

    if (!onClose && closeText) {
        throw new Error("onClose is required if cancelText is provided");
    }
    if (onClose && !closeText) {
        throw new Error("cancelText is required if onClose is provided");
    }

    const styles = ModalBottomStyles();
    const { main } = useColors();

    useEffect(() => {
        toggleInvisibility();
        return () => {
            toggleVisibility();
        };
    }, []);

    return (
        <View
            style={styles.layout}
            // for later use
            /* onTouchStart={() => {
                onClose && onClose();
            }} */
        >
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: main.container,
                    },
                ]}
            >
                <TextComponent fontSize={18} style={{ marginBottom: 24 }}>
                    {title}
                </TextComponent>
                {children}
                {error && (
                    <TextComponent
                        color={main.red}
                        fontSize={13}
                        font="Urbanist"
                        textWeight="bold"
                        style={{
                            marginTop: 30,
                            letterSpacing: 1,
                            lineHeight: 20,
                        }}
                    >
                        {error}
                    </TextComponent>
                )}
                <View style={[{ ...row.row }, styles.buttonsContainer]}>
                    {onClose && closeText && (
                        <Button
                            title={closeText}
                            onPress={onClose}
                            style={{ marginRight: 10 }}
                            backgroundColor={closeColor || main.red}
                        />
                    )}
                    <Button
                        title={acceptText}
                        onPress={onAccept}
                        style={{ marginRight: 10 }}
                        backgroundColor={acceptColor || main.button}
                    />
                </View>
            </View>
        </View>
    );
};

function ModalBottomStyles() {
    const styles = StyleSheet.create({
        layout: {
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

export default ModalBottom;
