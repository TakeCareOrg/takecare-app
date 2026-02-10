import { AppState, AppStateStatus } from "react-native";

import { useAuthStore } from "@app/stores/auth";
import { useHealthDataStore } from "@app/stores/health-data";

let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null =
    null;
let syncInterval: ReturnType<typeof setInterval> | null = null;
let isSyncing = false; // Flag to prevent concurrent syncs

/**
 * Fetch health data and update the store
 */
export const syncHealthData = async () => {
    if (isSyncing) {
        return;
    }

    isSyncing = true;
    const {
        shouldRefetchToday,
        shouldRefetchHistorical,
        setTodayCache,
        setHistoricalCache,
    } = useHealthDataStore.getState();
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
        isSyncing = false;
        return;
    }

    try {
        // Import the platform-specific hook dynamically
        const { Platform } = require("react-native");
        let fetchHealthData;

        if (Platform.OS === "ios") {
            fetchHealthData =
                require("@app/hooks/health/use-health-data.ios").fetchHealthDataOnce;
        } else if (Platform.OS === "android") {
            fetchHealthData =
                require("@app/hooks/health/use-health-data.android").fetchHealthDataOnce;
        }

        if (!fetchHealthData) {
            isSyncing = false;
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
    } catch (error) {
    } finally {
        isSyncing = false;
    }
};

/**
 * Initialize health data synchronization
 * - Syncs on app start
 * - Syncs when app comes to foreground
 * - Syncs every 30 minutes in background
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
        30 * 60 * 1000,
    ); // 30 minutes
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
