import axios, { AxiosPromise } from "axios";

import { UserHealthAttributions, UserInfoPayload } from "@dtypes/base/users";
import { QuizUserResponse } from "@dtypes/quiz-types";

export class UserService {
    static loadUserData(): AxiosPromise<{ user: UserInfoPayload }> {
        return axios.get<{ user: UserInfoPayload }>("/users/me");
    }

    static completeQuiz(quizData: QuizUserResponse): AxiosPromise {
        return axios.post("/users/health-quiz", quizData);
    }

    static updateUserHealthData(
        data: Omit<Partial<UserHealthAttributions>, "user_id" | "created_at">,
    ): AxiosPromise<{
        user: UserHealthAttributions;
    }> {
        return axios.patch("/users/health-data", data);
    }
}
