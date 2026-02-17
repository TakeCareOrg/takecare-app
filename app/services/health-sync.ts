import { AppState, AppStateStatus, Platform } from "react-native";

import { useAuthStore } from "@app/stores/auth";
import { useGamificationStore } from "@app/stores/gamification";
import { useHealthDataStore } from "@app/stores/health-data";
import { BasesHealthValue } from "@app/types/health-data-types";

let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null =
    null;
let syncInterval: ReturnType<typeof setInterval> | null = null;
let syncPromise: Promise<void> | null = null;

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

    if (!isAuthenticated) {
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

        // 2. Fetch historical data (10 years back for charts)
        const historicalStart = new Date();
        historicalStart.setFullYear(historicalStart.getFullYear() - 10);
        historicalStart.setHours(0, 0, 0, 0);
        const historicalEnd = new Date();
        historicalEnd.setHours(23, 59, 59, 999);

        const historicalStartStr = historicalStart.toISOString();
        const historicalEndStr = historicalEnd.toISOString();

        const needsRefetchHistorical = shouldRefetchHistorical(
            historicalStartStr,
            historicalEndStr,
        );

        if (needsRefetchHistorical) {
            const historicalData = await fetchHealthData({
                startDate: historicalStart,
                endDate: historicalEnd,
            });

            if (historicalData) {
                setHistoricalCache({
                    data: historicalData,
                    lastFetch: new Date().toISOString(),
                    dateRange: {
                        startDate: historicalStartStr,
                        endDate: historicalEndStr,
                    },
                });
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
 */
export const initializeHealthSync = () => {
    // Initial sync
    syncHealthData();

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
