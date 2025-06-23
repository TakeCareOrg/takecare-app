import { User, UserInfoPayload } from "@app/types/base/users";
import axios, { AxiosPromise } from "axios";

export class UserService {
    static async loadUserData(): AxiosPromise<{ user: UserInfoPayload }> {
        return axios.get<{ user: UserInfoPayload }>("/users/me");
    }
}
