import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { HealthData } from "@app/types/health-data-types";

interface HealthDataCache {
    data: HealthData;
    lastFetch: string; // ISO date
    dateRange: {
        startDate: string;
        endDate: string;
    };
}

interface HealthDataStore {
    // Today's data only (for Home, Chatbot)
    todayCache: HealthDataCache | null;
    // Historical data (for Steps, BPM, Sleep charts)
    historicalCache: HealthDataCache | null;

    isLoading: boolean;
    error: string | null;

    // Actions
    updateHealthData: (data: Partial<HealthData>) => void;
    setTodayCache: (cache: HealthDataCache) => void;
    setHistoricalCache: (cache: HealthDataCache) => void;
    clearCache: () => void;
    shouldRefetchToday: (startDate: string, endDate: string) => boolean;
    shouldRefetchHistorical: (startDate: string, endDate: string) => boolean;
}

export const useHealthDataStore = create<HealthDataStore>()(
    persist(
        (set, get) => ({
            todayCache: null,
            historicalCache: null,
            isLoading: false,
            error: null,

            updateHealthData: (data) => {
                const currentCache = get().todayCache;
                if (currentCache) {
                    set({
                        todayCache: {
                            ...currentCache,
                            data: { ...currentCache.data, ...data },
                            lastFetch: new Date().toISOString(),
                        },
                    });
                }
            },

            setTodayCache: (cache) => set({ todayCache: cache }),

            setHistoricalCache: (cache) => set({ historicalCache: cache }),

            clearCache: () =>
                set({ todayCache: null, historicalCache: null, error: null }),

            // Check if today's data needs refetch (more frequent - every 1 hour)
            shouldRefetchToday: (startDate, endDate) => {
                const { todayCache } = get();
                if (!todayCache) return true;

                // Check if cache data is mostly empty (incomplete fetch)
                const hasEmptyData =
                    todayCache.data.steps === null &&
                    todayCache.data.distance === null &&
                    todayCache.data.flights === null &&
                    todayCache.data.activeEnergyBurned === null;

                if (hasEmptyData) {
                    return true;
                }

                const now = new Date();
                const lastFetch = new Date(todayCache.lastFetch);
                const hoursSinceLastFetch =
                    (now.getTime() - lastFetch.getTime()) / (1000 * 60 * 60);

                // Refetch if:
                // 1. More than 1 hour since last fetch
                // 2. Date range changed
                return (
                    hoursSinceLastFetch > 0.25 ||
                    todayCache.dateRange.startDate !== startDate ||
                    todayCache.dateRange.endDate !== endDate
                );
            },

            // Check if historical data needs refetch (less frequent - every 24 hours)
            shouldRefetchHistorical: (startDate, endDate) => {
                const { historicalCache } = get();
                if (!historicalCache) {
                    return true;
                }

                // A previous fetch may have been throttled by Health Connect's
                // quota — the JS layer then stored an essentially empty
                // HealthData envelope, and without this guard the cache TTL
                // (24h) would keep the user stuck on empty screens until the
                // next day. Mirror the `shouldRefetchToday` heuristic: if all
                // the bulk arrays are null/empty, force a refetch on the very
                // next sync tick.
                const data = historicalCache.data;
                const hasEmptyData =
                    (data.steps?.length ?? 0) === 0 &&
                    (data.distance?.length ?? 0) === 0 &&
                    (data.flights?.length ?? 0) === 0 &&
                    (data.activeEnergyBurned?.length ?? 0) === 0 &&
                    (data.heartRate?.values?.length ?? 0) === 0 &&
                    (data.sleepAnalysis?.sleepSteps?.length ?? 0) === 0;

                if (hasEmptyData) {
                    return true;
                }

                // Check if data format is outdated (no stages in sleep data)
                const sleepData = historicalCache.data.sleepAnalysis;
                const hasOldFormat =
                    sleepData?.sleepSteps &&
                    sleepData.sleepSteps.length > 0 &&
                    sleepData.sleepSteps[0].stages === undefined;

                if (hasOldFormat) {
                    return true;
                }

                // Check if there are sessions with 0 duration (should have been filtered)
                if (sleepData?.sleepSteps && sleepData.sleepSteps.length > 0) {
                    const hasZeroDurationSessions = sleepData.sleepSteps.some(
                        (step) => (step.duration ?? 0) < 60,
                    );

                    if (hasZeroDurationSessions) {
                        return true;
                    }
                }

                // Check if there's obsolete data (sessions older than 90 days)
                if (sleepData?.sleepSteps && sleepData.sleepSteps.length > 0) {
                    const now = new Date();
                    const ninetyDaysAgo = new Date(
                        now.getTime() - 90 * 24 * 60 * 60 * 1000,
                    );

                    const hasOldSessions = sleepData.sleepSteps.some(
                        (step) =>
                            new Date(step.endDate).getTime() <
                            ninetyDaysAgo.getTime(),
                    );

                    if (hasOldSessions) {
                        return true;
                    }
                }

                const now = new Date();
                const lastFetch = new Date(historicalCache.lastFetch);
                const hoursSinceLastFetch =
                    (now.getTime() - lastFetch.getTime()) / (1000 * 60 * 60);

                // Refetch if:
                // 1. More than 24 hours since last fetch
                // 2. Date range changed
                return (
                    hoursSinceLastFetch > 24 ||
                    historicalCache.dateRange.startDate !== startDate ||
                    historicalCache.dateRange.endDate !== endDate
                );
            },
        }),
        {
            name: "health-data-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
