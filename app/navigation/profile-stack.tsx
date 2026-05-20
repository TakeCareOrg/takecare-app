import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ConnectedDevicesScreen } from "@app/screens/connected-devices";
import { ProfileScreen } from "@app/screens/profile";

import type { ProfileStackParamList } from "./app-navigation-types";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * Stack hosted by the Profile tab. Today it only carries the Profile
 * root + the Withings-driven "Connected devices" screen, but new
 * Profile-adjacent screens (e.g. account settings, notification
 * preferences) should land here too — keeping them in a tab-scoped
 * stack avoids muddying the Home navigator's history.
 */
export const ProfileStackNavigator = () => (
    <Stack.Navigator
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        initialRouteName="ProfileMain"
    >
        <Stack.Screen name="ProfileMain" component={ProfileScreen} />
        <Stack.Screen
            name="ConnectedDevices"
            component={ConnectedDevicesScreen}
        />
    </Stack.Navigator>
);
