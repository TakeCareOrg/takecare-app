import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
    disconnectWithings as disconnectWithingsApi,
    fetchWithingsStatus,
    initiateWithingsConnect,
} from "@app/services/withings";
import type { WithingsConnectionState } from "@app/types/withings-types";

interface WithingsStore extends WithingsConnectionState {
    /** Refresh `connected` + metadata from the backend. */
    fetchStatus: () => Promise<void>;
    /** Returns the authorize URL the screen opens in a browser. */
    startConnect: () => Promise<{
        authorize_url: string;
        state: string;
    } | null>;
    /** Called once the OAuth deep-link returns success. */
    markConnected: () => Promise<void>;
    /** DELETE /withings/disconnect + local state reset. */
    disconnect: () => Promise<void>;
    /** Reset to default state — used on logout. */
    reset: () => void;
}

const defaultState: WithingsConnectionState = {
    connected: false,
    connectedAt: null,
    lastSyncedAt: null,
    subscribedApplis: [],
    isConnecting: false,
    error: null,
};

export const useWithingsStore = create<WithingsStore>()(
    persist(
        (set) => ({
            ...defaultState,

            fetchStatus: async () => {
                try {
                    const data = await fetchWithingsStatus();
                    set({
                        connected: data.connected,
                        connectedAt: data.connected_at ?? null,
                        lastSyncedAt: data.last_synced_at ?? null,
                        subscribedApplis: data.subscribed_applis ?? [],
                        error: null,
                    });
                } catch (error) {
                    // The backend may not have Withings configured (503).
                    // We don't surface that as an error to the user
                    // because the integration is opt-in by design.
                    set({ error: errorMessage(error) });
                }
            },

            startConnect: async () => {
                set({ isConnecting: true, error: null });
                try {
                    const data = await initiateWithingsConnect();
                    return data;
                } catch (error) {
                    set({
                        isConnecting: false,
                        error: errorMessage(error),
                    });
                    return null;
                }
            },

            markConnected: async () => {
                set({ isConnecting: false });
                // Re-fetch status so subscribedApplis + connectedAt
                // reflect what the backend just persisted.
                try {
                    const data = await fetchWithingsStatus();
                    set({
                        connected: data.connected,
                        connectedAt: data.connected_at ?? null,
                        lastSyncedAt: data.last_synced_at ?? null,
                        subscribedApplis: data.subscribed_applis ?? [],
                        error: null,
                    });
                } catch (error) {
                    set({ error: errorMessage(error) });
                }
            },

            disconnect: async () => {
                try {
                    await disconnectWithingsApi();
                } catch (error) {
                    set({ error: errorMessage(error) });
                    return;
                }
                set({
                    ...defaultState,
                });
            },

            reset: () => set({ ...defaultState }),
        }),
        {
            name: "withings-storage",
            storage: createJSONStorage(() => AsyncStorage),
            // Don't persist transient flags. `isConnecting` should
            // never survive a process restart, and `error` shouldn't
            // either (would surface a confusing message on next launch).
            partialize: (state) => ({
                connected: state.connected,
                connectedAt: state.connectedAt,
                lastSyncedAt: state.lastSyncedAt,
                subscribedApplis: state.subscribedApplis,
            }),
        },
    ),
);

function errorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Unknown error";
}
