import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";

import { QuizScreen } from "@app/screens/quiz/quiz-screen";
import { initializeMedicalData } from "@app/stores/medical-data";
import I18n from "@i18n/index";
import BottomTabNavigation from "@navigation/bottom-tab-navigation";
import { LoginScreen } from "@screens/auth/login";
import { RegisterScreen } from "@screens/auth/register";
import "@services/axios";
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

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const user = useUserStore((state) => state.user);
    const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

    useEffect(() => {
        async function prepare() {
            // await secureStorage.removeItem("auth-storage-token");
            try {
                // Vérifier le statut d'authentification au lancement
                await checkAuthStatus();

                // Simuler un délai minimum pour éviter un flash trop rapide (optionnel)
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (e) {
                throw new Error("Failed to initialize app: " + e);
            } finally {
                // Marquer l'app comme prête
                setAppIsReady(true);
            }
        }

        prepare();
    }, [checkAuthStatus]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady && isInitialized) {
            // Cacher le splash screen quand l'app est prête
            await SplashScreen.hideAsync();
        }
    }, [appIsReady, isInitialized]);

    // Ne pas rendre l'app tant qu'elle n'est pas prête
    if (!appIsReady || !isInitialized) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                <I18nextProvider i18n={I18n}>
                    <NavigationContainer>
                        {isAuthenticated && user?.quiz_finished === false ? (
                            <QuizScreen />
                        ) : isAuthenticated && user?.quiz_finished === true ? (
                            <BottomTabNavigation />
                        ) : (
                            <Stack.Navigator
                                screenOptions={{
                                    headerShown: false,
                                    animation: "fade",
                                    animationDuration: 500,
                                }}
                            >
                                <Stack.Screen
                                    name="Login"
                                    component={LoginScreen}
                                />
                                <Stack.Screen
                                    name="Register"
                                    component={RegisterScreen}
                                />
                            </Stack.Navigator>
                        )}
                    </NavigationContainer>
                </I18nextProvider>
            </View>
        </SafeAreaProvider>
    );
}
