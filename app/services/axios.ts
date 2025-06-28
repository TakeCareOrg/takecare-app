import axios from "axios";

import Constants from "expo-constants";

import { secureStorage } from "@utils/storage";

axios.defaults.baseURL = Constants?.expoConfig?.extra?.BACKEND_URL;
axios.defaults.withCredentials = true; // Enable cookies for cross-site requests
axios.defaults.timeout = 20000; // Set a timeout for requests

axios.interceptors.request.use(async (config) => {
    const token = await secureStorage.getItem("auth-storage-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axios;
