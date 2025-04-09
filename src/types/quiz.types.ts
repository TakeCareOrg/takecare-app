import React from "react";

export type Option = {
    text: string;
    icon?: React.ReactNode;
    iconActive?: React.ReactNode;
    value?: any;
    image?: React.ReactNode | string;
    description?: string;
    maxValue?: number;
    numberIcon?: number;
};

export type Question = {
    question: string;
    skippable: boolean;
    component: React.ReactNode;
    options?: Option[];
    dependOf?: string;
    key?: string;
    key_unit?: string;
};

export type InputQuizProps = {
    options?: Option[];
    onChange: (value: any) => void;
    value?: any;
};

export const QUIZ_STEPS = [
    "NameBlock",
    "WheelPicker",
    "SelectGender",
    "WeightBlock",
    "HeightBlock",
    "AlcoholBlock",
    "SmokeBlock",
    "HealthGoals",
    "ProfessionalHelp",
    "ChronicalIllness",
    "MedicationTreatment",
    "TreatmentEncyclopedia",
    "Allergies",
    "StressLevel",
    "PracticeSports",
    "SurgeryBefore",
    "EndMessage",
] as const;

export type QuizSteps = (typeof QUIZ_STEPS)[number];

export type Gender = "male" | "female" | "other";
export type MedicationTreatment =
    | "Prescribed Medications"
    | "Counter Supplements"
    | "Not taking"
    | "Not to say";
export type HeightUnit = "ft" | "cm";
export type WeightUnit = "kg" | "lbs";
export type AlcoholSmoke =
    | "never"
    | "occasionally"
    | "cautiously"
    | "sometimes"
    | "often";

export interface QuizUserResponse {
    first_name: string;
    last_name: string;
    gender: Gender;
    age: Date;
    weight: number;
    weight_unit: WeightUnit;
    height: number;
    height_unit: HeightUnit;
    alcohol: AlcoholSmoke;
    smoking: AlcoholSmoke;
    health_goal?: string[];
    professional_help?: string[];
    medication_treatment?: MedicationTreatment;
    medical_treatments?: string[];
    chronic_illness?: string[];
    allergies?: string[];
    surgery_before?: string[];
    practice_sports?: string[];
    stress_level?: number;
    summary_message?: string;
}

export const QUIZ_USER_DEFAULT: QuizUserResponse = {
    first_name: "",
    last_name: "",
    gender: "female",
    age: new Date(),
    weight: 0,
    weight_unit: "lbs",
    height: 0,
    height_unit: "ft",
    alcohol: "occasionally",
    smoking: "occasionally",
    health_goal: ["stress"],
    professional_help: [],
    chronic_illness: [],
    allergies: [],
    practice_sports: [],
    medication_treatment: "Not taking",
    medical_treatments: [],
    surgery_before: [],
    stress_level: 1,
    summary_message: "",
};
