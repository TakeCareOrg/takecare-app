import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Feather from "react-native-vector-icons/Feather";
import { BackArrowIcon } from "../../../assets/icons/BackArrowIcon";
import { useAuth } from "../../contexts/auth-context";
import useToast from "../../hooks/use-toast";
import { NavigateProps } from "../../types/router.types";
import CustomButton from "../../ui/buttons/custom-button";
import CustomInput from "../../ui/inputs/custom-input";

import TopBubbleLogo from "../../../assets/images/top_bubble_logo.png";

const { width, height } = Dimensions.get("window");
type userStateProps = {
    email: string;
    password: string;
    confirmPassword: string;
};

export const ForgotPasswordScreen: React.FC<NavigateProps> = ({
    navigation,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [enteredCode, setEnteredCode] = useState("");
    const [countDown, setCountDown] = useState(0);
    const toast = useToast();
    const { t } = useTranslation();

    const { forgotPassword, changePassword } = useAuth();

    // Renders
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (countDown > 0) {
            interval = setInterval(() => {
                setCountDown((prevCountDown) => prevCountDown - 1);
            }, 1000);
        } else if (countDown === 0 && isLoading) {
            setIsLoading(false);
        }
        translateValues.imageY.value = withTiming(0, {
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        translateValues.welcomeTextY.value = withTiming(0, {
            duration: 1100,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        translateValues.emailInputY.value = withTiming(0, {
            duration: 1200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        translateValues.passwordInputY.value = withTiming(0, {
            duration: 1300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        translateValues.signInButtonY.value = withTiming(0, {
            duration: 1400,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        translateValues.otherLoginY.value = withTiming(0, {
            duration: 1500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        translateValues.forgetPasswordY.value = withTiming(0, {
            duration: 1600,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });

        return () => clearInterval(interval);
    }, [countDown]);

    const handleSignIn = () => {
        if (user.password !== user.confirmPassword) {
            toast({
                type: "error",
                title: "Error",
                message: "Passwords do not match",
            });
            return;
        }
        changePassword(user.email, enteredCode, user.password)
            .then(() => {
                toast({
                    type: "success",
                    title: "Success",
                    message: "Password changed successfully",
                });
                navigation.navigate("Login");
            })
            .catch((error) => {
                toast({
                    type: "error",
                    title: "Error",
                    message: error.response.data.message,
                });
            });
    };

    const [user, setUser] = useState<userStateProps>({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const translateValues = {
        imageY: useSharedValue(-100),
        welcomeTextY: useSharedValue(100),
        emailInputY: useSharedValue(100),
        passwordInputY: useSharedValue(100),
        signInButtonY: useSharedValue(100),
        otherLoginY: useSharedValue(100),
        forgetPasswordY: useSharedValue(100),
    };

    const imageStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateValues.imageY.value * 10 }],
            width: width,
            height: height / 4.5,
            resizeMode: "cover",
            position: "absolute",
            top: -20,
        };
    });

    const responsiveMargin = useMemo(() => {
        return height < 700 ? 12 : 16;
    }, [height]);

    const welcomeTextStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateValues.welcomeTextY.value * 10 },
            ],
            fontFamily: "Poppins-SemiBold",
            textAlign: "center",
            fontSize: 24,
            color: "#7889D2",
        };
    });

    const emailInputStyle = useAnimatedStyle(() => {
        return {
            flex: 1,
            flexDirection: "row",
            transform: [{ translateY: translateValues.emailInputY.value * 10 }],
        };
    });

    const signInButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateValues.signInButtonY.value * 10 },
            ],
            flexDirection: "column",
            justifyContent: "center",
            marginTop: responsiveMargin,
        };
    });

    const sendEmail = () => {
        setIsLoading(true);
        forgotPassword(user.email);
        setCountDown(60);
        setIsLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Animated.Image source={TopBubbleLogo} style={imageStyle} />
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackArrowIcon
                    width={30}
                    height={30}
                    style={{
                        marginRight: 15,
                    }}
                    color="white"
                />
            </TouchableOpacity>

            <ScrollView
                style={{ paddingHorizontal: 20 }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                }}
            >
                <Animated.Text style={welcomeTextStyle}>
                    {t("AUTH.FORGOT_PASSWORD.INTRO_TEXT")}
                </Animated.Text>
                <View style={{ marginTop: responsiveMargin, rowGap: 18 }}>
                    <Animated.View style={emailInputStyle}>
                        <CustomInput
                            label={t("AUTH.INPUTS.EMAIL_LABEL")}
                            placeholder={t("AUTH.INPUTS.EMAIL_PLACEHOLDER")}
                            value={user?.email}
                            onChangeText={(text) =>
                                setUser((prev) => ({ ...prev, email: text }))
                            }
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leftIcon={
                                <Feather
                                    name="mail"
                                    size={18}
                                    color="#7889D2"
                                    style={{ padding: 10 }}
                                />
                            }
                            rightIcon={
                                isLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#7889D2"
                                    />
                                ) : countDown > 0 ? (
                                    <Text style={styles.timer}>
                                        {countDown}
                                    </Text>
                                ) : (
                                    <Feather
                                        name="send"
                                        size={18}
                                        color="#7889D2"
                                        style={{ padding: 10 }}
                                        onPress={() => sendEmail()}
                                    />
                                )
                            }
                        />
                    </Animated.View>
                </View>
                <Animated.View style={signInButtonStyle}>
                    <CustomInput
                        label={t("AUTH.FORGOT_PASSWORD.CODE_LABEL")}
                        placeholder={t("AUTH.FORGOT_PASSWORD.CODE_PLACEHOLDER")}
                        value={enteredCode}
                        onChangeText={(text) => setEnteredCode(text)}
                        autoCapitalize="none"
                        keyboardType="default"
                        leftIcon={
                            <Feather
                                name="key"
                                size={18}
                                color="#7889D2"
                                style={{ padding: 10 }}
                            />
                        }
                    />
                </Animated.View>
                <Animated.View style={signInButtonStyle}>
                    <CustomInput
                        label={t("AUTH.INPUTS.PASSWORD_LABEL")}
                        placeholder={t("AUTH.INPUTS.PASSWORD_PLACEHOLDER")}
                        value={user?.password}
                        onChangeText={(text) =>
                            setUser((prev) => ({ ...prev, password: text }))
                        }
                        secureTextEntry
                        leftIcon={
                            <Feather
                                name="lock"
                                size={18}
                                color="#7889D2"
                                style={{ padding: 10 }}
                            />
                        }
                    />
                    <CustomInput
                        label={t("AUTH.INPUTS.CONFRIM_PASSWORD_LABEL")}
                        placeholder={t(
                            "AUTH.INPUTS.CONFRIM_PASSWORD_PLACEHOLDER",
                        )}
                        value={user?.confirmPassword}
                        onChangeText={(text) =>
                            setUser((prev) => ({
                                ...prev,
                                confirmPassword: text,
                            }))
                        }
                        secureTextEntry
                        leftIcon={
                            <Feather
                                name="lock"
                                size={18}
                                color="#7889D2"
                                style={{ padding: 10 }}
                            />
                        }
                    />
                </Animated.View>
                <Animated.View style={signInButtonStyle}>
                    <CustomButton
                        title={t("AUTH.FORGOT_PASSWORD.SEND_EMAIL_TEXT")}
                        onPress={handleSignIn}
                        customStyle={{ marginTop: responsiveMargin }}
                        disabled={
                            isLoading ||
                            user.password !== user.confirmPassword ||
                            !enteredCode ||
                            !user.email ||
                            !user.password ||
                            !user.confirmPassword
                        }
                    />
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    log: {
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        color: "#736B66",
    },
    timer: {
        fontWeight: "bold",
        color: "#7889D2",
    },
});
