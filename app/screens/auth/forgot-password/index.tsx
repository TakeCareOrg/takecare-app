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

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;
const { width, height } = Dimensions.get("window");

/**
 * Forgot Password screen — Step 1 of the password reset flow.
 * User enters their email to receive a reset code.
 */
export function ForgotPasswordScreen({ navigation }: Props) {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();

    const forgotPassword = useAuthStore((state) => state.forgotPassword);
    const isLoading = useAuthStore((state) => state.isLoading);
    const [email, setEmail] = useState("");

    /** Request password reset code and navigate to verification screen. */
    const handleForgotPassword = async () => {
        try {
            await forgotPassword(email);
            Alert.alert(
                t("AUTH.SUCCESS.CODE_SENT_TITLE"),
                t("AUTH.SUCCESS.CODE_SENT_SUCCESS"),
            );
            navigation.navigate("VerifyResetCode");
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
                    {t("AUTH.FORGOT_PASSWORD.INTRO_TEXT")}
                </Text>

                {/* Subtitle */}
                <View>
                    <Text
                        style={[
                            styles.subtitleText,
                            { color: colors.placeholder },
                        ]}
                    >
                        {t("AUTH.FORGOT_PASSWORD.SUBTITLE")}
                    </Text>
                </View>

                {/* Email input */}
                <View style={styles.formContainer}>
                    <View>
                        <Input
                            placeholder={t("AUTH.INPUTS.EMAIL_PLACEHOLDER")}
                            value={email}
                            onChangeText={setEmail}
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
                    </View>
                </View>

                {/* Send code button & back to login link */}
                <View style={[styles.buttonSection]}>
                    <Button
                        title={t("AUTH.FORGOT_PASSWORD.SEND_EMAIL_TEXT")}
                        onPress={handleForgotPassword}
                        variant="primary"
                        isLoading={isLoading}
                        disabled={!email.trim()}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backLink}
                    >
                        <Text
                            style={{ fontSize: 13, color: colors.placeholder }}
                        >
                            {t("AUTH.FORGOT_PASSWORD.REMEMBER_PASSWORD")}{" "}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: colors.blue[200],
                                fontWeight: "600",
                            }}
                        >
                            {t("AUTH.LOGIN.LOGIN_TEXT")}
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
    backLink: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
});
