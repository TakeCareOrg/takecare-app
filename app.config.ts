import "dotenv/config";

import { ConfigContext, ExpoConfig } from "expo/config";

import { version } from "./package.json";

// Replace these with your EAS project ID and project slug.
// You can find them at https://expo.dev/accounts/[account]/projects/[project].
const EAS_PROJECT_ID = "32ff88e2-3b96-4a13-a1ca-66026920a635";
const PROJECT_SLUG = "takecare-app";

// App production config
const APP_NAME = "TakeCare AI";
const BUNDLE_IDENTIFIER = "com.company.takecareai";
const PACKAGE_NAME = "com.company.takecareai";
const ICON = "./assets/adaptive-icon.png";
const ADAPTIVE_ICON = "./assets/adaptive-icon.png";
const SCHEME = "app-scheme";
const SPLASH_IMAGE = "./assets/splash-icon.png";
const FAVICON = "./assets/favicon.png";

type ENV_TYPE = "development" | "preview" | "production";

export default ({ config }: ConfigContext): ExpoConfig => {
    const { name, bundleIdentifier, packageName, scheme } = getDynamicAppConfig(
        process.env.APP_ENV || "development",
    );

    return {
        ...config,
        name: name,
        version, // Automatically bump your project version with `npm version patch`, `npm version minor` or `npm version major`.
        slug: PROJECT_SLUG, // Must be consistent across all environments.
        orientation: "portrait",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        icon: ICON,
        scheme: scheme,
        ios: {
            supportsTablet: true,
            bundleIdentifier: bundleIdentifier,
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                NSMicrophoneUsageDescription: `${APP_NAME} needs access to your microphone for voice messages.`,
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: ADAPTIVE_ICON,
                backgroundColor: "#ffffff",
            },
            package: packageName,
            permissions: [
                // Health Connect permissions
                "android.permission.health.READ_STEPS",
                "android.permission.health.WRITE_STEPS",
                "android.permission.health.READ_ACTIVE_CALORIES_BURNED",
                "android.permission.health.READ_TOTAL_CALORIES_BURNED",
                "android.permission.health.READ_DISTANCE",
                "android.permission.health.READ_FLOORS_CLIMBED",
                "android.permission.RECORD_AUDIO",
            ],
        },
        updates: {
            url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
        },
        runtimeVersion: {
            policy: "appVersion",
        },
        extra: {
            eas: {
                projectId: EAS_PROJECT_ID,
            },
            BACKEND_URL: process.env.EXPO_BACKEND_URL,
        },
        web: {
            favicon: FAVICON,
        },
        plugins: [
            "expo-secure-store",
            "expo-font",
            [
                "expo-splash-screen",
                {
                    image: SPLASH_IMAGE,
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#8f97db",
                },
            ],
            "expo-localization",
            [
                "react-native-health",
                {
                    isClinicalDataEnabled: true,
                    healthShareDescription: `${APP_NAME} needs access to your health data to provide personalized insights and recommendations.`,
                    healthUpdatePermission: `${APP_NAME} would like to access your health data.`,
                    healthClinicalDescription: `${APP_NAME} needs access to your health data to provide personalized insights and recommendations.`,
                },
            ],
            "expo-health-connect",
            [
                "expo-build-properties",
                {
                    android: {
                        compileSdkVersion: 35,
                        targetSdkVersion: 35,
                        minSdkVersion: 26,
                    },
                },
            ],
            [
                "expo-image-picker",
                {
                    photosPermission: `Allow ${APP_NAME} to access your photos`,
                    cameraPermission: `Allow ${APP_NAME} to open the camera`,
                },
            ],
            [
                "expo-av",
                {
                    microphonePermission: `${APP_NAME} needs access to your microphone for voice messages.`,
                },
            ],
            "expo-asset",
        ],
    };
};

// Dynamically configure the app based on the environment.
// Update these placeholders with your actual values.
export const getDynamicAppConfig = (environment: ENV_TYPE) => {
    if (environment === "production") {
        return {
            name: APP_NAME,
            bundleIdentifier: BUNDLE_IDENTIFIER,
            packageName: PACKAGE_NAME,
            scheme: SCHEME,
        };
    }

    if (environment === "preview") {
        return {
            name: `${APP_NAME} Preview`,
            bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
            packageName: `${PACKAGE_NAME}.preview`,
            scheme: `${SCHEME}-prev`,
        };
    }

    return {
        name: `${APP_NAME} Development`,
        bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
        packageName: `${PACKAGE_NAME}.dev`,
        scheme: `${SCHEME}-dev`,
    };
};
