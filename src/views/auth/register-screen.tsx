import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
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
import { NavigateProps } from "../../types/router.types";
import CustomInput from "../../ui/inputs/custom-input";
import CustomButton from "../../ui/buttons/custom-button";
import TopBubbleLogo from "../../../assets/images/top_bubble_logo.png";

type userStateProps = {
    email: string;
    password: string;
    confirmPassword: string;
};

const { width, height } = Dimensions.get("window");

type otherItemProps = {
    onPress: () => void;
    option: {
        image: React.ReactElement;
        value: string;
    };
};

function OtherLoginItem({ onPress, option }: otherItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
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

export const RegisterScreen: React.FC<NavigateProps> = ({ navigation }) => {
    const [user, setUser] = useState<userStateProps>({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const { t } = useTranslation();
    const { signUp, googleSignIn } = useAuth();

    // Define animated values for input fields
    const translateValues = {
        imageY: useSharedValue(-100),
        welcomeTextY: useSharedValue(100),
        emailInputY: useSharedValue(100),
        passwordInputY: useSharedValue(100),
        confirmPasswordInputY: useSharedValue(100),
        signInButtonY: useSharedValue(100),
        otherLoginY: useSharedValue(100),
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
        translateValues.confirmPasswordInputY.value = withTiming(0, {
            duration: 1400,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        translateValues.signInButtonY.value = withTiming(0, {
            duration: 1500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        translateValues.otherLoginY.value = withTiming(0, {
            duration: 1600,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, []);

    const responsiveMargin = useMemo(() => {
        return height < 700 ? 12 : 16;
    }, [height]);

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

    const confirmPasswordInputStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY:
                        translateValues.confirmPasswordInputY.value * 10,
                },
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
        };
    });

    const handleRegister = () => {
        signUp(user);
    };
    return (
        <View style={styles.container}>
            <Animated.Image source={TopBubbleLogo} style={imageStyle} />

            <ScrollView
                style={{ paddingHorizontal: 20, marginTop: 155 }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    paddingBottom: 20,
                }}
            >
                <Animated.Text style={welcomeTextStyle}>
                    {t("AUTH.REGISTER.INTRO_TEXT")}
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

                    <Animated.View style={confirmPasswordInputStyle}>
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
                            title={t("AUTH.REGISTER.REGISTER_TEXT")}
                            onPress={handleRegister}
                        />
                        <CustomButton
                            onPress={() => navigation.replace("Login")}
                            background={false}
                            customStyle={{
                                flexDirection: "row",
                                columnGap: 5,
                                justifyContent: "flex-end",
                                marginTop: responsiveMargin,
                            }}
                        >
                            <Text style={styles.log}>
                                {t("AUTH.REGISTER.ALREADY_HAVE_ACCOUNT")}
                            </Text>
                            <Text style={[styles.log, { color: "#394792" }]}>
                                {t("AUTH.REGISTER.LOGIN_ACCOUNT")}
                            </Text>
                        </CustomButton>
                    </Animated.View>
                </View>

                <Animated.View style={otherLoginStyle}>
                    <Text
                        style={{
                            textAlign: "center",
                            marginTop: responsiveMargin,
                            fontFamily: "Poppins-Regular",
                            fontSize: 14,
                            color: "#394792",
                        }}
                    >
                        {t("GLOBAL.OR")}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            columnGap: 8,
                            marginTop: responsiveMargin,
                        }}
                    >
                        {loginOptions.map((option) => {
                            if (option.platform === "all") {
                                return (
                                    <OtherLoginItem
                                        key={option.value}
                                        option={option}
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
                                        onPress={() => {}}
                                    />
                                );
                            }
                        })}
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
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
