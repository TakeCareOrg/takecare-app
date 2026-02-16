import axios, { AxiosPromise } from "axios";

import {
    GamificationProgressResponse,
    SyncStepsResponse,
} from "@app/types/gamification-types";

export class GamificationService {
    static syncSteps(steps: number): AxiosPromise<SyncStepsResponse> {
        return axios.post<SyncStepsResponse>("/gamification/steps", { steps });
    }

    static getProgress(): AxiosPromise<GamificationProgressResponse> {
        return axios.get<GamificationProgressResponse>(
            "/gamification/progress",
        );
    }
}
