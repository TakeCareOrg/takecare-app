import axios, { AxiosPromise } from "axios";

import { QuizUserResponse } from "@app/types/quiz-types";

export class AuthService {
    static async login(email: string, password: string): AxiosPromise {
        return axios.post<{ token: string }>("/auth/login", {
            email,
            password,
        });
    }

    static async register(email: string, password: string): AxiosPromise {
        return axios.post<{ token: string }>("/auth/register", {
            email,
            password,
        });
    }

    static async completeQuiz(quizData: QuizUserResponse): AxiosPromise {
        return axios.post("/auth/complete-quiz", quizData);
    }
}
