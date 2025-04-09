import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
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
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../../contexts/auth-context";
import useToast from "../../hooks/use-toast";
import CustomButton from "../../ui/buttons/custom-button";
import CustomInput from "../../ui/inputs/custom-input";
import { NavigateProps } from "../../types/router.types";

import TopBubbleLogo from "../../../assets/images/top_bubble_logo.png";

type userStateProps = {
    email: string;
    password: string;
};

const { width, height } = Dimensions.get("window");

type otherItemProps = {
    onPress: () => void;
    option: {
        image: React.ReactElement;
        value: string;
    };
    responsiveMargin: number;
};

function OtherLoginItem({ onPress, option, responsiveMargin }: otherItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: responsiveMargin,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#7889D2",
                height: 55,
                width: 55,
            }}
        >
            {option.image}
        </TouchableOpacity>
    );
}

const loginOptions = [
    {
        value: "apple",
        image: <FontAwesome name="apple" size={24} color="#7889D2" />,
        platform: "ios",
    },
    {
        value: "google",
        image: <FontAwesome name="google" size={24} color="#7889D2" />,
        platform: "all",
    },
    {
        value: "facebook",
        image: <FontAwesome name="facebook" size={24} color="#7889D2" />,
        platform: "all",
    },
    {
        value: "instagram",
        image: <FontAwesome name="twitter" size={24} color="#7889D2" />,
        platform: "all",
    },
];

export const LoginScreen: React.FC<NavigateProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const [user, setUser] = useState<userStateProps>({
        email: "",
        password: "",
    });

    const { signIn, setLoading, googleSignIn, appleSignIn } = useAuth();
    const toast = useToast();

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

    const handleSignIn = async () => {
        if (!user.email && !user.password) {
            toast({
                type: "error",
                title: "Error",
                message: "Please fill all fields",
            });
            return;
        }
        setLoading(true);
        await signIn({
            email: user.email,
            password: user.password,
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Animated.Image source={TopBubbleLogo} style={imageStyle} />

            <ScrollView
                style={{ paddingHorizontal: 20, marginTop: 125 }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                }}
            >
                <Animated.Text style={welcomeTextStyle}>
                    {t("AUTH.LOGIN.INTRO_TEXT")}
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
                        />
                    </Animated.View>
                    <Animated.View style={passwordInputStyle}>
                        <CustomInput
                            label={t("AUTH.INPUTS.PASSWORD_LABEL")}
                            placeholder={t("AUTH.INPUTS.PASSWORD_PLACEHOLDER")}
                            value={user?.password}
                            onChangeText={(text) =>
                                setUser((prev) => ({ ...prev, password: text }))
                            }
                            keyboardType="default"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            isPassword={true}
                            iconColor="#7889D2"
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
                            title={t("AUTH.LOGIN.LOGIN_TEXT")}
                            onPress={handleSignIn}
                        />
                        <CustomButton
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
                        </CustomButton>
                    </Animated.View>
                </View>
                <Animated.View style={otherLoginStyle}>
                    {loginOptions.map((option) => {
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
                    })}
                </Animated.View>

                <Animated.View style={forgetPasswordStyle}>
                    <CustomButton
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
                    </CustomButton>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
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
});
