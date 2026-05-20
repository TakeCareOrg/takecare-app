import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { HealthKitModule } from "@takecareorg/takecare-healthkit";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@app/components/ui/text";
import { useColorTheme } from "@app/hooks/use-color-theme";
import { syncHealthData } from "@app/services/health-sync";
import { useWithingsStore } from "@app/stores/withings";

import { WithingsDeviceCard } from "./components/device-card";

/**
 * "Mes appareils connectés" — entry point for integrations (today
 * Withings, tomorrow Fitbit/Garmin/Polar/…). Reachable from the Profile
 * tab via the existing "Connected devices" Item row.
 *
 * The screen is intentionally simple in this version: a stacked list
 * of device cards. The card itself drives the OAuth flow and is the
 * unit that gets duplicated for additional providers later.
 */
export const ConnectedDevicesScreen = () => {
    const themeColors = useColorTheme();
    const { t } = useTranslation("full_trads");
    const navigation = useNavigation();

    const fetchStatus = useWithingsStore((state) => state.fetchStatus);

    useEffect(() => {
        // Sync the connection status whenever the screen mounts — the
        // user might have just returned from the in-app browser, or the
        // backend might have updated `last_synced_at` since the last
        // visit.
        fetchStatus();
    }, [fetchStatus]);

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: themeColors.background },
            ]}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.6}
                    accessibilityRole="button"
                    accessibilityLabel={t("COMMON.BACK")}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={themeColors.text}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>{t("CONNECTED_DEVICES.TITLE")}</Text>
                {/* Right-side spacer keeps the title visually centred even
                    though we only have a leading icon. */}
                <View style={styles.backButton} />
            </View>
            <Text style={[styles.subtitle, { color: themeColors.secondary }]}>
                {t("CONNECTED_DEVICES.SUBTITLE")}
            </Text>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <WithingsDeviceCard
                    onDisconnectError={(message) =>
                        Alert.alert(t("CONNECTED_DEVICES.ERROR_TITLE"), message)
                    }
                />
                {/* Native Health Connect (HC) shim: gives the user a
                    direct way to re-open HC's per-app permission screen.
                    Useful when the library has added new permission
                    types between builds (e.g. body composition + vitals
                    in 5.1.0) — Android won't auto-prompt for the
                    newcomers even though the manifest declares them, so
                    `requestAuthorization` needs an explicit trigger. */}
                <TouchableOpacity
                    onPress={async () => {
                        // 1. Re-issue the native authorization request:
                        //    on Android the native module will prompt the
                        //    user when at least one declared permission
                        //    is still in "not determined" state.
                        try {
                            await HealthKitModule.requestAuthorization();
                        } catch (err) {
                            // eslint-disable-next-line no-console
                            console.warn(
                                "[health] requestAuthorization failed:",
                                err,
                            );
                        }

                        // 2. Always open Health Connect (or fall back to
                        //    the TakeCare app settings) on Android — if
                        //    the user previously denied a permission,
                        //    the native prompt will silently no-op and
                        //    the user has no other way to toggle access.
                        //    Intent names vary across Android versions:
                        //      • Android 14+ ships HC inside Settings;
                        //        the action lives in the platform
                        //        Settings package.
                        //      • Android 13- has HC as a separate APK
                        //        published by Google; the AndroidX
                        //        action is the canonical entry point.
                        //    `Linking.openSettings()` is the universal
                        //    last-resort: it opens TakeCare's app
                        //    settings where "Permissions → Health
                        //    Connect" is reachable in two taps.
                        if (Platform.OS === "android") {
                            const intents = [
                                "android.settings.HEALTH_CONNECT_SETTINGS",
                                "androidx.health.ACTION_HEALTH_CONNECT_SETTINGS",
                            ];
                            let opened = false;
                            for (const action of intents) {
                                try {
                                    await Linking.sendIntent(action);
                                    opened = true;
                                    break;
                                } catch {
                                    // Try the next intent action.
                                }
                            }
                            if (!opened) {
                                try {
                                    await Linking.openSettings();
                                    opened = true;
                                } catch (err) {
                                    // eslint-disable-next-line no-console
                                    console.warn(
                                        "[health] openSettings fallback failed:",
                                        err,
                                    );
                                }
                            }
                            if (!opened) {
                                Alert.alert(
                                    t("CONNECTED_DEVICES.ERROR_TITLE"),
                                    t(
                                        "CONNECTED_DEVICES.HC_PERMISSIONS_OPEN_FAILED",
                                    ),
                                );
                                return;
                            }
                        }

                        // 3. Schedule a sync so we pick up any
                        //    newly-granted types when the user returns
                        //    to the app.
                        await syncHealthData();
                    }}
                    activeOpacity={0.7}
                    style={[
                        styles.hcRefreshRow,
                        { backgroundColor: themeColors.box },
                    ]}
                >
                    <Ionicons
                        name="medkit-outline"
                        size={20}
                        color={themeColors.text}
                    />
                    <Text style={styles.hcRefreshText}>
                        {t("CONNECTED_DEVICES.HC_PERMISSIONS_CTA")}
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={themeColors.secondary}
                    />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    subtitle: {
        fontSize: 13,
        textAlign: "center",
        paddingHorizontal: 32,
        marginTop: 4,
        marginBottom: 16,
    },
    scroll: { flex: 1 },
    scrollContent: {
        padding: 20,
        gap: 14,
        paddingBottom: 40,
    },
    hcRefreshRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 12,
    },
    hcRefreshText: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
    },
});
