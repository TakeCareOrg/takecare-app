import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { ActivityIndicator, Linking, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { ChatbotScreen } from "@app/screens/chatbot";
import { QuizScreen } from "@app/screens/quiz/quiz-screen";
import { initializeMedicalData } from "@app/stores/medical-data";
import { useWithingsStore } from "@app/stores/withings";
import I18n from "@i18n/index";
import BottomTabNavigation from "@navigation/bottom-tab-navigation";
import { ForgotPasswordScreen } from "@screens/auth/forgot-password";
import { LoginScreen } from "@screens/auth/login";
import { RegisterScreen } from "@screens/auth/register";
import { ResetPasswordScreen } from "@screens/auth/reset-password";
import { VerifyResetCodeScreen } from "@screens/auth/verify-reset-code";
import "@services/axios";
import {
    cleanupHealthSync,
    initializeHealthSync,
    syncHealthData,
} from "@services/health-sync";
import { useAuthStore } from "@stores/auth";
import { initializeUserAuth, useUserStore } from "@stores/users";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

initializeUserAuth();
initializeMedicalData();

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    VerifyResetCode: undefined;
    ResetPassword: undefined;
};

export type AppStackParamList = {
    Quiz: undefined;
    Main: undefined;
    Chat: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const user = useUserStore((state) => state.user);
    const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
    const colors = useColorTheme();
    useEffect(() => {
        async function prepare() {
            try {
                // checkAuthStatus already loads user data if authenticated
                await checkAuthStatus();

                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (e) {
                throw new Error("Failed to initialize app: " + e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, [checkAuthStatus]);

    // Initialize health sync when authenticated
    useEffect(() => {
        if (isAuthenticated && appIsReady) {
            initializeHealthSync();
        }

        return () => {
            cleanupHealthSync();
        };
    }, [isAuthenticated, appIsReady]);

    // Listen for deep links that re-open the app at the end of the
    // Withings OAuth flow. The backend's `/withings/oauth/callback`
    // 302s to `app-scheme://withings/callback?status=...` once it has
    // exchanged the code, subscribed NotifyAPI, and persisted tokens.
    // On `status=success` we refetch the Withings status (to populate
    // the device card immediately) and kick a global sync so the new
    // Withings slice lands in the health-data store right away,
    // without waiting for the 60s polling tick.
    useEffect(() => {
        if (!isAuthenticated) return;

        const handleUrl = (url: string | null) => {
            if (!url) return;
            // Cheap prefix match — full URL parse is overkill for our
            // single deep-link surface.
            if (!url.startsWith("app-scheme://withings/")) return;
            try {
                const parsed = new URL(url);
                const status = parsed.searchParams.get("status");
                if (status === "success") {
                    useWithingsStore.getState().markConnected();
                    syncHealthData();
                }
            } catch {
                // Malformed URL — ignore. The browser-session resolver
                // in `withings-auth.ts` also handles success, so this
                // is a belt-and-braces listener for the case where the
                // OS opens the app via the URL scheme without the
                // session resolving (background → cold start).
            }
        };

        const sub = Linking.addEventListener("url", ({ url }) =>
            handleUrl(url),
        );
        // Handle cold-start case: the app might be launched _by_ the
        // deep link, in which case the listener above missed the
        // initial URL.
        Linking.getInitialURL().then(handleUrl);

        return () => sub.remove();
    }, [isAuthenticated]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady && isInitialized) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady, isInitialized]);

    // Show loader while waiting for user data. Wrap in
    // `GestureHandlerRootView` even during the loading branch so that the
    // gesture context lifecycle is continuous from the very first frame —
    // otherwise any `GestureDetector` that mounts on the same frame as
    // the loader unmounts (e.g. Home's `DraggableWidget`) throws
    // "GestureDetector must be used as a descendant of
    // GestureHandlerRootView".
    if (!appIsReady || !isInitialized || (isAuthenticated && !user)) {
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.background,
                    }}
                >
                    <ActivityIndicator size="large" color={colors.text} />
                </View>
            </GestureHandlerRootView>
        );
    }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                    <I18nextProvider i18n={I18n}>
                        <NavigationContainer>
                            {isAuthenticated ? (
                                user?.quiz_finished === true ? (
                                    <AppStack.Navigator
                                        screenOptions={{
                                            headerShown: false,
                                            animation: "fade",
                                            animationDuration: 500,
                                        }}
                                    >
                                        <AppStack.Screen
                                            name="Main"
                                            component={BottomTabNavigation}
                                        />
                                        <AppStack.Screen
                                            name="Chat"
                                            component={ChatbotScreen}
                                            options={{
                                                animation: "slide_from_right",
                                            }}
                                        />
                                    </AppStack.Navigator>
                                ) : (
                                    <AppStack.Navigator
                                        screenOptions={{
                                            headerShown: false,
                                            animation: "fade",
                                            animationDuration: 500,
                                        }}
                                    >
                                        <AppStack.Screen
                                            name="Quiz"
                                            component={QuizScreen}
                                        />
                                    </AppStack.Navigator>
                                )
                            ) : (
                                <AuthStack.Navigator
                                    screenOptions={{
                                        headerShown: false,
                                        animation: "fade",
                                        animationDuration: 500,
                                    }}
                                >
                                    <AuthStack.Screen
                                        name="Login"
                                        component={LoginScreen}
                                    />
                                    <AuthStack.Screen
                                        name="Register"
                                        component={RegisterScreen}
                                    />
                                    <AuthStack.Screen
                                        name="ForgotPassword"
                                        component={ForgotPasswordScreen}
                                    />
                                    <AuthStack.Screen
                                        name="VerifyResetCode"
                                        component={VerifyResetCodeScreen}
                                    />
                                    <AuthStack.Screen
                                        name="ResetPassword"
                                        component={ResetPasswordScreen}
                                    />
                                </AuthStack.Navigator>
                            )}
                        </NavigationContainer>
                    </I18nextProvider>
                </View>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
