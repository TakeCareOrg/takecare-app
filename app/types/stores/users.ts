import { User } from "../base/users";

export interface UserStore {
    user: User | null;
    loadingUser: boolean;
    getUserData: () => Promise<void>;
    clearUserData: () => void;
}
