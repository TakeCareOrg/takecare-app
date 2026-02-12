import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";

interface ThemeRaw {
    white: Record<number, string>;
    [key: string]: unknown;
}

interface VocalButtonProps {
    theme: { isDark: boolean; raw: ThemeRaw };
    medicalBlue: string;
    loading: boolean;
    onTouchStart: (evt: GestureResponderEvent) => void;
    onTouchMove: (evt: GestureResponderEvent) => void;
    onTouchEnd: (evt: GestureResponderEvent) => void;
    isRecording?: boolean;
    visible: boolean;
}

const CANCEL_RED = "#EF4444";

export const VocalButton = memo<VocalButtonProps>(
    ({
        theme,
        medicalBlue,
        loading,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        isRecording,
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
                        backgroundColor: isRecording
                            ? CANCEL_RED + "18"
                            : theme.isDark
                              ? theme.raw.white[500]
                              : theme.raw.white[100],
                        borderColor: isRecording
                            ? CANCEL_RED + "60"
                            : medicalBlue + "30",
                        borderWidth: 1.5,
                        opacity: loading ? 0.5 : 1,
                    },
                ]}
            >
                <Ionicons
                    name={isRecording ? "mic" : "mic-outline"}
                    size={24}
                    color={isRecording ? CANCEL_RED : medicalBlue}
                />
            </View>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.loading === nextProps.loading &&
            prevProps.visible === nextProps.visible &&
            prevProps.isRecording === nextProps.isRecording &&
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
    },
});
