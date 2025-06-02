import axios, { AxiosPromise } from "axios";

export class AuthService {
    static async login(email: string, password: string): AxiosPromise {
        return axios.post<{ token: string }>("/auth/login", {
            email,
            password,
        });
    }

    static async register(email: string, password: string): AxiosPromise {
        return axios.post<{ token: string }>("/auth/register", {
            email,
            password,
        });
    }
}
