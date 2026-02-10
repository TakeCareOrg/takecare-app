import Feather from "@expo/vector-icons/Feather";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
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
import { Text } from "@components/ui/text";
import { useAuthStore } from "@stores/auth";

import { AuthStackParamList } from "../../../../App";

const image = require("@app/assets/img/top-bubble-logo.png");

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;
const { width, height } = Dimensions.get("window");

/** Shared cubic-bezier easing used for all entrance animations. */
const EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

export function RegisterScreen({ navigation }: Props) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    const register = useAuthStore((state) => state.register);
    const [user, setUser] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Animated shared values: each element has a translateY + opacity pair
    const imageY = useSharedValue(-100);
    const imageOpacity = useSharedValue(0);
    const welcomeY = useSharedValue(100);
    const welcomeOpacity = useSharedValue(0);
    const emailY = useSharedValue(100);
    const emailOpacity = useSharedValue(0);
    const passwordY = useSharedValue(100);
    const passwordOpacity = useSharedValue(0);
    const confirmY = useSharedValue(100);
    const confirmOpacity = useSharedValue(0);
    const buttonY = useSharedValue(100);
    const buttonOpacity = useSharedValue(0);

    // Trigger staggered entrance animations on mount
    useEffect(() => {
        const animate = (
            val: typeof imageY,
            target: number,
            duration: number,
        ) => {
            val.value = withTiming(target, { duration, easing: EASING });
        };
        animate(imageY, 0, 900);
        animate(imageOpacity, 1, 900);
        animate(welcomeY, 0, 1000);
        animate(welcomeOpacity, 1, 1000);
        animate(emailY, 0, 1100);
        animate(emailOpacity, 1, 1100);
        animate(passwordY, 0, 1200);
        animate(passwordOpacity, 1, 1200);
        animate(confirmY, 0, 1300);
        animate(confirmOpacity, 1, 1300);
        animate(buttonY, 0, 1400);
        animate(buttonOpacity, 1, 1400);
    }, [
        imageY,
        imageOpacity,
        welcomeY,
        welcomeOpacity,
        emailY,
        emailOpacity,
        passwordY,
        passwordOpacity,
        confirmY,
        confirmOpacity,
        buttonY,
        buttonOpacity,
    ]);

    // Animated styles combining slide + fade for each section
    const imageAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: imageY.value * 10 }],
        opacity: imageOpacity.value,
    }));

    const welcomeAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: welcomeY.value * 8 }],
        opacity: welcomeOpacity.value,
    }));

    const emailAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: emailY.value * 8 }],
        opacity: emailOpacity.value,
    }));

    const passwordAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: passwordY.value * 8 }],
        opacity: passwordOpacity.value,
    }));

    const confirmAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: confirmY.value * 8 }],
        opacity: confirmOpacity.value,
    }));

    const buttonAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: buttonY.value * 8 }],
        opacity: buttonOpacity.value,
    }));

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
            {/* Header bubble logo — slides down from above */}
            <Animated.Image
                source={image}
                style={[styles.logoImage, imageAnimStyle]}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Welcome title */}
                <Animated.Text
                    style={[
                        styles.welcomeText,
                        { color: colors.blue[200] },
                        welcomeAnimStyle,
                    ]}
                >
                    {t("AUTH.REGISTER.INTRO_TEXT")}
                </Animated.Text>

                {/* Email, password & confirm password inputs */}
                <View style={styles.formContainer}>
                    <Animated.View style={emailAnimStyle}>
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
                    <Animated.View style={passwordAnimStyle}>
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
                    <Animated.View style={confirmAnimStyle}>
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
                </View>

                {/* Register button & navigation to login screen */}
                <Animated.View style={[styles.buttonSection, buttonAnimStyle]}>
                    <Button
                        title={t("AUTH.REGISTER.REGISTER_TEXT")}
                        onPress={handleRegister}
                        variant="primary"
                    />
                    <TouchableOpacity
                        onPress={() => navigation.replace("Login")}
                        style={styles.loginLink}
                    >
                        <Text
                            style={{ fontSize: 13, color: colors.placeholder }}
                        >
                            {t("AUTH.REGISTER.ALREADY_HAVE_ACCOUNT")}{" "}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: colors.blue[200],
                                fontWeight: "600",
                            }}
                        >
                            {t("AUTH.REGISTER.LOGIN_ACCOUNT")}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoImage: {
        width: width,
        height: height / 4.5,
        resizeMode: "cover",
        position: "absolute",
        top: -20,
    },
    scrollView: {
        paddingHorizontal: 28,
        marginTop: 125,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
    },
    welcomeText: {
        textAlign: "center",
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 8,
    },
    formContainer: {
        marginTop: 28,
        rowGap: 16,
    },
    buttonSection: {
        marginTop: 32,
    },
    loginLink: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
});
