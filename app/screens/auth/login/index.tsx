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

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;
const { width, height } = Dimensions.get("window");

/** Shared cubic-bezier easing used for all entrance animations. */
const EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

/**
 * Login screen — allows users to sign in with email and password.
 * Each UI element slides in with a staggered fade animation on mount.
 */
export function LoginScreen({ navigation }: Props) {
    const { t } = useTranslation("full_trads");

    const login = useAuthStore((state) => state.login);
    const [user, setUser] = useState({ email: "", password: "" });
    const colors = useColorTheme();

    // Animated shared values: each element has a translateY + opacity pair
    const imageY = useSharedValue(-100);
    const imageOpacity = useSharedValue(0);
    const welcomeY = useSharedValue(100);
    const welcomeOpacity = useSharedValue(0);
    const emailY = useSharedValue(100);
    const emailOpacity = useSharedValue(0);
    const passwordY = useSharedValue(100);
    const passwordOpacity = useSharedValue(0);
    const buttonY = useSharedValue(100);
    const buttonOpacity = useSharedValue(0);

    // Trigger staggered entrance animations on mount
    useEffect(() => {
        /** Helper to animate a shared value to a target over a given duration. */
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
        animate(buttonY, 0, 1300);
        animate(buttonOpacity, 1, 1300);
    }, [
        imageY,
        imageOpacity,
        welcomeY,
        welcomeOpacity,
        emailY,
        emailOpacity,
        passwordY,
        passwordOpacity,
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

    const buttonAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: buttonY.value * 8 }],
        opacity: buttonOpacity.value,
    }));

    /** Attempt login and show an alert on failure. */
    const handleLogin = async () => {
        try {
            await login(user.email, user.password);
        } catch {
            Alert.alert("Login Failed", t("AUTH.LOGIN.LOGIN_FAILED"));
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
                    {t("AUTH.LOGIN.INTRO_TEXT")}
                </Animated.Text>

                {/* Email & password inputs */}
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
                </View>

                {/* Login button & navigation links */}
                <Animated.View style={[styles.buttonSection, buttonAnimStyle]}>
                    <Button
                        title={t("AUTH.LOGIN.LOGIN_TEXT")}
                        onPress={handleLogin}
                        variant="primary"
                    />
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ForgotPassword")}
                        style={styles.forgotPasswordLink}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                color: colors.blue[200],
                                fontWeight: "600",
                            }}
                        >
                            {t("AUTH.LOGIN.FORGET_PASSWORD")}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.replace("Register")}
                        style={styles.registerLink}
                    >
                        <Text
                            style={{ fontSize: 13, color: colors.placeholder }}
                        >
                            {t("AUTH.LOGIN.DONT_HAVE_ACCOUNT")}{" "}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: colors.blue[200],
                                fontWeight: "600",
                            }}
                        >
                            {t("AUTH.LOGIN.CREATE_ACCOUNT")}
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
    forgotPasswordLink: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
    },
    registerLink: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
});
