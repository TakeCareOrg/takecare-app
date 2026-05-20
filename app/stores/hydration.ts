import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { HEALTH_TARGETS } from "@app/constants/health-targets";

function todayKey(date: Date = new Date()): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function pruneOldEntries(
    intake: Record<string, number>,
    keepDays = 7,
): Record<string, number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - keepDays);
    const cutoffKey = todayKey(cutoff);
    const next: Record<string, number> = {};
    for (const [key, value] of Object.entries(intake)) {
        if (key >= cutoffKey) next[key] = value;
    }
    return next;
}

interface HydrationState {
    targetMl: number;
    intakeByDay: Record<string, number>;
    addIntake: (ml: number) => void;
    setTarget: (ml: number) => void;
    reset: () => void;
    getTodayIntake: () => number;
}

export const useHydrationStore = create<HydrationState>()(
    persist(
        (set, get) => ({
            targetMl: HEALTH_TARGETS.HYDRATION_ML,
            intakeByDay: {},

            addIntake: (ml) => {
                const key = todayKey();
                const prev = get().intakeByDay[key] ?? 0;
                const next = pruneOldEntries({
                    ...get().intakeByDay,
                    [key]: prev + ml,
                });
                set({ intakeByDay: next });
            },

            setTarget: (ml) => set({ targetMl: ml }),

            reset: () =>
                set({
                    intakeByDay: {},
                    targetMl: HEALTH_TARGETS.HYDRATION_ML,
                }),

            getTodayIntake: () => get().intakeByDay[todayKey()] ?? 0,
        }),
        {
            name: "hydration-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                targetMl: state.targetMl,
                intakeByDay: state.intakeByDay,
            }),
            version: 1,
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.intakeByDay = pruneOldEntries(state.intakeByDay);
                }
            },
        },
    ),
);
