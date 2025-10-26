import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";

interface VocalButtonProps {
    theme: { isDark: boolean; raw: any };
    medicalBlue: string;
    loading: boolean;
    onTouchStart: (evt: GestureResponderEvent) => void;
    onTouchMove: (evt: GestureResponderEvent) => void;
    onTouchEnd: (evt: GestureResponderEvent) => void;
    visible: boolean;
}

export const VocalButton = memo<VocalButtonProps>(
    ({
        theme,
        medicalBlue,
        loading,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        visible,
    }) => {
        if (!visible) return null;

        return (
            <View
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd}
                style={[
                    styles.vocalButton,
                    {
                        backgroundColor: theme.isDark
                            ? theme.raw.grey[800]
                            : theme.raw.grey[100],
                        borderColor: medicalBlue + "30",
                        borderWidth: 1.5,
                        opacity: loading ? 0.5 : 1,
                    },
                ]}
            >
                <Ionicons name="mic-outline" size={24} color={medicalBlue} />
            </View>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.loading === nextProps.loading &&
            prevProps.visible === nextProps.visible &&
            prevProps.theme === nextProps.theme &&
            prevProps.medicalBlue === nextProps.medicalBlue
        );
    },
);

VocalButton.displayName = "VocalButton";

const styles = StyleSheet.create({
    vocalButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});
