import { HealthKitModule } from "@takecareorg/takecare-healthkit";
import { Linking, Platform } from "react-native";

/**
 * Drive the user into Health Connect's per-app permission screen.
 *
 * The native `requestAuthorization()` shipped by
 * `@takecareorg/takecare-healthkit` v5 only *checks* the grant state —
 * it never actually launches the system intent that shows the dialog.
 * So we call it first (harmless on already-granted devices, useful for
 * the "added new permission types between builds" path) and then send
 * an explicit intent to Health Connect itself.
 *
 * Intent action names vary across Android versions:
 *   • Android 14+ ships HC inside Settings; the action lives in the
 *     platform Settings package.
 *   • Android 13- has HC as a separate APK published by Google; the
 *     AndroidX action is the canonical entry point.
 *
 * `Linking.openSettings()` is the universal last-resort: it opens
 * TakeCare's app settings where "Permissions → Health Connect" is
 * reachable in two taps even if HC itself can't be opened directly.
 *
 * Returns `true` if any opener succeeded, `false` if everything failed
 * (caller decides whether to show an alert).
 */
export async function openHealthConnectPermissions(): Promise<boolean> {
    if (Platform.OS !== "android") return false;

    try {
        await HealthKitModule.requestAuthorization();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[health] requestAuthorization failed:", err);
    }

    const intents = [
        "android.settings.HEALTH_CONNECT_SETTINGS",
        "androidx.health.ACTION_HEALTH_CONNECT_SETTINGS",
    ];
    for (const action of intents) {
        try {
            await Linking.sendIntent(action);
            return true;
        } catch {
            // Try the next intent action.
        }
    }

    try {
        await Linking.openSettings();
        return true;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[health] openSettings fallback failed:", err);
        return false;
    }
}
