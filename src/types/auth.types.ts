import { Gender, MedicationTreatment, QuizUserResponse } from "./quiz.types";
import React from "react";

export type AuthContextData = {
    authData?: AuthData;
    user?: userStateProps;
    setUser?: React.Dispatch<React.SetStateAction<userStateProps | undefined>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    signIn(credentials: LoginProps): Promise<void>; // Modify signIn to accept LoginProps
    signUp(credentials: LoginProps): Promise<void>; // Modify signUp to accept LoginProps
    signOut(): void;
    signInQuiz(value: QuizUserResponse): void;
    forgotPassword(email: string): Promise<void>;
    googleSignIn(): Promise<void>;
    appleSignIn(): Promise<void>;
    changePassword(
        email: string,
        code: string,
        newPassword: string
    ): Promise<void>;
    updateUserData(data: Omit<userProps, "user_id" | "email">): Promise<void>;
    updateUserHealthData(data: userHealthProps): Promise<void>;
    makeAPICall(
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        url: string,
        data?: Record<string, unknown>
    ): Promise<any>;
};

export type AuthData = {
    token: string;
};

export type LoginProps = {
    email: string;
    password: string;
};

export type RegisterProps = {
    email: string;
    password: string;
    confirmPassword: string;
};

export type userProps = {
    user_id: string;
    email: string;
    verified?: boolean;
    first_name?: string;
    last_name?: string;
    role?: string;
    quiz_finished?: boolean;
    avatar?: string | object;
};

export type userHealthProps = {
    first_name?: string;
    last_name?: string;
    health_goal?: string;
    alcohol?: string;
    gender?: Gender;
    age?: Date;
    weight?: number;
    weight_unit?: string;
    height?: number;
    height_unit?: string;
    feel_today?: number;
    smoking?: string;
    professional_help?: boolean;
    physical_distress?: string[];
    sleep_rate?: string;
    medication_treatment?: MedicationTreatment;
    medical_treatments?: string[];
    mental_health_symptoms?: string[];
    surgery_before?: string[];
    chronic_illness?: string[];
    allergies?: string[];
    practice_sports?: string[];
    stress_level?: number;
    summary_message?: string;
};

export type userStateProps = userProps & {
    health: userHealthProps;
};
