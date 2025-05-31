import { UserStore } from "@dtypes/stores/users";
import UserSevices from "@app/services/users";
import { create } from "zustand";
import { secureStorage } from "@utils/storage";

const initialState = {
    user: null,
    loadingUser: false,
};

export const useUserStore = create<UserStore>((set, get) => ({
    ...initialState,
    getUserData: async () => {
        set({ loadingUser: true });
        try {
            const token = await secureStorage.getItem("auth-storage-token");

            if (!token) {
                throw new Error("No authentication token found.");
            }

            // Fetch user data using the token
            const response = await UserSevices.getUserData(token);
            if (response.status === 200) {
                console.log("Fetched user data:", response.data.user);
                set({ user: response.data, loadingUser: false });
            }
        } catch (error) {
            set({ loadingUser: false });
            throw error; // Re-throw the error for handling in the component
        }
    },
    clearUserData: () => set(initialState),
}));
