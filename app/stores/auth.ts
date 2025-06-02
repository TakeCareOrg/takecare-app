import { create } from "zustand";
import { secureStorage } from "@utils/storage";
import { AuthStore } from "@dtypes/stores/auth";
import { useUserStore } from "./users";
import { emailRegex, passwordRegex } from "@app/constants/auth";
import { AuthService } from "@app/services/auth";

const STORAGE_KEY = "auth-storage-token";

export const useAuthStore = create<AuthStore>()(() => ({
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
            // Store in secure storage
            await secureStorage.setItem(STORAGE_KEY, token);
            await useUserStore.getState().getUserData();
        }
    },
    register: async (email, password) => {
        // Fake API call — replace with your real API
        const token = "fake-jwt-token";
        // Store in secure storage
        await secureStorage.setItem(STORAGE_KEY, token);
        await useUserStore.getState().getUserData();
    },
    logout: async () => {
        // Clear the token from secure storage
        await secureStorage.removeItem(STORAGE_KEY);
        useUserStore.getState().clearUserData();
    },
}));
