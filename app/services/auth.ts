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

    /**
     * Step 1: Request a password reset code to be sent to the user's email
     */
    static forgotPassword(email: string): AxiosPromise<{ message: string }> {
        return axios.post<{ message: string }>("/auth/forgot-password", {
            email,
        });
    }

    /**
     * Step 2: Verify the reset code and get a temporary token
     */
    static verifyResetCode(
        email: string,
        code: string,
    ): AxiosPromise<{ token: string }> {
        return axios.post<{ token: string }>("/auth/verify-reset-code", {
            email,
            code,
        });
    }

    /**
     * Step 3: Reset the password using the token from step 2
     * Note: The token is automatically added via axios interceptor
     */
    static resetPassword(password: string): AxiosPromise<{ message: string }> {
        return axios.post<{ message: string }>("/auth/reset-password", {
            password,
        });
    }
}
