import { UserStore } from "@dtypes/stores/users";
import { UserService } from "@app/services/users";
import { create } from "zustand";

const initialState = {
    user: null,
    loadingUser: false,
};

export const useUserStore = create<UserStore>((set, get) => ({
    ...initialState,
    getUserData: async () => {
        set({ loadingUser: true });
        try {
            // Fetch user data using the token
            const response = await UserService.getUserData();
            if (response.status === 200) {
                set({ user: response.data.user, loadingUser: false });
            }
        } catch (error) {
            set({ loadingUser: false });
            throw error; // Re-throw the error for handling in the component
        }
    },
    clearUserData: () => set(initialState),
}));
