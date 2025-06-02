import { User } from "@app/types/base/users";
import axios, { AxiosPromise } from "axios";

export class UserService {
    static async getUserData(): AxiosPromise<{ user: User }> {
        return axios.get<{ user: User }>("/users/me");
    }
}
