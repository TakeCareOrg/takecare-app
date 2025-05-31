import { User } from "@app/types/base/users";
import axios, { AxiosPromise } from "axios";

async function getUserData(token: string): AxiosPromise {
    return axios.get<{ user: User }>("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export default {
    getUserData,
};
