import { UserStore } from "@dtypes/stores/users";
import UserSevices from "@app/services/users";
import { create } from "zustand";

const initialState = {
    users: [],
    loading: false,
};

export const useUserStore = create<UserStore>((set, get) => ({
    ...initialState,
    fetchUsers: async () => {
        set({ loading: true });
        try {
            const response = await UserSevices.getUserData();
            if (response.status === 200) {
                console.log("Fetched users:", response.data);

                set({
                    users: response.data,
                    loading: false,
                });
            }
        } catch (error) {
            set({ loading: false });
        }
    },
}));
