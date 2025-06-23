import { UserInfoPayload } from "../base/users";

export interface UserState {
    user: UserInfoPayload | null;
    isLoading: boolean;
}

export interface UserActions {
    loadUserData: () => Promise<void>;
    clearUserData: () => void;
}
