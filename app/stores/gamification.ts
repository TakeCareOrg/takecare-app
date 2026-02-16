import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { GamificationService } from "@app/services/gamification";
import { Achievement, LevelInfo } from "@app/types/gamification-types";

import { useAuthStore } from "./auth";
import { useUserStore } from "./users";

interface GamificationCache {
    achievements: Achievement[];
    totalPoints: number;
    levelInfo: LevelInfo | null;
    lastFetch: string;
}

interface GamificationState {
    cache: GamificationCache | null;
    isLoading: boolean;
    error: string | null;
}

interface GamificationActions {
    syncSteps: (steps: number) => Promise<Achievement[] | undefined>;
    fetchProgress: (forceReload?: boolean) => Promise<void>;
    clearCache: () => void;
    shouldRefetch: () => boolean;
}

const initialState: GamificationState = {
    cache: null,
    isLoading: false,
    error: null,
};

type GamificationStore = GamificationState & GamificationActions;

export const useGamificationStore = create<GamificationStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            syncSteps: async (steps: number) => {
                const isAuthenticated = useAuthStore.getState().isAuthenticated;
                const user = useUserStore.getState().user;

                if (!isAuthenticated || !user?.user_id) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await GamificationService.syncSteps(steps);

                    if (response.status === 200 && response.data.success) {
                        const { data } = response.data;

                        if (data) {
                            const currentCache = get().cache;
                            const updatedAchievements = [
                                ...(currentCache?.achievements || []),
                                ...data.newAchievements,
                            ];

                            set({
                                cache: {
                                    achievements: updatedAchievements,
                                    totalPoints: data.totalPoints,
                                    levelInfo: data.levelInfo,
                                    lastFetch: new Date().toISOString(),
                                },
                                isLoading: false,
                            });

                            return data.newAchievements;
                        }
                    }
                } catch (error) {
                    set({
                        error: (error as Error).message,
                        isLoading: false,
                    });
                    throw error;
                }
            },

            fetchProgress: async (forceReload = false) => {
                const isAuthenticated = useAuthStore.getState().isAuthenticated;

                if (!isAuthenticated) {
                    set({ ...initialState });
                    return;
                }

                if (!forceReload && get().cache) {
                    if (!get().shouldRefetch()) {
                        return;
                    }
                }

                const user = useUserStore.getState().user;

                if (!user?.user_id) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await GamificationService.getProgress();

                    if (response.status === 200 && response.data.success) {
                        const { data } = response.data;

                        if (data) {
                            set({
                                cache: {
                                    achievements: data.achievements,
                                    totalPoints: data.totalPoints,
                                    levelInfo: data.levelInfo,
                                    lastFetch: new Date().toISOString(),
                                },
                                isLoading: false,
                            });
                        }
                    }
                } catch (error) {
                    set({
                        ...initialState,
                    });
                    throw error;
                }
            },

            clearCache: () => set({ ...initialState }),

            shouldRefetch: () => {
                const { cache } = get();
                if (!cache) return true;

                const now = new Date();
                const lastFetch = new Date(cache.lastFetch);
                const hoursSinceLastFetch =
                    (now.getTime() - lastFetch.getTime()) / (1000 * 60 * 60);

                return hoursSinceLastFetch > 1;
            },
        }),
        {
            name: "gamification-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

export const initializeGamification = () => {
    useAuthStore.subscribe((state) => {
        if (!state.isAuthenticated) {
            useGamificationStore.getState().clearCache();
        }
    });
};
