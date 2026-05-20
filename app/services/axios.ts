import axios, { AxiosError, create, InternalAxiosRequestConfig } from "axios";

import Constants from "expo-constants";

import i18n from "@app/i18n";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@constants/auth";
import { secureStorage } from "@utils/storage";

axios.defaults.baseURL = Constants?.expoConfig?.extra?.BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 20000;

// Bare instance without interceptors — used exclusively for the refresh
// call so that a 403 from /auth/refresh is never re-queued by the
// response interceptor (which would cause a deadlock).
const refreshClient = create({
    baseURL: Constants?.expoConfig?.extra?.BACKEND_URL,
    withCredentials: true,
    timeout: 20000,
});

// --- Request interceptor: attach access token ---
axios.interceptors.request.use(async (config) => {
    const accessToken = await secureStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers["Accept-Language"] = i18n.language || "fr-FR";

    return config;
});

// --- Response interceptor: handle 403 with token refresh ---
let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach((promise) => {
        if (token) {
            promise.resolve(token);
        } else {
            promise.reject(error);
        }
    });
    failedQueue = [];
};

axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status !== 403 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axios(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = await secureStorage.getItem(REFRESH_TOKEN_KEY);

            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const { data } = await refreshClient.post("/auth/refresh", {
                refreshToken,
            });
            const { accessToken, refreshToken: newRefreshToken } = data;

            await secureStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            await secureStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            processQueue(null, accessToken);

            return axios(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);

            await secureStorage.removeItem(ACCESS_TOKEN_KEY);
            await secureStorage.removeItem(REFRESH_TOKEN_KEY);

            // Lazy-import to avoid circular dependency with the auth store
            const { useAuthStore } = require("@stores/auth");
            useAuthStore.getState().resetAuthState();

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export default axios;
