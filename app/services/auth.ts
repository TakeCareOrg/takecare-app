import axios, { AxiosPromise } from "axios";

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    static login(email: string, password: string): AxiosPromise<AuthTokens> {
        return axios.post<AuthTokens>("/auth/login", {
            email,
            password,
        });
    }

    static register(email: string, password: string): AxiosPromise<AuthTokens> {
        return axios.post<AuthTokens>("/auth/register", {
            email,
            password,
        });
    }

    static logout(refreshToken: string): AxiosPromise<void> {
        return axios.post<void>("/auth/logout", {
            refreshToken,
        });
    }
}
