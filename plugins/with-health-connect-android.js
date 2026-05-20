// @ts-nocheck
/**
 * Expo config plugin that wires the host app into Health Connect on
 * Android.
 *
 * Google requires every app that reads/writes Health Connect data to
 * publish two things on top of the bare `<uses-permission>` entries (the
 * native module itself only ships the permission declarations + the
 * `<queries>` block needed to discover the HC provider on Android 13-):
 *
 *   1. An `<intent-filter>` for `androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE`
 *      on the launcher Activity. Without it, Health Connect refuses to
 *      show the app inside its per-app permission screen, so
 *      `requestAuthorization()` becomes a silent no-op and the user has
 *      no way to grant access.
 *
 *   2. An `<activity-alias>` advertising `android.intent.action.VIEW_PERMISSION_USAGE`
 *      with the `android.intent.category.HEALTH_PERMISSIONS` category.
 *      This is the entry point Health Connect uses on Android 14+ when
 *      it shows the rationale screen from inside Settings.
 *
 * Both must be added to the host app's `AndroidManifest.xml` (not the
 * library's) because they reference `.MainActivity`, which only the host
 * app owns. Using a plugin keeps the change idempotent across
 * `expo prebuild --clean`.
 */

const { withAndroidManifest } = require("@expo/config-plugins");

const RATIONALE_ACTION = "androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE";
const VIEW_PERMISSION_USAGE_ACTION =
    "android.intent.action.VIEW_PERMISSION_USAGE";
const HEALTH_PERMISSIONS_CATEGORY =
    "android.intent.category.HEALTH_PERMISSIONS";

/**
 * @param {import("@expo/config-plugins").AndroidManifest} androidManifest
 */
function getMainActivity(androidManifest) {
    const application = androidManifest.manifest.application?.[0];
    if (!application?.activity) {
        throw new Error(
            "[with-health-connect-android] No <application>/<activity> found in AndroidManifest.xml",
        );
    }
    const mainActivity = application.activity.find((activity) =>
        activity.$?.["android:name"]?.endsWith(".MainActivity"),
    );
    if (!mainActivity) {
        throw new Error(
            "[with-health-connect-android] Could not locate .MainActivity in AndroidManifest.xml",
        );
    }
    return { application, mainActivity };
}

/**
 * @param {NonNullable<import("@expo/config-plugins").AndroidManifest["manifest"]["application"]>[0]["activity"][0]["intent-filter"][0]} filter
 * @param {string} actionName
 */
function intentFilterHasAction(filter, actionName) {
    return Boolean(
        filter?.action?.some(
            // @ts-ignore
            (action) => action.$?.["android:name"] === actionName,
        ),
    );
}

/**
 * @param {ReturnType<typeof getMainActivity>["mainActivity"]} mainActivity
 */
function ensureRationaleIntentFilter(mainActivity) {
    mainActivity["intent-filter"] = mainActivity["intent-filter"] ?? [];
    const alreadyPresent = mainActivity["intent-filter"].some((filter) =>
        intentFilterHasAction(filter, RATIONALE_ACTION),
    );
    if (alreadyPresent) return;

    mainActivity["intent-filter"].push({
        action: [{ $: { "android:name": RATIONALE_ACTION } }],
    });
}

/**
 * @param {ReturnType<typeof getMainActivity>["application"]} application
 */
function ensureViewPermissionUsageAlias(application) {
    const aliases = application["activity-alias"] ?? [];
    const alreadyPresent = aliases.some(
        (alias) =>
            alias.$?.["android:name"] ===
            "com.takecare.HealthConnectPermissionUsageAlias",
    );
    if (alreadyPresent) return;

    const alias = {
        $: {
            "android:name": "com.takecare.HealthConnectPermissionUsageAlias",
            "android:exported": "true",
            "android:targetActivity": ".MainActivity",
            "android:permission":
                "android.permission.START_VIEW_PERMISSION_USAGE",
        },
        "intent-filter": [
            {
                action: [
                    { $: { "android:name": VIEW_PERMISSION_USAGE_ACTION } },
                ],
                category: [
                    { $: { "android:name": HEALTH_PERMISSIONS_CATEGORY } },
                ],
            },
        ],
    };

    application["activity-alias"] = [...aliases, alias];
}

/** @type {import("@expo/config-plugins").ConfigPlugin} */
const withHealthConnectAndroid = (config) =>
    withAndroidManifest(config, (cfg) => {
        const { application, mainActivity } = getMainActivity(cfg.modResults);
        ensureRationaleIntentFilter(mainActivity);
        ensureViewPermissionUsageAlias(application);
        return cfg;
    });

module.exports = withHealthConnectAndroid;
