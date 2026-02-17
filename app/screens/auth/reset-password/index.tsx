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

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;
const { width, height } = Dimensions.get("window");

/** Shared cubic-bezier easing used for all entrance animations. */
const EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

/**
 * Reset Password screen — Step 3 of the password reset flow.
 * User enters their new password.
 */
export function ResetPasswordScreen({ navigation }: Props) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    const resetPassword = useAuthStore((state) => state.resetPassword);
    const clearResetPasswordState = useAuthStore(
        (state) => state.clearResetPasswordState,
    );
    const isLoading = useAuthStore((state) => state.isLoading);
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    // Animated shared values: each element has a translateY + opacity pair
    const imageY = useSharedValue(-100);
    const imageOpacity = useSharedValue(0);
    const titleY = useSharedValue(100);
    const titleOpacity = useSharedValue(0);
    const subtitleY = useSharedValue(100);
    const subtitleOpacity = useSharedValue(0);
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
        animate(titleY, 0, 1000);
        animate(titleOpacity, 1, 1000);
        animate(subtitleY, 0, 1100);
        animate(subtitleOpacity, 1, 1100);
        animate(passwordY, 0, 1200);
        animate(passwordOpacity, 1, 1200);
        animate(confirmY, 0, 1300);
        animate(confirmOpacity, 1, 1300);
        animate(buttonY, 0, 1400);
        animate(buttonOpacity, 1, 1400);
    }, [
        imageY,
        imageOpacity,
        titleY,
        titleOpacity,
        subtitleY,
        subtitleOpacity,
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

    const titleAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: titleY.value * 8 }],
        opacity: titleOpacity.value,
    }));

    const subtitleAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: subtitleY.value * 8 }],
        opacity: subtitleOpacity.value,
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

    /** Reset password and navigate back to login. */
    const handleResetPassword = async () => {
        try {
            await resetPassword(
                passwords.newPassword,
                passwords.confirmPassword,
            );
            Alert.alert(
                t("AUTH.RESET_PASSWORD.SUCCESS_TITLE"),
                t("AUTH.RESET_PASSWORD.SUCCESS_MESSAGE"),
                [
                    {
                        text: t("COMMON.CONFIRM"),
                        onPress: () => {
                            clearResetPasswordState();
                            navigation.navigate("Login");
                        },
                    },
                ],
            );
        } catch (err) {
            Alert.alert(
                t("AUTH.RESET_PASSWORD.FAILED_TITLE"),
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
                {/* Title */}
                <Animated.Text
                    style={[
                        styles.titleText,
                        { color: colors.blue[200] },
                        titleAnimStyle,
                    ]}
                >
                    {t("AUTH.RESET_PASSWORD.INTRO_TEXT")}
                </Animated.Text>

                {/* Subtitle */}
                <Animated.View style={subtitleAnimStyle}>
                    <Text
                        style={[
                            styles.subtitleText,
                            { color: colors.placeholder },
                        ]}
                    >
                        {t("AUTH.RESET_PASSWORD.SUBTITLE")}
                    </Text>
                </Animated.View>

                {/* Password inputs */}
                <View style={styles.formContainer}>
                    <Animated.View style={passwordAnimStyle}>
                        <Input
                            placeholder={t(
                                "AUTH.RESET_PASSWORD.NEW_PASSWORD_PLACEHOLDER",
                            )}
                            value={passwords.newPassword}
                            onChangeText={(text) =>
                                setPasswords((prev) => ({
                                    ...prev,
                                    newPassword: text,
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
                    <Animated.View style={confirmAnimStyle}>
                        <Input
                            placeholder={t(
                                "AUTH.INPUTS.CONFIRM_PASSWORD_PLACEHOLDER",
                            )}
                            value={passwords.confirmPassword}
                            onChangeText={(text) =>
                                setPasswords((prev) => ({
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

                {/* Reset password button */}
                <Animated.View style={[styles.buttonSection, buttonAnimStyle]}>
                    <Button
                        title={t("AUTH.RESET_PASSWORD.RESET_BUTTON")}
                        onPress={handleResetPassword}
                        variant="primary"
                        isLoading={isLoading}
                        disabled={
                            !passwords.newPassword.trim() ||
                            !passwords.confirmPassword.trim()
                        }
                    />
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
    titleText: {
        textAlign: "center",
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitleText: {
        textAlign: "center",
        fontSize: 14,
        marginBottom: 8,
    },
    formContainer: {
        marginTop: 28,
        rowGap: 16,
    },
    buttonSection: {
        marginTop: 32,
    },
});
