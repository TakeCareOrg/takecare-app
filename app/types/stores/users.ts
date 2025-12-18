import { UserHealthAttributions, UserInfoPayload } from "../base/users";

export interface UserState {
    user: UserInfoPayload | null;
    isLoading: boolean;
}

export interface UserActions {
    loadUserData: (forceReload?: boolean) => Promise<void>;
    clearUserData: () => void;
    updateUserHealthData: (
        data: Omit<Partial<UserHealthAttributions>, "user_id" | "created_at">,
    ) => Promise<void>;
}
