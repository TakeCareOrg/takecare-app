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
    cache: HealthDataCache | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    updateHealthData: (data: Partial<HealthData>) => void;
    setCache: (cache: HealthDataCache) => void;
    clearCache: () => void;
    shouldRefetch: (startDate: string, endDate: string) => boolean;
}

export const useHealthDataStore = create<HealthDataStore>()(
    persist(
        (set, get) => ({
            cache: null,
            isLoading: false,
            error: null,

            updateHealthData: (data) => {
                const currentCache = get().cache;
                if (currentCache) {
                    set({
                        cache: {
                            ...currentCache,
                            data: { ...currentCache.data, ...data },
                            lastFetch: new Date().toISOString(),
                        },
                    });
                }
            },

            setCache: (cache) => set({ cache }),

            clearCache: () => set({ cache: null, error: null }),

            // Détermine s'il faut refetch (ex: changement de date, données trop anciennes)
            shouldRefetch: (startDate, endDate) => {
                const { cache } = get();
                if (!cache) return true;

                const now = new Date();
                const lastFetch = new Date(cache.lastFetch);
                const hoursSinceLastFetch =
                    (now.getTime() - lastFetch.getTime()) / (1000 * 60 * 60);

                // Refetch si:
                // 1. Plus de 1 heure depuis le dernier fetch
                // 2. Changement de plage de dates
                return (
                    hoursSinceLastFetch > 1 ||
                    cache.dateRange.startDate !== startDate ||
                    cache.dateRange.endDate !== endDate
                );
            },
        }),
        {
            name: "health-data-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
