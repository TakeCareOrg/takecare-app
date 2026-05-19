import {
    HealthKitCategoryType,
    HealthKitModule,
    HealthKitQuantityType,
} from "@takecareorg/takecare-healthkit";
import { AppState, AppStateStatus, Platform } from "react-native";

import Constants from "expo-constants";

import { ACCESS_TOKEN_KEY } from "@app/constants/auth";
import { useAuthStore } from "@app/stores/auth";
import { useGamificationStore } from "@app/stores/gamification";
import { useHealthDataStore } from "@app/stores/health-data";
import { BasesHealthValue } from "@app/types/health-data-types";
import { secureStorage } from "@app/utils/storage";

let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null =
    null;
let syncInterval: ReturnType<typeof setInterval> | null = null;
let syncPromise: Promise<void> | null = null;

/**
 * Default record types the native background sync worker should pull from
 * Health Connect / HealthKit when it ticks. Mirrors the foreground sync set
 * below (`performSync`).
 */
const DEFAULT_BG_SYNC_TYPES = [
    HealthKitQuantityType.STEPS,
    HealthKitQuantityType.HEART_RATE,
    HealthKitQuantityType.ACTIVE_ENERGY_BURNED,
    HealthKitQuantityType.DISTANCE_WALKING_RUNNING,
    HealthKitQuantityType.FLIGHTS_CLIMBED,
    HealthKitCategoryType.SLEEP_ANALYSIS,
];

/**
 * Perform the actual sync work
 */
const performSync = async () => {
    const {
        shouldRefetchToday,
        shouldRefetchHistorical,
        setTodayCache,
        setHistoricalCache,
    } = useHealthDataStore.getState();
    const { isAuthenticated } = useAuthStore.getState();
    const { syncSteps } = useGamificationStore.getState();

    // eslint-disable-next-line no-console
    console.log("[HealthSync] performSync start, isAuth=", isAuthenticated);
    if (!isAuthenticated) {
        // eslint-disable-next-line no-console
        console.log("[HealthSync] not authenticated — bailing");
        return;
    }

    try {
        let fetchHealthData;

        if (Platform.OS === "ios") {
            fetchHealthData =
                require("@app/services/health/fetch-health-data.ios").fetchHealthData;
        } else if (Platform.OS === "android") {
            fetchHealthData =
                require("@app/services/health/fetch-health-data.android").fetchHealthData;
        }

        if (!fetchHealthData) {
            return;
        }

        // 1. Fetch today's data (for Home, Chatbot)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayStartStr = todayStart.toISOString();
        const todayEndStr = todayEnd.toISOString();

        const needsRefetchToday = shouldRefetchToday(
            todayStartStr,
            todayEndStr,
        );
        // eslint-disable-next-line no-console
        console.log("[HealthSync] today: needsRefetch=", needsRefetchToday);

        if (needsRefetchToday) {
            const todayData = await fetchHealthData({
                startDate: todayStart,
                endDate: todayEnd,
            });

            if (todayData) {
                setTodayCache({
                    data: todayData,
                    lastFetch: new Date().toISOString(),
                    dateRange: {
                        startDate: todayStartStr,
                        endDate: todayEndStr,
                    },
                });

                const stepCount =
                    todayData.steps?.reduce(
                        (sum: number, step: BasesHealthValue) =>
                            sum + (step.value || 0),
                        0,
                    ) || null;

                if (stepCount !== null && stepCount > 0) {
                    await syncSteps(stepCount).catch(() => {});
                }
            }
        }

        // 2. Fetch historical data (1 year back for charts)
        //
        // We used to pull 10 years here, which forced Health Connect to
        // serve ~3000 chunked read calls per refresh (6 record types ×
        // ~520 7-day chunks). HC's daily/burst quota blows up well before
        // that, leaves every chunk empty, and the cached empty envelope
        // then traps the user on a blank Steps/BPM screen until the cache
        // TTL expires. 1 year is plenty for the detail charts the app
        // exposes today (which show at most a few months) and keeps the
        // total call count comfortably within HC's local budget.
        const historicalStart = new Date();
        historicalStart.setFullYear(historicalStart.getFullYear() - 1);
        historicalStart.setHours(0, 0, 0, 0);
        const historicalEnd = new Date();
        historicalEnd.setHours(23, 59, 59, 999);

        const historicalStartStr = historicalStart.toISOString();
        const historicalEndStr = historicalEnd.toISOString();

        const needsRefetchHistorical = shouldRefetchHistorical(
            historicalStartStr,
            historicalEndStr,
        );
        // eslint-disable-next-line no-console
        console.log(
            "[HealthSync] historical: needsRefetch=",
            needsRefetchHistorical,
            "range=",
            historicalStartStr,
            "→",
            historicalEndStr,
        );

        if (needsRefetchHistorical) {
            // eslint-disable-next-line no-console
            console.log("[HealthSync] historical: fetching...");
            const historicalData = await fetchHealthData({
                startDate: historicalStart,
                endDate: historicalEnd,
            });

            // eslint-disable-next-line no-console
            console.log(
                "[HealthSync] historical: fetched. steps=",
                historicalData?.steps?.length ?? 0,
                "heartRate=",
                historicalData?.heartRate?.values?.length ?? 0,
                "sleepSteps=",
                historicalData?.sleepAnalysis?.sleepSteps?.length ?? 0,
            );
            if (historicalData) {
                // Defensive: refuse to overwrite the existing cache with an
                // empty envelope. Without this guard a single throttled
                // sync (HC quota exhausted, no records returned) would
                // wipe whatever the user had cached previously and pin
                // them to empty detail screens until the next refetch.
                const hasAnyHistoricalData =
                    (historicalData.steps?.length ?? 0) > 0 ||
                    (historicalData.distance?.length ?? 0) > 0 ||
                    (historicalData.flights?.length ?? 0) > 0 ||
                    (historicalData.activeEnergyBurned?.length ?? 0) > 0 ||
                    (historicalData.heartRate?.values?.length ?? 0) > 0 ||
                    (historicalData.sleepAnalysis?.sleepSteps?.length ?? 0) >
                        0 ||
                    (historicalData.workouts?.length ?? 0) > 0;

                if (hasAnyHistoricalData) {
                    setHistoricalCache({
                        data: historicalData,
                        lastFetch: new Date().toISOString(),
                        dateRange: {
                            startDate: historicalStartStr,
                            endDate: historicalEndStr,
                        },
                    });
                } else {
                    // eslint-disable-next-line no-console
                    console.log(
                        "[HealthSync] historical: empty result, not caching (will retry next tick)",
                    );
                }
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
};

/**
 * Fetch health data and update the store + sync with gamification.
 * If a sync is already in progress, returns the existing promise
 * to prevent concurrent syncs.
 */
export const syncHealthData = (): Promise<void> => {
    if (syncPromise) {
        return syncPromise;
    }

    syncPromise = performSync().finally(() => {
        syncPromise = null;
    });

    return syncPromise;
};

/**
 * Initialize health data synchronization
 * - Syncs on app start
 * - Syncs when app comes to foreground
 * - Syncs every 15 minutes in background
 * - Registers the native background sync (Health Connect + WorkManager on Android)
 *   so deltas keep flowing even when the app is killed.
 */
export const initializeHealthSync = () => {
    // Initial sync
    syncHealthData();

    // Best-effort: arm the native background worker. Failures are swallowed —
    // foreground sync still works without it.
    void (async () => {
        try {
            const token = await secureStorage.getItem(ACCESS_TOKEN_KEY);
            if (token) {
                await registerNativeBackgroundSync(token);
            }
        } catch {
            // ignore
        }
    })();

    // Sync when app state changes (foreground/background)
    appStateSubscription = AppState.addEventListener(
        "change",
        (nextAppState: AppStateStatus) => {
            if (nextAppState === "active") {
                syncHealthData();
            }
        },
    );

    // Periodic sync every 30 minutes
    syncInterval = setInterval(
        () => {
            const appState = AppState.currentState;
            if (appState === "active") {
                syncHealthData();
            }
        },
        15 * 60 * 1000,
    ); // 15 minutes
};

/**
 * Cleanup health sync listeners
 */
export const cleanupHealthSync = () => {
    if (appStateSubscription) {
        appStateSubscription.remove();
        appStateSubscription = null;
    }

    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }
};

/**
 * Register the native background sync (WorkManager on Android, BGTaskScheduler on iOS
 * once parity ships) so the backend keeps receiving health data even when the app is
 * fully backgrounded or killed.
 *
 * Call this once on successful login. Safe to call repeatedly — the native side
 * replaces any previously registered task with the new credentials.
 */
export const registerNativeBackgroundSync = async (
    jwtToken: string,
): Promise<void> => {
    const baseUrl = Constants?.expoConfig?.extra?.BACKEND_URL as
        | string
        | undefined;
    if (!baseUrl || !jwtToken) {
        return;
    }
    try {
        await HealthKitModule.registerBackgroundSync({
            apiBaseUrl: baseUrl,
            jwtToken,
            intervalMinutes: 15,
            types: DEFAULT_BG_SYNC_TYPES,
            syncPath: "/users/health-data",
        });
    } catch {
        // Non-fatal: the foreground sync keeps working even if the worker fails to register.
    }
};

/**
 * Tear down the native background sync — call on logout so the worker stops POSTing
 * with a (now invalid) token.
 */
export const unregisterNativeBackgroundSync = async (): Promise<void> => {
    try {
        await HealthKitModule.unregisterBackgroundSync();
    } catch {
        // Worker may not be registered yet on a fresh install — ignore.
    }
};

/**
 * Detect whether the native background sync is currently armed. Useful for surfacing
 * "Background sync: on/off" in settings.
 */
export const isNativeBackgroundSyncRegistered = async (): Promise<boolean> => {
    try {
        return await HealthKitModule.isBackgroundSyncRegistered();
    } catch {
        return false;
    }
};
