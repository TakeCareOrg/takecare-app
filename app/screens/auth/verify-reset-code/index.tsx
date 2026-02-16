import Feather from "@expo/vector-icons/Feather";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Text } from "@components/ui/text";
import { useAuthStore } from "@stores/auth";

import { AuthStackParamList } from "../../../../App";

const image = require("@app/assets/img/top-bubble-logo.png");

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyResetCode">;
const { width, height } = Dimensions.get("window");

/**
 * Verify Reset Code screen — Step 2 of the password reset flow.
 * User enters the code received via email.
 */
export function VerifyResetCodeScreen({ navigation }: Props) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    const verifyResetCode = useAuthStore((state) => state.verifyResetCode);
    const forgotPassword = useAuthStore((state) => state.forgotPassword);
    const resetPasswordEmail = useAuthStore(
        (state) => state.resetPasswordEmail,
    );
    const isLoading = useAuthStore((state) => state.isLoading);
    const [code, setCode] = useState("");

    /** Verify the reset code and navigate to reset password screen. */
    const handleVerifyCode = async () => {
        try {
            await verifyResetCode(code);
            navigation.navigate("ResetPassword");
        } catch {
            Alert.alert(
                t("AUTH.VALIDATION.VERIFY_FAILED_TITLE"),
                t("AUTH.ERRORS.INVALID_CODE"),
            );
        }
    };

    /** Resend the reset code. */
    const handleResendCode = async () => {
        if (!resetPasswordEmail) {
            navigation.goBack();
            return;
        }

        try {
            await forgotPassword(resetPasswordEmail);
            Alert.alert(
                t("AUTH.SUCCESS.CODE_SENT_TITLE"),
                t("AUTH.SUCCESS.CODE_SENT_SUCCESS"),
            );
        } catch (err) {
            Alert.alert(
                t("AUTH.FORGOT_PASSWORD.FAILED_TITLE"),
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
            <Image source={image} style={styles.logoImage} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Title */}
                <Text style={[styles.titleText, { color: colors.blue[200] }]}>
                    {t("AUTH.VALIDATION.VERIFY_ACCOUNT_TITLE")}
                </Text>

                {/* Subtitle */}
                <View>
                    <Text
                        style={[
                            styles.subtitleText,
                            { color: colors.placeholder },
                        ]}
                    >
                        {t("AUTH.VALIDATION.VERIFY_ACCOUNT_INSTRUCTIONS")}
                    </Text>
                </View>

                {/* Code input */}
                <View style={styles.formContainer}>
                    <View>
                        <Input
                            placeholder={t(
                                "AUTH.FORGOT_PASSWORD.CODE_PLACEHOLDER",
                            )}
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            leftIcon={
                                <Feather
                                    name="key"
                                    size={18}
                                    color={colors.blue[200]}
                                />
                            }
                        />
                    </View>
                </View>

                {/* Verify button & resend code link */}
                <View style={[styles.buttonSection]}>
                    <Button
                        title={t("AUTH.VALIDATION.VALIDATE_BUTTON")}
                        onPress={handleVerifyCode}
                        variant="primary"
                        isLoading={isLoading}
                        disabled={!code.trim()}
                    />
                    <TouchableOpacity
                        onPress={handleResendCode}
                        style={styles.resendLink}
                    >
                        <Text
                            style={{ fontSize: 13, color: colors.placeholder }}
                        >
                            {t("AUTH.VALIDATION.DID_NOT_RECEIVE")}{" "}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: colors.blue[200],
                                fontWeight: "600",
                            }}
                        >
                            {t("AUTH.VALIDATION.RESEND_CODE")}
                        </Text>
                    </TouchableOpacity>
                </View>
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
    resendLink: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
});
