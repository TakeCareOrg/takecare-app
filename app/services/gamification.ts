import axios, { AxiosPromise } from "axios";

import {
    GamificationProgressResponse,
    SyncStepsResponse,
} from "@app/types/gamification-types";

import i18n from "../i18n";

// TODO : Globalize this to avoid repeating in every service and handle language changes dynamically
const getHeaders = () => ({
    "Accept-Language": i18n.language || "fr-FR",
});

export class GamificationService {
    static syncSteps(steps: number): AxiosPromise<SyncStepsResponse> {
        return axios.post<SyncStepsResponse>(
            "/gamification/steps",
            { steps },
            { headers: getHeaders() },
        );
    }

    static getProgress(): AxiosPromise<GamificationProgressResponse> {
        return axios.get<GamificationProgressResponse>(
            "/gamification/progress",
            { headers: getHeaders() },
        );
    }
}
