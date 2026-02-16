import { create } from "zustand";

import {
    ACCESS_TOKEN_KEY,
    emailRegex,
    passwordRegex,
    REFRESH_TOKEN_KEY,
} from "@constants/auth";
import { AuthActions, AuthState } from "@dtypes/stores/auth";
import { AuthService } from "@services/auth";
import { secureStorage } from "@utils/storage";

import { useUserStore } from "./users";

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
                const { accessToken, refreshToken } = response.data;
                await secureStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                await secureStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

                set({
                    isAuthenticated: true,
                    isLoading: false,
                });
                await useUserStore.getState().loadUserData();
            }
        } catch (error) {
            await secureStorage.removeItem(ACCESS_TOKEN_KEY);
            await secureStorage.removeItem(REFRESH_TOKEN_KEY);
            set({ isLoading: false, isAuthenticated: false });
            throw error;
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

        set({ isLoading: true });

        try {
            const response = await AuthService.register(email, password);
            if (response.status === 201 || response.status === 200) {
                const { accessToken, refreshToken } = response.data;
                await secureStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                await secureStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
                set({
                    isAuthenticated: true,
                    isLoading: false,
                });

                await useUserStore.getState().loadUserData();
            }
        } catch (error) {
            await secureStorage.removeItem(ACCESS_TOKEN_KEY);
            await secureStorage.removeItem(REFRESH_TOKEN_KEY);
            set({ isLoading: false, isAuthenticated: false });
            throw error;
        }
    },
    logout: async () => {
        try {
            const refreshToken = await secureStorage.getItem(REFRESH_TOKEN_KEY);
            if (refreshToken) {
                await AuthService.logout(refreshToken);
            }
        } catch {
            // Server-side logout failed — continue with local cleanup
        }

        await secureStorage.removeItem(ACCESS_TOKEN_KEY);
        await secureStorage.removeItem(REFRESH_TOKEN_KEY);
        set({
            ...initialState,
            isInitialized: true,
        });
        useUserStore.getState().clearUserData();
    },
    resetAuthState: () => {
        set({ ...initialState, isInitialized: true });
        useUserStore.getState().clearUserData();
    },
    checkAuthStatus: async () => {
        set({ isLoading: true });
        try {
            const accessToken = await secureStorage.getItem(ACCESS_TOKEN_KEY);
            const refreshToken = await secureStorage.getItem(REFRESH_TOKEN_KEY);

            if (!accessToken || !refreshToken) {
                await secureStorage.removeItem(ACCESS_TOKEN_KEY);
                await secureStorage.removeItem(REFRESH_TOKEN_KEY);
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
            await secureStorage.removeItem(ACCESS_TOKEN_KEY);
            await secureStorage.removeItem(REFRESH_TOKEN_KEY);
            useUserStore.getState().clearUserData();
            set({
                isAuthenticated: false,
                isLoading: false,
                isInitialized: true,
            });
        }
    },
}));
