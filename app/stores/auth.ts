import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStorage } from "@utils/storage";
import { AuthStore } from "@dtypes/stores/auth";
import { useUserStore } from "./users";
import { emailRegex, passwordRegex } from "@app/constants/auth";
import { AuthService } from "@app/services/auth";

const initialState = {
    token: null,
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            ...initialState,
            login: async (email, password) => {
                if (!email || !password) {
                    throw new Error("Email and password are required.");
                }

                if (!email.match(emailRegex)) {
                    throw new Error(
                        "Invalid email format. Please enter a valid email address.",
                    );
                }

                if (!password.match(passwordRegex)) {
                    throw new Error(
                        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
                    );
                }

                const response = await AuthService.login(email, password);
                if (response.status === 200) {
                    const { token } = response.data;
                    set({ token });
                    secureStorage.setItem("auth-storage-token", token);
                    await useUserStore.getState().getUserData();
                }
            },
            register: async (email, password) => {
                // Fake API call — replace with your real API
                const token = "fake-jwt-token";
                await useUserStore.getState().getUserData();
                set({ token });
            },
            logout: () => async () => {
                useUserStore.setState({ user: null, loadingUser: false });
                set({ token: null });
            },
        }),
        {
            name: "auth-storage-token",
            storage: createJSONStorage(() => secureStorage),
            partialize: (state) => state.token,
        },
    ),
);
