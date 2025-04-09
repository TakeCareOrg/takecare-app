import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Platform,
    Animated,
    Easing,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useColors } from "../../styles/Colors";
import { Input } from "@rneui/base";
import FileButton from "../buttons/file-button";
import PhotoButton from "../buttons/photo-button";

interface ChatInputProps {
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    onMessagePhotoReceived: (message: string) => void;
    onMessageFileReceived: (message: string) => void;
    onInputPressed: () => void;
    autoCorrect?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    placeholderTextColor?: string;
    multiline?: boolean;
    disabled?: boolean;
    loading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
    value,
    placeholder,
    onChangeText,
    onSend,
    onMessagePhotoReceived,
    onMessageFileReceived,
    onInputPressed,
    autoCorrect,
    autoCapitalize,
    placeholderTextColor,
    multiline,
    disabled,
    loading,
}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [showButtons, setShowButtons] = useState<boolean>(false);
    const [buttonsVisible, setButtonsVisible] = useState<boolean>(false);
    const { main } = useColors();

    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showButtons) {
            setButtonsVisible(true);
            Animated.timing(opacity, {
                toValue: 1,
                duration: 100,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start(() => setButtonsVisible(false));
        }
    }, [showButtons, opacity]);

    return (
        <View
            style={{
                ...styles.inputContainer,
                borderColor: main.primary,
                borderWidth: isFocused && Platform.OS === "ios" ? 2 : 1,
            }}
        >
            <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
                <TouchableOpacity
                    onPress={() => setShowButtons(!showButtons)}
                    style={styles.toggleButton}
                >
                    <Feather
                        name={showButtons ? "chevron-down" : "chevron-up"}
                        size={24}
                        color={main.primary}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Input
                        value={value}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                        autoCorrect={autoCorrect}
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                            width: "auto",
                            flex: 1,
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        errorStyle={{ display: "none" }}
                        autoCapitalize={autoCapitalize}
                        placeholderTextColor={placeholderTextColor}
                        multiline={multiline}
                        disabled={disabled || loading}
                        style={{ color: main.primary, fontSize: 14, flex: 1 }}
                    />
                </View>
                {buttonsVisible && (
                    <Animated.View
                        style={{ ...styles.buttonsContainer, opacity }}
                    >
                        <PhotoButton
                            onMessageReceived={onMessagePhotoReceived}
                            onInputPressed={onInputPressed}
                            loading={loading}
                        />
                        <FileButton
                            onMessageReceived={onMessageFileReceived}
                            onInputPressed={onInputPressed}
                            loading={loading}
                        />
                    </Animated.View>
                )}
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={onSend} disabled={loading}>
                    <Feather
                        name="send"
                        size={24}
                        color={loading ? "#AAAFB4" : main.primary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderRadius: 16,
        height: 48,
        marginVertical: 8,
    },
    actionsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    toggleButton: {
        padding: 8,
    },
});

export default ChatInput;
