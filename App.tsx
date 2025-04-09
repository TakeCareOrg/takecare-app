/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "react-native/Libraries/NewAppScreen";
import I18n from "./src/i18n/I18n";
// import { init } from "@amplitude/analytics-react-native";
// import { Toasts } from "@backpackapp-io/react-native-toast";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
// import Toast from "react-native-toast-message";
import { AuthProvider } from "./src/contexts/auth-context";
import { ResponsiveProvider } from "./src/contexts/responsive-context";
import { VisibilityProvider } from "./src/contexts/visibility-context";
import { Router } from "./src/navigation/Router";
import { I18nextProvider } from "react-i18next";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === "dark";
    // init(process.env.API_KEY || "");
    // GoogleSignin.configure({
    //     webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEBCLIENT_ID,
    //     iosClientId: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,
    //     offlineAccess: true,
    // });

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1,
    };

    // useEffect(() => {
    //     if (!SplashScreen) return;

    //     SplashScreen.hide();
    // }, []);

    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Pre-load fonts, make any API calls you need to do here
                // await Font.loadAsync(Entypo.font);
                // Artificially delay for two seconds to simulate a slow loading
                // experience. Remove this if you copy and paste the code!
                await new Promise((resolve) => setTimeout(resolve, 2000));
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
        return <></>;
    }

    return (
        <SafeAreaProvider onLayout={onLayoutRootView}>
            <StatusBar
                // barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <AuthProvider>
                <GestureHandlerRootView style={backgroundStyle}>
                    <I18nextProvider i18n={I18n}>
                        {/* <VisibilityProvider> */}
                        {/* <ResponsiveProvider> */}
                        <Router />
                        {/* <Toasts
                                    globalAnimationType="spring"
                                    globalAnimationConfig={{
                                        duration: 500,
                                        flingPositionReturnDuration: 200,
                                        stiffness: 75,
                                        // damping: 12.5,
                                    }}
                                /> */}
                        {/* </ResponsiveProvider> */}
                        {/* </VisibilityProvider> */}
                    </I18nextProvider>
                </GestureHandlerRootView>
            </AuthProvider>
            {/* <Toast /> */}
        </SafeAreaProvider>
    );
}

export default App;
