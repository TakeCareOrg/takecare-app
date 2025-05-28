import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStorage } from "@utils/storage";
import { AuthStore } from "@dtypes/stores/auth";
import { useUserStore } from "./users";

const initialState = {
    token: null,
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            ...initialState,
            login: async (email, password) => {
                // Fake API call — replace with your real API
                if (email === "test@example.com" && password === "123456") {
                    const token = "fake-jwt-token";

                    const userStore = useUserStore.getState();
                    userStore.fetchUsers();
                    set({ token });
                } else {
                    throw new Error("Invalid credentials");
                }
            },
            register: async (email, password) => {
                // Fake API call — replace with your real API
                const token = "fake-jwt-token";
                const userStore = useUserStore.getState();
                userStore.fetchUsers();
                set({ token });
            },
            logout: () => set({ token: null }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => secureStorage),
            partialize: (state) => ({ token: state.token }),
        },
    ),
);
