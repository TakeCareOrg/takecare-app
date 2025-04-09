import React from "react";
import { useTranslation } from "react-i18next";
import { Alcohol1 } from "../../assets/icons/Alcohol1";
import { Alcohol2 } from "../../assets/icons/Alcohol2";
import { Alcohol3 } from "../../assets/icons/Alcohol3";
import { Alcohol4 } from "../../assets/icons/Alcohol4";
import { BeautyIcon } from "../../assets/icons/BeautyIcon";
import { CrossIcon } from "../../assets/icons/CrossIcon";
import { DrugContainerIcon } from "../../assets/icons/DrugContainerIcon";
import { DrugStoreIcon } from "../../assets/icons/DrugStoreIcon";
import { FlagIcon } from "../../assets/icons/FlagIcon";
import { HealthIcon } from "../../assets/icons/HealthIcon";
import { MoodHappyIcon } from "../../assets/icons/MoodHappyIcon";
import { PillRoundIcon } from "../../assets/icons/PillRoundIcon";
import { RobotIcon } from "../../assets/icons/RobotIcon";
import { SmokeIcon } from "../../assets/icons/SmokeIcon";
import { Female } from "../../assets/images/illustrations/Female";
import { Male } from "../../assets/images/illustrations/Male";
import { useColors } from "../styles/Colors";
import { Question } from "../types/quiz.types";

export const QuestionsQuiz = () => {
    const { t } = useTranslation();
    const { main } = useColors();
    const questions: Array<Question> = [
        // Name
        {
            question: t("QUIZ.QUESTIONS.NAME_QUESTION"),
            skippable: false,
            component: "NameBlock",
            key: "name",
        },
        // Age
        {
            question: t("QUIZ.QUESTIONS.AGE_QUESTION"),
            skippable: false,
            component: "BirthDayPicker",
            options: [],
            key: "age",
        },
        // Gender
        {
            question: t("QUIZ.QUESTIONS.GENDER_QUESTION"),
            skippable: true,
            component: "SelectGender",
            options: [
                {
                    text: t("QUIZ.QUESTIONS.GENDER_OPTIONS.FEMALE"),
                    image: <Female />,
                    value: "female",
                },
                {
                    text: t("QUIZ.QUESTIONS.GENDER_OPTIONS.MALE"),
                    image: <Male />,
                    value: "male",
                },
            ],
            key: "gender",
        },
        // Weight
        {
            question: t("QUIZ.QUESTIONS.WEIGHT_QUESTION"),
            skippable: false,
            component: "WeightBlock",
            options: [
                { text: "lbs", value: 2.20462262185, maxValue: 882 },
                { text: "kg", value: 2.20462262185, maxValue: 400 },
            ],
            key: "weight",
            key_unit: "weight_unit",
        },
        // Height
        {
            question: t("QUIZ.QUESTIONS.HEIGHT_QUESTION"),
            skippable: false,
            component: "HeightBlock",
            options: [
                { text: "ft", value: 30.48, maxValue: 8.2 },
                { text: "cm", value: 30.48, maxValue: 250 },
            ],
            key: "height",
            key_unit: "height_unit",
        },
        // Alcohol
        {
            question: t("QUIZ.QUESTIONS.ALCOHOL_QUESTION"),
            skippable: false,
            component: "AlcoholBlock",
            options: [
                {
                    text: t("QUIZ.QUESTIONS.GLOBAL_OPTIONS.VERY_OCCASIONALLY"),
                    icon: <Alcohol1 color={main.black} />,
                    iconActive: <Alcohol1 color={main.white} />,
                    value: "occasionally",
                },
                {
                    text: t("QUIZ.QUESTIONS.GLOBAL_OPTIONS.CAUTIOUSLY"),
                    icon: <Alcohol2 color={main.black} />,
                    iconActive: <Alcohol2 color={main.white} />,
                    value: "cautiously",
                },
                {
                    text: t("QUIZ.QUESTIONS.GLOBAL_OPTIONS.SOMETIMES"),
                    icon: <Alcohol3 color={main.black} />,
                    iconActive: <Alcohol3 color={main.white} />,
                    value: "sometimes",
                },
                {
                    text: t("QUIZ.QUESTIONS.GLOBAL_OPTIONS.OFTEN"),
                    icon: <Alcohol4 color={main.black} />,
                    iconActive: <Alcohol4 color={main.white} />,
                    value: "often",
                },
            ],
            key: "alcohol",
        },
        // Smoke
        {
            question: t("QUIZ.QUESTIONS.SMOKE_QUESTION"),
            skippable: false,
            component: "SmokeBlock",
            options: [
                {
                    text: t("QUIZ.QUESTIONS.GLOBAL_OPTIONS.VERY_OCCASIONALLY"),
                    icon: <SmokeIcon color={main.black} />,
                    iconActive: <SmokeIcon color={main.white} />,
                    value: "occasionally",
                    numberIcon: 1,
                },
                {
                    text: t("QUIZ.QUESTIONS.GLOBAL_OPTIONS.CAUTIOUSLY"),
                    icon: <SmokeIcon color={main.black} />,
                    iconActive: <SmokeIcon color={main.white} />,
                    value: "cautiously",
                    numberIcon: 2,
                },
                {
                    text: t("QUIZ.QUESTIONS.GLOBAL_OPTIONS.SOMETIMES"),
                    icon: <SmokeIcon color={main.black} />,
                    iconActive: <SmokeIcon color={main.white} />,
                    value: "sometimes",
                    numberIcon: 3,
                },
                {
                    text: t("QUIZ.QUESTIONS.GLOBAL_OPTIONS.OFTEN"),
                    icon: <SmokeIcon color={main.black} />,
                    iconActive: <SmokeIcon color={main.white} />,
                    value: "often",
                    numberIcon: 4,
                },
            ],
            key: "smoking",
        },
        // Health Goals
        {
            question: t("QUIZ.QUESTIONS.HEALTH_GOALS_QUESTION"),
            skippable: false,
            options: [
                {
                    text: t(
                        "QUIZ.QUESTIONS.HEALTH_GOALS_OPTIONS.REDUCE_STRESS",
                    ),
                    icon: (
                        <HealthIcon
                            width={24}
                            height={24}
                            color={main.secondary}
                        />
                    ),
                    iconActive: (
                        <HealthIcon width={24} height={24} color={main.white} />
                    ),
                    value: "stress",
                },
                {
                    text: t("QUIZ.QUESTIONS.HEALTH_GOALS_OPTIONS.FEEL_BETTER"),
                    icon: (
                        <FlagIcon
                            width={24}
                            height={24}
                            color={main.secondary}
                        />
                    ),
                    iconActive: (
                        <FlagIcon width={24} height={24} color={main.white} />
                    ),
                    value: "feel-better",
                },
                {
                    text: t(
                        "QUIZ.QUESTIONS.HEALTH_GOALS_OPTIONS.LOOK_AFTER_HEALTH",
                    ),
                    icon: (
                        <RobotIcon
                            width={24}
                            height={24}
                            color={main.secondary}
                        />
                    ),
                    iconActive: (
                        <RobotIcon width={24} height={24} color={main.white} />
                    ),
                    value: "look-health",
                },
                {
                    text: t(
                        "QUIZ.QUESTIONS.HEALTH_GOALS_OPTIONS.MONITOR_PHYSICAL_ACTIVITY",
                    ),
                    icon: (
                        <RobotIcon
                            width={24}
                            height={24}
                            color={main.secondary}
                        />
                    ),
                    iconActive: (
                        <RobotIcon width={24} height={24} color={main.white} />
                    ),
                    value: "physical-activity",
                },
                {
                    text: t(
                        "QUIZ.QUESTIONS.HEALTH_GOALS_OPTIONS.QUALITY_OF_SLEEP",
                    ),
                    icon: (
                        <MoodHappyIcon
                            width={24}
                            height={24}
                            color={main.secondary}
                            colorSecondary={main.container}
                        />
                    ),
                    iconActive: (
                        <MoodHappyIcon
                            width={24}
                            height={24}
                            color={main.white}
                            colorSecondary={main.primary}
                        />
                    ),
                    value: "quality-sleep",
                },
                {
                    text: t(
                        "QUIZ.QUESTIONS.HEALTH_GOALS_OPTIONS.ADVICE_ABOUT_HEALTH",
                    ),
                    icon: (
                        <BeautyIcon
                            width={24}
                            height={24}
                            color={main.secondary}
                        />
                    ),
                    iconActive: (
                        <BeautyIcon width={24} height={24} color={main.white} />
                    ),
                    value: "advice-health",
                },
            ],
            component: "HealthGoals",
            key: "health_goal",
        },
        // Professional Help
        {
            question: t("QUIZ.QUESTIONS.SPECIALIST_QUESTION"),
            skippable: false,
            component: "ProfessionalHelp",
            options: [
                {
                    text: t("QUIZ.QUESTIONS.SPECIALIST_OPTIONS.JOBS"),
                    value: "jobs",
                },
            ],
            key: "professional_help",
        },
        // Chronic Illness
        {
            question: t("QUIZ.QUESTIONS.CHRONICAL_DISEASES_QUESTION"),
            skippable: false,
            component: "ChronicalIllness",
            options: [
                {
                    text: t(
                        "QUIZ.QUESTIONS.CHRONICAL_DISEASES_OPTIONS.CHRONICAL_DISEASES",
                    ),
                    value: "chronic_illnesses",
                },
            ],
            key: "chronic_illness",
        },
        // Treatment
        {
            question: t("QUIZ.QUESTIONS.TREATMENT_QUESTION"),
            skippable: false,
            component: "MedicationTreatment",
            options: [
                {
                    text: t(
                        "QUIZ.QUESTIONS.TREATMENT_OPTIONS.PRESCRIBED_MEDICATION",
                    ),
                    icon: (
                        <DrugContainerIcon
                            width={30}
                            height={30}
                            color={main.black}
                        />
                    ),
                    iconActive: <DrugContainerIcon color={main.white} />,
                    value: "Prescribed Medications",
                },
                {
                    text: t(
                        "QUIZ.QUESTIONS.TREATMENT_OPTIONS.COUNTER_SUPPLEMENTS",
                    ),
                    icon: (
                        <DrugStoreIcon
                            width={30}
                            height={30}
                            color={main.black}
                        />
                    ),
                    iconActive: <DrugStoreIcon color={main.white} />,
                    value: "Counter Supplements",
                },
                {
                    text: t("QUIZ.QUESTIONS.TREATMENT_OPTIONS.NOT_TAKING"),
                    icon: (
                        <PillRoundIcon
                            width={30}
                            height={30}
                            color={main.black}
                        />
                    ),
                    iconActive: <PillRoundIcon color={main.white} />,
                    value: "Not taking",
                },
                {
                    text: t("QUIZ.QUESTIONS.TREATMENT_OPTIONS.NOT_TO_SAY"),
                    icon: (
                        <CrossIcon width={30} height={30} color={main.black} />
                    ),
                    iconActive: (
                        <CrossIcon width={30} height={30} color={main.white} />
                    ),
                    value: "Not to say",
                },
            ],
            key: "medication_treatment",
        },
        // Allergies
        {
            question: t("QUIZ.QUESTIONS.ALLERGIES_QUESTION"),
            skippable: true,
            component: "AllergiesEncyclopedia",
            options: [
                {
                    text: t("QUIZ.QUESTIONS.ALLERGIES_OPTIONS.ALLERGIES"),
                    value: "allergies",
                },
            ],
            key: "allergies",
        },
        // Stress Level
        {
            question: t("QUIZ.QUESTIONS.STRESS_QUESTION"),
            skippable: false,
            component: "StressLevel",
            options: [
                {
                    text: "1",
                    value: 1,
                    description: t("QUIZ.QUESTIONS.STRESS_OPTIONS.LEVEL_1"),
                },
                {
                    text: "2",
                    value: 2,
                    description: t("QUIZ.QUESTIONS.STRESS_OPTIONS.LEVEL_2"),
                },
                {
                    text: "3",
                    value: 3,
                    description: t("QUIZ.QUESTIONS.STRESS_OPTIONS.LEVEL_3"),
                },
                {
                    text: "4",
                    value: 4,
                    description: t("QUIZ.QUESTIONS.STRESS_OPTIONS.LEVEL_4"),
                },
                {
                    text: "5",
                    value: 5,
                    description: t("QUIZ.QUESTIONS.STRESS_OPTIONS.LEVEL_5"),
                },
            ],
            key: "stress_level",
        },
        // Sports
        {
            question: t("QUIZ.QUESTIONS.SPORT_QUESTION"),
            skippable: false,
            component: "SportEncyclopedia",
            options: [
                {
                    text: t("QUIZ.QUESTIONS.SPORT_OPTIONS.SPORTS"),
                    value: "sports",
                },
            ],
            key: "practice_sports",
        },
        // Surgery
        {
            question: t("QUIZ.QUESTIONS.SURGERY_QUESTION"),
            skippable: false,
            component: "SurgeryBefore",
            options: [
                {
                    text: t("QUIZ.QUESTIONS.SURGERY_OPTIONS.SURGERY"),
                    value: "surgical_interventions",
                },
            ],
            key: "surgery_before",
        },
        // End Message
        {
            question: t("QUIZ.QUESTIONS.MIND_QUESTION"),
            skippable: true,
            component: "EndMessage",
            key: "summary_message",
        },
    ];

    return questions;
};
