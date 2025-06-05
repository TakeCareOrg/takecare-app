import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    StyleSheet,
    ScrollView,
    Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useAuthStore } from "@stores/auth";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Input } from "@app/components/ui/input";
import Feather from "@expo/vector-icons/Feather";
import { Button } from "@app/components/ui/button";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;
const { width, height } = Dimensions.get("window");

export function LoginScreen({ navigation }: Props) {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const login = useAuthStore((state) => state.login);
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

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
    }, []);

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

    const handleLogin = async () => {
        try {
            await login(user.email, user.password);
        } catch (err: any) {
            Alert.alert("Login Failed", err.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/* <Animated.Image source={TopBubbleLogo} style={imageStyle} /> */}

            <ScrollView
                style={{ paddingHorizontal: 20, marginTop: 125 }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                }}
            >
                <Animated.Text style={welcomeTextStyle}>
                    {/* {t("AUTH.LOGIN.INTRO_TEXT")} */}
                </Animated.Text>
                <View style={{ marginTop: responsiveMargin, rowGap: 18 }}>
                    <Animated.View style={emailInputStyle}>
                        <Input
                            // placeholder={t("AUTH.INPUTS.EMAIL_PLACEHOLDER")}
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
                                />
                            }
                        />
                    </Animated.View>
                    <Animated.View style={passwordInputStyle}>
                        <Input
                            // label={t("AUTH.INPUTS.PASSWORD_LABEL")}
                            // placeholder={t("AUTH.INPUTS.PASSWORD_PLACEHOLDER")}
                            value={user?.password}
                            onChangeText={(text) =>
                                setUser((prev) => ({ ...prev, password: text }))
                            }
                            keyboardType="default"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            isPassword={true}
                            leftIcon={
                                <Feather
                                    name="lock"
                                    size={18}
                                    color="#7889D2"
                                />
                            }
                        />
                    </Animated.View>

                    <Animated.View style={signInButtonStyle}>
                        <Button
                            // title={t("AUTH.LOGIN.LOGIN_TEXT")}
                            title="Login"
                            onPress={handleLogin}
                            varint="outline"
                        />
                        {/* <CustomButton
                            onPress={() => navigation.replace("Register")}
                            background={false}
                            customStyle={{
                                flexDirection: "row",
                                columnGap: 5,
                                justifyContent: "flex-end",
                                marginTop: responsiveMargin,
                            }}
                        >
                            <Text style={styles.log}>
                                {t("AUTH.LOGIN.DONT_HAVE_ACCOUNT")}
                            </Text>
                            <Text style={[styles.log, { color: "#394792" }]}>
                                {t("AUTH.LOGIN.CREATE_ACCOUNT")}
                            </Text>
                        </CustomButton> */}
                    </Animated.View>
                </View>
                <Animated.View style={otherLoginStyle}>
                    {/* {loginOptions.map((option) => {
                        if (option.platform === "all") {
                            return (
                                <OtherLoginItem
                                    key={option.value}
                                    option={option}
                                    responsiveMargin={responsiveMargin}
                                    onPress={() => {
                                        if (option.value === "google") {
                                            googleSignIn();
                                        }
                                    }}
                                />
                            );
                        } else if (
                            option.platform === "ios" &&
                            Platform.OS === "ios"
                        ) {
                            return (
                                <OtherLoginItem
                                    key={option.value}
                                    option={option}
                                    responsiveMargin={responsiveMargin}
                                    onPress={() => {
                                        appleSignIn();
                                    }}
                                />
                            );
                        } else if (
                            option.platform === "android" &&
                            Platform.OS === "android"
                        ) {
                            console.log("google");
                        }
                    })} */}
                </Animated.View>

                <Animated.View style={forgetPasswordStyle}>
                    {/* <CustomButton
                        onPress={() => {
                            navigation.navigate("ForgotPassword");
                        }}
                        background={false}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                marginTop: responsiveMargin,
                                fontFamily: "Poppins-Regular",
                                fontSize: 12,
                                color: "#394792",
                            }}
                        >
                            {t("AUTH.LOGIN.FORGET_PASSWORD")}
                        </Text>
                    </CustomButton> */}
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

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
});
