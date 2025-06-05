import { User } from "../base/users";

export interface UserState {
    user: User | null;
    isLoading: boolean;
}

export interface UserActions {
    loadUserData: () => Promise<void>;
    clearUserData: () => void;
}
