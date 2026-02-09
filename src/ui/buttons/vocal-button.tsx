import React, { useRef, useEffect } from "react";
import {
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    View,
} from "react-native";
import { useColors } from "../../styles/Colors";
import { VocalIcon } from "../../../assets/icons/VocalIcon";

interface VocalButtonProps {
    isRecording: boolean;
    isTranscribing: boolean;
    isReady: boolean;
    onPressIn: () => void;
    onPressOut: () => void;
    loading?: boolean;
}

const VocalButton: React.FC<VocalButtonProps> = ({
    isRecording,
    isTranscribing,
    isReady,
    onPressIn,
    onPressOut,
    loading,
}) => {
    const { main } = useColors();
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

    // Pulse animation while recording
    useEffect(() => {
        if (isRecording) {
            pulseLoop.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.25,
                        duration: 600,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            );
            pulseLoop.current.start();
        } else {
            pulseLoop.current?.stop();
            pulseAnim.setValue(1);
        }

        return () => {
            pulseLoop.current?.stop();
        };
    }, [isRecording, pulseAnim]);

    const disabled = loading || isTranscribing || !isReady;

    const getIconColor = () => {
        if (disabled) return "#AAAFB4";
        if (isRecording) return "#FF4444";
        return main.primary;
    };

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    style={[
                        styles.button,
                        isRecording && styles.recordingButton,
                    ]}
                    disabled={disabled}
                    activeOpacity={0.7}
                >
                    <VocalIcon
                        color={getIconColor()}
                        height={24}
                        width={24}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        padding: 4,
        borderRadius: 20,
    },
    recordingButton: {
        backgroundColor: "rgba(255, 68, 68, 0.1)",
    },
});

export default VocalButton;
