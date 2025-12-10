import React from "react";

import { UserAttributions, UserHealthAttributions } from "@dtypes/base/users";

// Quiz user response data structure
// Combines user basic info with health data, excluding DB-specific fields
export type QuizUserResponse = Pick<
    UserAttributions,
    "first_name" | "last_name"
> &
    Omit<UserHealthAttributions, "user_id" | "created_at">;

// Default quiz user response
export const QUIZ_USER_DEFAULT: QuizUserResponse = {
    first_name: "",
    last_name: "",
    age: undefined,
    gender: undefined,
    weight: undefined,
    weight_unit: "kg",
    height: undefined,
    height_unit: "cm",
    alcohol: undefined,
    smoking: undefined,
    health_goal: [],
    professional_help: [],
    chronic_illness: [],
    medication_treatment: [],
    medical_treatments: [],
    allergies: [],
    stress_level: undefined,
    practice_sports: [],
    surgery_before: [],
    summary_message: undefined,
};

// Quiz steps (component names)
export type QuizSteps =
    | "NameBlock"
    | "BirthDayPicker"
    | "SelectGender"
    | "WeightBlock"
    | "HeightBlock"
    | "AlcoholBlock"
    | "SmokeBlock"
    | "HealthGoals"
    | "ProfessionalHelp"
    | "ChronicalIllness"
    | "MedicationTreatment"
    | "AllergiesEncyclopedia"
    | "StressLevel"
    | "SportEncyclopedia"
    | "SurgeryBefore"
    | "EndMessage";

// Array of quiz steps in order
export const QUIZ_STEPS: QuizSteps[] = [
    "NameBlock",
    "BirthDayPicker",
    "SelectGender",
    "WeightBlock",
    "HeightBlock",
    "AlcoholBlock",
    "SmokeBlock",
    "HealthGoals",
    "ProfessionalHelp",
    "ChronicalIllness",
    "MedicationTreatment",
    "AllergiesEncyclopedia",
    "StressLevel",
    "SportEncyclopedia",
    "SurgeryBefore",
    "EndMessage",
];

// Dictionary data from API
export type DictionaryData = {
    allergies?: string[];
    jobs?: string[];
    sports?: string[];
    chronic_illnesses?: string[];
    surgical_interventions?: string[];
};

// Unit types
export type WeightUnit = "kg" | "lbs";
export type HeightUnit = "cm" | "ft";

// Option type for quiz options
export type Option = {
    text: string;
    value: string | number;
    icon?: React.ReactNode;
    iconActive?: React.ReactNode;
    numberIcon?: number;
    description?: string;
    image?: React.ReactNode;
    maxValue?: number;
};

// Icon colors used to render active/inactive states
export type IconColors = {
    defaultColor: string;
    inverseColor: string;
};

// Optional overrides applied to icons when toggling state
export type IconOverrides<P extends object> = {
    active?: (colors: IconColors) => Partial<P>;
    inactive?: (colors: IconColors) => Partial<P>;
};

// Translation keys reused across alcohol/smoke options
export type GlobalOptionKey =
    | "VERY_OCCASIONALLY"
    | "CAUTIOUSLY"
    | "SOMETIMES"
    | "OFTEN";

export type AlcoholOptionConfig = {
    translationKey: GlobalOptionKey;
    value: string;
    Icon: React.ComponentType<{ color?: string }>;
};

export type SmokeOptionConfig = AlcoholOptionConfig & {
    numberIcon: number;
};

export type HealthGoalTranslationKey =
    | "REDUCE_STRESS"
    | "FEEL_BETTER"
    | "LOOK_AFTER_HEALTH"
    | "MONITOR_PHYSICAL_ACTIVITY"
    | "QUALITY_OF_SLEEP"
    | "ADVICE_ABOUT_HEALTH";

export type HealthGoalOptionConfig = {
    translationKey: HealthGoalTranslationKey;
    value: string;
    createIcons: (colors: IconColors) => {
        icon: React.ReactNode;
        iconActive: React.ReactNode;
    };
};

export type QuestionType = {
    label: string;
    question: string;
    skippable: boolean;
    component: QuizSteps;
    options?: Option[];
    key?: string | string[];
    key_unit?: string;
};

// Input quiz props (common props for quiz input components)
export type InputQuizProps = {
    onChange: (updater: (prev: QuizUserResponse) => QuizUserResponse) => void;
};
