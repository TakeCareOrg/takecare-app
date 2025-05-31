import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@screens/auth/login";
import { RegisterScreen } from "@screens/auth/register";
import { HomeScreen } from "@screens/home";
import { useAuthStore } from "@stores/auth";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Entypo } from "@expo/vector-icons";
import { useUserStore } from "@app/stores/users";
import { View } from "react-native";
import { secureStorage } from "@utils/storage";

import "@services/axios";
import { restoreSession } from "@app/utils/token";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    const token = useAuthStore((state) => state.token);
    const getUserData = useUserStore((state) => state.getUserData);
    const user = useUserStore((state) => state.user);
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        secureStorage.removeItem("auth-storage"); // Clear token for testing purposes
        async function prepare() {
            try {
                // Pre-load fonts, make any API calls you need to do here
                await Font.loadAsync(Entypo.font);
                if (token) {
                    // Fetch user data if token exists
                    await restoreSession();
                }
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(() => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setAppIsReady`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            SplashScreen.hide();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <NavigationContainer>
                <Stack.Navigator>
                    {user ? (
                        <Stack.Screen name="Home" component={HomeScreen} />
                    ) : (
                        <>
                            <Stack.Screen
                                name="Login"
                                component={LoginScreen}
                            />
                            <Stack.Screen
                                name="Register"
                                component={RegisterScreen}
                            />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}
