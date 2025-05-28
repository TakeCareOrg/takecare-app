import { User } from "@app/types/base/users";
import axios, { AxiosPromise } from "axios";

async function getUserData(): AxiosPromise<User[]> {
    return axios.get<User[]>("https://jsonplaceholder.typicode.com/users");
}

export default {
    getUserData,
};
