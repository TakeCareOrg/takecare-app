import axios, { AxiosPromise } from "axios";

import { UserInfoPayload } from "@dtypes/base/users";

export class UserService {
    static async loadUserData(): AxiosPromise<{ user: UserInfoPayload }> {
        return axios.get<{ user: UserInfoPayload }>("/users/me");
    }
}
