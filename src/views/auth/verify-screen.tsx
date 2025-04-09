import React, { useRef, useState, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Linking,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "react-native-linear-gradient";
import { useColors } from "../../styles/Colors";
import axios from "axios";
import { BackArrowIcon } from "../../../assets/icons/BackArrowIcon";
import { useAuth } from "../../contexts/auth-context";
import useToast from "../../hooks/use-toast";
import { TextComponent } from "../../ui/text-component/index";
import CustomButton from "../../ui/buttons/custom-button";

export const VerifyScreen: React.FC = () => {
    const [code, setCode] = useState("");
    const [containerIsFocused, setContainerIsFocused] = useState(false);
    const [inputError, setInputError] = useState(false); // State for tracking input error
    const [buttonIsLoading, setButtonIsLoading] = useState(false);

    const { user, setUser } = useAuth();
    const CODE_LENGTH = 6;
    const colors = useColors();
    const toast = useToast();
    const { signOut } = useAuth();

    const ref = useRef<TextInput>(null);

    const handleOnPress = () => {
        Clipboard.getStringAsync().then((text) => {
            if (text.length === 6 && code !== text) {
                setCode(text);
                return;
            }
        });

        setContainerIsFocused(true);
        ref?.current?.focus();
    };

    const handleOnBlur = () => {
        setContainerIsFocused(false);
    };

    // Function to call when the code input is complete
    const handleComplete = () => {
        if (code.length !== CODE_LENGTH) {
            return;
        }

        if (!user?.email) {
            return;
        }
        setButtonIsLoading(true);

        axios
            .post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/verify-email`, {
                code,
                email: user?.email,
            })
            .then((response) => {
                setInputError(false); // Reset input error on success
                if (setUser) {
                    setUser({
                        ...user,
                        verified: response.data.verified,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                setInputError(true); // Trigger input error
                toast({
                    type: "error",
                    title: "Error",
                    message: "Incorrect code. Please try again.",
                });
            })
            .finally(() => setButtonIsLoading(false));
    };

    // Monitor changes to 'code' state to check if it's complete
    useEffect(() => {
        if (code.length === CODE_LENGTH) {
            handleComplete();
        }
    }, [code]);

    // Update code and reset input error
    const handleChangeText = (text: string) => {
        setCode(text);
        setInputError(false); // Reset input error when the user modifies the code
    };

    const toDigitInput = (value: string, idx: number) => {
        const emptyInputChar = " ";
        const digit = value || emptyInputChar;

        // Logic to determine if the field or previous fields should be highlighted in white
        const shouldHighlight =
            idx < code.length || (containerIsFocused && idx === code.length);

        const borderColor = inputError
            ? colors.main.magenta // Red color in case of error
            : shouldHighlight
            ? "white"
            : "#8E8E8E";

        const containerStyle = [
            style.inputContainer,
            { borderColor }, // Using the determined color
        ];

        return (
            <View key={idx} style={containerStyle}>
                <Text style={[style.inputText, { color: colors.main.white }]}>
                    {digit}
                </Text>
            </View>
        );
    };

    const resendCode = () => {
        axios
            .post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/resend-code`, {
                email: user?.email,
            })
            .then((res) => {
                toast({
                    type: "success",
                    title: "Success",
                    message: "Code sent successfully.",
                });
                console.log("res", res);
            })
            .catch((err) => {
                console.log("err", err);
                toast({
                    type: "error",
                    title: "Error",
                    message: "An error occurred. Please try again.",
                });
            });
    };

    const contactUs = () => {
        // Add logic to contact support
        return Linking.openURL(
            "mailto:takecareaimedical@gmail.com?subject=Err%20Verify%20Account%20Code&body=I%20have%20not%20received%20my%20validation%20code.",
        );
    };

    const handleSignOut = () => {
        signOut();
    };

    return (
        <LinearGradient
            colors={["rgba(52,111,153,1)", "rgba(116,135,207,1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={style.container}>
                <TouchableOpacity
                    onPress={handleSignOut}
                    style={style.backArrow}
                >
                    <BackArrowIcon />
                </TouchableOpacity>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
                >
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: "center",
                        }}
                    >
                        <View style={[style.mainView, { padding: 15 }]}>
                            <View style={{ backgroundColor: "transparent" }}>
                                <TextComponent
                                    color={colors.main.white}
                                    fontSize={32}
                                    style={{
                                        textAlign: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    Verify your account
                                </TextComponent>
                                <TextComponent color={colors.main.white}>
                                    A code was sent to your email. Please enter
                                    it below.
                                </TextComponent>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={style.inputsContainer}
                                    onPress={handleOnPress}
                                >
                                    {Array.from({ length: CODE_LENGTH }).map(
                                        (_, idx) =>
                                            toDigitInput(code[idx], idx),
                                    )}
                                </TouchableOpacity>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: 12,
                                    }}
                                >
                                    <TextComponent color={colors.main.white}>
                                        {"Didn't receive the code ?"}
                                    </TextComponent>
                                    <TouchableOpacity
                                        onPress={resendCode}
                                        style={{ paddingLeft: 10 }}
                                    >
                                        <TextComponent
                                            color={colors.pastels.lightBlueText}
                                        >
                                            Resend
                                        </TextComponent>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: 12,
                                    }}
                                >
                                    <TextComponent color={colors.main.white}>
                                        Problem with the code ?
                                    </TextComponent>
                                    <TouchableOpacity
                                        onPress={contactUs}
                                        style={{ paddingLeft: 10 }}
                                    >
                                        <TextComponent
                                            color={colors.pastels.lightBlueText}
                                        >
                                            Contact us
                                        </TextComponent>
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    ref={ref}
                                    value={code}
                                    onChangeText={handleChangeText}
                                    onBlur={handleOnBlur}
                                    onSubmitEditing={handleOnBlur}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    textContentType="oneTimeCode"
                                    maxLength={CODE_LENGTH}
                                    style={style.hiddenCodeInput}
                                />
                            </View>
                            <View style={{ paddingTop: "auto" }}>
                                <CustomButton
                                    disabled={code.length !== CODE_LENGTH}
                                    title="Verify"
                                    onPress={handleComplete}
                                    isLoading={buttonIsLoading}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    inputsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10, // Added padding to give space around inputs
    },
    inputContainer: {
        borderWidth: 2,
        borderRadius: 4,
        padding: 0,
        alignItems: "center", // Align content horizontally
        justifyContent: "center", // Align content vertically
        width: 40, // Fixed width for each digit
        height: 50, // Fixed height for each digit
    },
    inputContainerFocused: {
        borderColor: "white",
    },
    inputText: {
        fontSize: 24,
        fontFamily: "Menlo-Regular",
    },
    hiddenCodeInput: {
        position: "absolute",
        height: 0,
        width: 0,
        opacity: 0,
    },
    mainView: {
        flex: 1,
        justifyContent: "space-evenly",
    },
    backArrow: {
        alignSelf: "flex-start",
        marginLeft: 20,
        marginTop: 20,
    },
});
