import axios, { AxiosPromise } from "axios";

export class AuthService {
    static async login(email: string, password: string): AxiosPromise {
        return axios.post("/auth/login", { email, password });
    }
}
