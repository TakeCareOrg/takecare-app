import { AppState, AppStateStatus } from "react-native";

import { useAuthStore } from "@app/stores/auth";
import { useHealthDataStore } from "@app/stores/health-data";

let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null =
    null;
let syncInterval: NodeJS.Timeout | null = null;

/**
 * Fetch health data and update the store
 */
export const syncHealthData = async () => {
    const { shouldRefetch, setCache } = useHealthDataStore.getState();
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) return;

    // Get today's date range
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    // Check if we need to refetch
    if (!shouldRefetch(startDateStr, endDateStr)) {
        console.log("Health data is up to date, skipping sync");
        return;
    }

    console.log("Syncing health data...");

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
            console.warn("Platform not supported for health data sync");
            return;
        }

        const data = await fetchHealthData({ startDate, endDate });

        console.log("Y A DE LA DATA:", data);

        if (data) {
            setCache({
                data,
                lastFetch: new Date().toISOString(),
                dateRange: {
                    startDate: startDateStr,
                    endDate: endDateStr,
                },
            });
            console.log("Health data synced successfully");
        }
    } catch (error) {
        console.error("Error syncing health data:", error);
    }
};

/**
 * Initialize health data synchronization
 * - Syncs on app start
 * - Syncs when app comes to foreground
 * - Syncs every 30 minutes in background
 */
export const initializeHealthSync = () => {
    console.log("Initializing health sync...");

    // Initial sync
    syncHealthData();

    // Sync when app state changes (foreground/background)
    appStateSubscription = AppState.addEventListener(
        "change",
        (nextAppState: AppStateStatus) => {
            if (nextAppState === "active") {
                console.log("App became active, syncing health data");
                syncHealthData();
            }
        },
    );

    // Periodic sync every 30 minutes
    syncInterval = setInterval(
        () => {
            const appState = AppState.currentState;
            if (appState === "active") {
                console.log("Periodic sync triggered");
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
    console.log("Cleaning up health sync...");

    if (appStateSubscription) {
        appStateSubscription.remove();
        appStateSubscription = null;
    }

    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }
};
