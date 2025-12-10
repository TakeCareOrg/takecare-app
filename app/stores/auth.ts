import { create } from "zustand";

import { emailRegex, passwordRegex } from "@constants/auth";
import { AuthActions, AuthState } from "@dtypes/stores/auth";
import { AuthService } from "@services/auth";
import { secureStorage } from "@utils/storage";

import { useUserStore } from "./users";

const STORAGE_KEY = "auth-storage-token";

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
};

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set, get) => ({
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

        set({ isLoading: true });

        try {
            const response = await AuthService.login(email, password);
            if (response.status === 200) {
                const { token } = response.data;
                // Store in secure storage
                await secureStorage.setItem(STORAGE_KEY, token);
                set({
                    isAuthenticated: true,
                    isLoading: false,
                });
                await useUserStore.getState().loadUserData();
            }
        } catch (error) {
            set({ isLoading: false, isAuthenticated: false });
            throw error; // Re-throw the error for handling in the component
        }
    },
    register: async (email, password, confirmPassword) => {
        if (!email || !password || !confirmPassword) {
            throw new Error("ALL_FIELDS_REQUIRED");
        }
        if (!email.match(emailRegex)) {
            throw new Error("INVALID_EMAIL_FORMAT");
        }
        if (
            !password.match(passwordRegex) ||
            !confirmPassword.match(passwordRegex)
        ) {
            throw new Error("PASSWORD_VALIDATION_FAILED");
        }
        if (password !== confirmPassword) {
            throw new Error("PASSWORDS_DO_NOT_MATCH");
        }

        try {
            const response = await AuthService.register(email, password);
            if (response.status === 201) {
                const { token } = response.data;
                // Store in secure storage
                await secureStorage.setItem(STORAGE_KEY, token);
                set({
                    isAuthenticated: true,
                    isLoading: false,
                });

                // Fetch user data after successful registration
                await useUserStore.getState().loadUserData();
            }
        } catch (error) {
            set({ isLoading: false, isAuthenticated: false });
            throw error; // Re-throw the error for handling in the component
        }
    },
    logout: async () => {
        // Clear the token from secure storage
        await secureStorage.removeItem(STORAGE_KEY);
        set({
            ...initialState,
            isInitialized: true,
        });
        useUserStore.getState().clearUserData();
    },
    checkAuthStatus: async () => {
        set({ isLoading: true });
        try {
            const hasToken = await secureStorage.getItem(STORAGE_KEY);

            if (!hasToken) {
                set({
                    isAuthenticated: false,
                    isLoading: false,
                    isInitialized: true,
                });
                return;
            }

            set({
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
            });
            await useUserStore.getState().loadUserData();
        } catch {
            await secureStorage.removeItem(STORAGE_KEY);
            useUserStore.getState().clearUserData();
            set({
                isAuthenticated: false,
                isLoading: false,
                isInitialized: true,
            });
        }
    },
}));
