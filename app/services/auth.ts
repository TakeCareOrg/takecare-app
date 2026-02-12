import axios, { AxiosPromise } from "axios";

export class AuthService {
    static login(
        email: string,
        password: string,
    ): AxiosPromise<{ token: string }> {
        return axios.post<{ token: string }>("/auth/login", {
            email,
            password,
        });
    }

    static register(
        email: string,
        password: string,
    ): AxiosPromise<{ token: string }> {
        return axios.post<{ token: string }>("/auth/register", {
            email,
            password,
        });
    }
}
