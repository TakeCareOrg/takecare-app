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
    loadUserData: async (forceReload = false) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) {
            set({ ...initialState });
            return;
        }

        if (!forceReload && get().user) {
            return;
        }

        set({ isLoading: true });

        try {
            const response = await UserService.loadUserData();
            if (response.status === 200) {
                set({ user: response.data.user, isLoading: false });
            }
        } catch (error) {
            set({ ...initialState });
            throw error;
        }
    },
    updateUserHealthData: async (data) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated || !get().user) {
            throw new Error("User not authenticated");
        }
        const currentUser = get().user;
        if (!currentUser) return;

        try {
            const response = await UserService.updateUserHealthData(data);
            if (response.status === 200) {
                set({
                    user: {
                        ...currentUser,
                        health: {
                            ...(get().user?.health || {}),
                            ...response.data.user,
                        },
                    },
                    isLoading: false,
                });
            }
        } catch (error) {
            throw error;
        }
    },
    clearUserData: () => set({ ...initialState }),
}));

export const initializeUserAuth = () => {
    useAuthStore.subscribe((state) => {
        if (!state.isAuthenticated) {
            useUserStore.getState().clearUserData();
        }
    });
};
