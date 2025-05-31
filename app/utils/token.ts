// app/utils/token.ts
import * as SecureStore from "expo-secure-store";
import { useUserStore } from "@stores/users";
import { useAuthStore } from "@app/stores/auth";

export const restoreSession = async (): Promise<boolean> => {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
        try {
            await useUserStore.getState().getUserData();
            return true;
        } catch (err) {
            useAuthStore.getState().logout();
            throw new Error("Token invalid or expired");
        }
    } else {
        useAuthStore.getState().logout();
        throw new Error("No token found");
    }

    return false;
};
