import axios, { AxiosPromise } from "axios";

import {
    GamificationProgressResponse,
    SyncStepsResponse,
} from "@app/types/gamification-types";

export class GamificationService {
    static syncSteps(
        userId: string,
        steps: number,
    ): AxiosPromise<SyncStepsResponse> {
        return axios.post<SyncStepsResponse>("/gamification/steps", {
            userId,
            steps,
        });
    }

    static getProgress(
        userId: string,
    ): AxiosPromise<GamificationProgressResponse> {
        return axios.get<GamificationProgressResponse>(
            `/gamification/progress/${userId}`,
        );
    }
}
