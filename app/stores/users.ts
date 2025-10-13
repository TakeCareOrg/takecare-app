import { create } from "zustand";

import { UserActions, UserState } from "@dtypes/stores/users";
import { UserService } from "@services/users";

import { useAuthStore } from "./auth";

const initialState: UserState = {
    user: null,
    isLoading: false,
};

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set, get) => ({
    ...initialState,
    loadUserData: async () => {
        // Vérifier si l'utilisateur est authentifié
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) {
            set({ ...initialState });
            return;
        }

        if (get().user) {
            return;
        }

        set({ isLoading: true });

        try {
            // Fetch user data using the token
            const response = await UserService.loadUserData();
            if (response.status === 200) {
                set({ user: response.data.user, isLoading: false });
            }
        } catch (error) {
            set({ ...initialState });
            throw error; // Re-throw the error for handling in the component
        }
    },
    clearUserData: () => set({ ...initialState }),
}));

export const initializeUserAuth = () => {
    // Make sure both stores are initialized before setting up subscriptions
    useAuthStore.subscribe((state) => {
        if (!state.isAuthenticated) {
            useUserStore.getState().clearUserData();
        }
    });
};
