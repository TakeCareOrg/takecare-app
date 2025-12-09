import React from "react";

import { UserAttributions, UserHealthAttributions } from "@dtypes/base/users";

// Quiz user response data structure
// Combines user basic info with health data, excluding DB-specific fields
export type QuizUserResponse = Pick<
    UserAttributions,
    "first_name" | "last_name"
> &
    Omit<UserHealthAttributions, "user_id" | "created_at"> & {
        // Override types to be more specific for quiz flow
        age?: string; // String during input, converted to number for API
    };

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

// Input quiz props (common props for quiz input components)
export type InputQuizProps = {
    onChange: (updater: (prev: QuizUserResponse) => QuizUserResponse) => void;
};
