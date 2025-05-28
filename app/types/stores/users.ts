import { User } from "../base/users";

export interface UserStore {
    users: User[];
    loading: boolean;
    fetchUsers: () => Promise<void>;
}
