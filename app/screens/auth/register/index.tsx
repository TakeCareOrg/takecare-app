import Feather from "@expo/vector-icons/Feather";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
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

import { useColorTheme } from "@app/hooks/use-color-theme";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useResponsive } from "@hooks/use-reponsive";
import { useAuthStore } from "@stores/auth";

import { AuthStackParamList } from "../../../../App";

const image = require("@app/assets/img/top-bubble-logo.png");

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;
const { width, height } = Dimensions.get("window");

export function RegisterScreen({ navigation }: Props) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    const register = useAuthStore((state) => state.register);
    const [user, setUser] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const responsiveMargin = useResponsive();

    // Define animated values for input fields
    const translateValues = {
        imageY: useSharedValue(-100),
        welcomeTextY: useSharedValue(100),
        emailInputY: useSharedValue(100),
        passwordInputY: useSharedValue(100),
        signInButtonY: useSharedValue(100),
        otherLoginY: useSharedValue(100),
        forgetPasswordY: useSharedValue(100),
    };

    useEffect(() => {
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
    }, [
        translateValues.emailInputY,
        translateValues.forgetPasswordY,
        translateValues.imageY,
        translateValues.otherLoginY,
        translateValues.passwordInputY,
        translateValues.signInButtonY,
        translateValues.welcomeTextY,
    ]);

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

    const welcomeTextStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateValues.welcomeTextY.value * 10 },
            ],
            textAlign: "center",
            fontSize: 24,
            color: colors.blue[200],
        };
    });

    const emailInputStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateValues.emailInputY.value * 10 }],
        };
    });

    const passwordInputStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateValues.passwordInputY.value * 10 },
            ],
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

    const otherLoginStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateValues.otherLoginY.value * 10 }],
            flexDirection: "row",
            justifyContent: "center",
            marginTop: responsiveMargin,
            columnGap: 8,
        };
    });

    const forgetPasswordStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateValues.forgetPasswordY.value * 10 },
            ],
        };
    });

    const handleRegister = async () => {
        try {
            await register(user.email, user.password, user.confirmPassword);
        } catch (err) {
            Alert.alert(
                "Registration Failed",
                err instanceof Error ? err.message : String(err),
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Animated.Image source={image} style={imageStyle} />

            <ScrollView
                style={{ paddingHorizontal: 20, marginTop: 125 }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                }}
            >
                <Animated.Text style={welcomeTextStyle}>
                    {t("AUTH.REGISTER.INTRO_TEXT")}
                </Animated.Text>
                <View style={{ marginTop: responsiveMargin, rowGap: 18 }}>
                    <Animated.View style={emailInputStyle}>
                        <Input
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
                                    color={colors.blue[200]}
                                />
                            }
                        />
                    </Animated.View>
                    <Animated.View style={passwordInputStyle}>
                        <Input
                            placeholder={t("AUTH.INPUTS.PASSWORD_PLACEHOLDER")}
                            value={user?.password}
                            onChangeText={(text) =>
                                setUser((prev) => ({ ...prev, password: text }))
                            }
                            keyboardType="default"
                            autoCapitalize="none"
                            isPassword={true}
                            leftIcon={
                                <Feather
                                    name="lock"
                                    size={18}
                                    color={colors.blue[200]}
                                />
                            }
                        />
                    </Animated.View>
                    <Animated.View style={passwordInputStyle}>
                        <Input
                            placeholder={t(
                                "AUTH.INPUTS.CONFIRM_PASSWORD_PLACEHOLDER",
                            )}
                            value={user?.confirmPassword}
                            onChangeText={(text) =>
                                setUser((prev) => ({
                                    ...prev,
                                    confirmPassword: text,
                                }))
                            }
                            keyboardType="default"
                            autoCapitalize="none"
                            isPassword={true}
                            leftIcon={
                                <Feather
                                    name="lock"
                                    size={18}
                                    color={colors.blue[200]}
                                />
                            }
                        />
                    </Animated.View>

                    <Animated.View style={signInButtonStyle}>
                        <Button
                            title={t("AUTH.REGISTER.REGISTER_TEXT")}
                            onPress={handleRegister}
                            variant="primary"
                        />
                        <TouchableOpacity
                            onPress={() => navigation.replace("Login")}
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: responsiveMargin,
                                columnGap: 3,
                            }}
                        >
                            <Text style={styles.log}>
                                {t("AUTH.REGISTER.ALREADY_HAVE_ACCOUNT")}
                            </Text>
                            <Text
                                style={[
                                    styles.log,
                                    { color: colors.blue[200] },
                                ]}
                            >
                                {t("AUTH.REGISTER.LOGIN_ACCOUNT")}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <Animated.View style={otherLoginStyle}>
                    {/* TODO: Implement Other Login Options */}
                </Animated.View>

                <Animated.View style={forgetPasswordStyle}>
                    {/* TODO: Implement Forgot Password */}
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    log: {
        fontSize: 12,
        color: "#736B66",
    },
});
