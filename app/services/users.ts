import axios, { AxiosPromise } from "axios";

import { UserInfoPayload } from "@dtypes/base/users";
import { QuizUserResponse } from "@dtypes/quiz-types";

export class UserService {
    static async loadUserData(): AxiosPromise<{ user: UserInfoPayload }> {
        return axios.get<{ user: UserInfoPayload }>("/users/me");
    }

    static async completeQuiz(quizData: QuizUserResponse): AxiosPromise {
        return axios.post("/users/health-quiz", quizData);
    }
}
