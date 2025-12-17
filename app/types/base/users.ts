import { HeightUnit, WeightUnit } from "../quiz-types";

export interface User extends UserAttributions {
    user_id: string;
    email: string;
    appleId?: string;
    social_conn?: string;
    password: string;
    created_at: Date;
}

export interface UserAttributions {
    verified: boolean;
    role?: "user" | "admin";
    first_name: string;
    last_name: string;
    quiz_finished?: boolean;
    chat_tokens: number;
    chat_tokens_refreshed_at?: Date;
    avatar?: string;
}

export type HealthGoal =
    | "stress_reduction"
    | "feel_better"
    | "health_improvement"
    | "physical_activity"
    | "sleep_quality"
    | "health_advices";

export interface UserHealthAttributions {
    gender?: "male" | "female" | "other";
    birth_date?: Date;
    weight?: number;
    weight_unit?: WeightUnit;
    height?: number;
    height_unit?: HeightUnit;
    alcohol?: "never" | "occasionally" | "cautiously" | "sometimes" | "often";
    smoking?: "never" | "occasionally" | "cautiously" | "sometimes" | "often";
    health_goal?: HealthGoal[];
    professional_help?: string[];
    medication_treatment?: string[];
    medical_treatments?: string[];
    surgery_before?: string[];
    chronic_illness?: string[];
    allergies?: string[];
    practice_sports?: string[];
    stress_level?: number;
    summary_message?: string;
    created_at: Date;
}

export interface UserInfoPayload extends UserAttributions {
    user_id: string;
    email: string;
    health: UserHealthAttributions;
}
