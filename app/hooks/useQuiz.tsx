import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Alcohol1 } from "@assets/icons/alcohol-icon-1";
import { Alcohol2 } from "@assets/icons/alcohol-icon-2";
import { Alcohol3 } from "@assets/icons/alcohol-icon-3";
import { Alcohol4 } from "@assets/icons/alcohol-icon-4";
import { BeautyIcon } from "@assets/icons/beauty-icon";
import { CrossIcon } from "@assets/icons/cross-icon";
import { DrugContainerIcon } from "@assets/icons/drug-container-icon";
import { DrugStoreIcon } from "@assets/icons/drug-store-icon";
import { FemaleIllustration } from "@assets/icons/female-illustration";
import { FlagIcon } from "@assets/icons/flag-icon";
import { HealthIcon } from "@assets/icons/health-icon";
import { MaleIllustration } from "@assets/icons/male-illustration";
import { MoodHappyIcon } from "@assets/icons/mood-happy-icon";
import { PillRoundIcon } from "@assets/icons/pill-round-icon";
import { RobotIcon } from "@assets/icons/robot-icon";
import { SmokeIcon } from "@assets/icons/smoke-icon";
import {
    AlcoholOptionConfig,
    HealthGoalOptionConfig,
    IconColors,
    IconOverrides,
    QuestionType,
    SmokeOptionConfig,
} from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";

const createIcon = <P extends object>(
    Component: React.ComponentType<P>,
    baseProps?: Omit<P, "color">,
    overrides?: IconOverrides<P>,
) => {
    return (colors: IconColors) => ({
        icon: (
            <Component
                {...((baseProps ?? {}) as P)}
                {...(overrides?.inactive ? overrides.inactive(colors) : {})}
                color={colors.defaultColor}
            />
        ),
        iconActive: (
            <Component
                {...((baseProps ?? {}) as P)}
                {...(overrides?.active ? overrides.active(colors) : {})}
                color={colors.inverseColor}
            />
        ),
    });
};

const ALCOHOL_OPTION_CONFIG: AlcoholOptionConfig[] = [
    {
        translationKey: "VERY_OCCASIONALLY",
        value: "occasionally",
        Icon: Alcohol1,
    },
    { translationKey: "CAUTIOUSLY", value: "cautiously", Icon: Alcohol2 },
    { translationKey: "SOMETIMES", value: "sometimes", Icon: Alcohol3 },
    { translationKey: "OFTEN", value: "often", Icon: Alcohol4 },
];

const SMOKE_OPTION_CONFIG: SmokeOptionConfig[] = [
    {
        translationKey: "VERY_OCCASIONALLY",
        value: "occasionally",
        Icon: SmokeIcon,
        numberIcon: 1,
    },
    {
        translationKey: "CAUTIOUSLY",
        value: "cautiously",
        Icon: SmokeIcon,
        numberIcon: 2,
    },
    {
        translationKey: "SOMETIMES",
        value: "sometimes",
        Icon: SmokeIcon,
        numberIcon: 3,
    },
    { translationKey: "OFTEN", value: "often", Icon: SmokeIcon, numberIcon: 4 },
];

const HEALTH_GOAL_CONFIG: HealthGoalOptionConfig[] = [
    {
        translationKey: "REDUCE_STRESS",
        value: "stress",
        createIcons: createIcon(HealthIcon, { width: 24, height: 24 }),
    },
    {
        translationKey: "FEEL_BETTER",
        value: "feel-better",
        createIcons: createIcon(FlagIcon, { width: 24, height: 24 }),
    },
    {
        translationKey: "LOOK_AFTER_HEALTH",
        value: "look-health",
        createIcons: createIcon(RobotIcon, { width: 24, height: 24 }),
    },
    {
        translationKey: "MONITOR_PHYSICAL_ACTIVITY",
        value: "physical-activity",
        createIcons: createIcon(RobotIcon, { width: 24, height: 24 }),
    },
    {
        translationKey: "QUALITY_OF_SLEEP",
        value: "quality-sleep",
        createIcons: createIcon(
            MoodHappyIcon,
            { width: 24, height: 24 },
            {
                inactive: ({ inverseColor }) => ({
                    colorSecondary: inverseColor,
                }),
                active: ({ defaultColor }) => ({
                    colorSecondary: defaultColor,
                }),
            },
        ),
    },
    {
        translationKey: "ADVICE_ABOUT_HEALTH",
        value: "advice-health",
        createIcons: createIcon(
            BeautyIcon,
            { width: 24, height: 24 },
            {
                inactive: ({ inverseColor }) => ({
                    colorSecondary: inverseColor,
                }),
            },
        ),
    },
];

const WEIGHT_UNIT_OPTIONS = [
    { text: "kg", value: 1, maxValue: 400 },
    { text: "lbs", value: 2.20462262185, maxValue: 882 },
];

const HEIGHT_UNIT_OPTIONS = [
    { text: "cm", value: 1, maxValue: 250 },
    { text: "ft", value: 30.48, maxValue: 8.2 },
];

export const useQuestionsQuiz = () => {
    const { t } = useTranslation();
    const { text, white } = useColorTheme();

    const questions = useMemo<QuestionType[]>(() => {
        const iconColors: IconColors = {
            defaultColor: text,
            inverseColor: white,
        };

        const alcoholOptions = ALCOHOL_OPTION_CONFIG.map(
            ({ translationKey, value, Icon }) => {
                const { icon, iconActive } = createIcon(Icon)(iconColors);

                return {
                    text: t(`QUIZ.QUESTIONS.GLOBAL_OPTIONS.${translationKey}`),
                    value,
                    icon,
                    iconActive,
                };
            },
        );

        const smokeOptions = SMOKE_OPTION_CONFIG.map(
            ({ translationKey, value, Icon, numberIcon }) => {
                const { icon, iconActive } = createIcon(Icon)(iconColors);

                return {
                    text: t(`QUIZ.QUESTIONS.GLOBAL_OPTIONS.${translationKey}`),
                    value,
                    icon,
                    iconActive,
                    numberIcon,
                };
            },
        );

        const healthGoalOptions = HEALTH_GOAL_CONFIG.map(
            ({ translationKey, value, createIcons }) => {
                const { icon, iconActive } = createIcons(iconColors);

                return {
                    text: t(
                        `QUIZ.QUESTIONS.HEALTH_GOALS_OPTIONS.${translationKey}`,
                    ),
                    value,
                    icon,
                    iconActive,
                };
            },
        );

        return [
            // Name
            {
                label: t("QUIZ.LABELS.NAME"),
                question: t("QUIZ.QUESTIONS.NAME_QUESTION"),
                skippable: false,
                component: "NameBlock",
                key: ["first_name", "last_name"],
            },
            // Age
            {
                label: t("QUIZ.LABELS.AGE"),
                question: t("QUIZ.QUESTIONS.AGE_QUESTION"),
                skippable: true,
                component: "BirthDayPicker",
                key: "age",
            },
            // Gender
            {
                label: t("QUIZ.LABELS.GENDER"),
                question: t("QUIZ.QUESTIONS.GENDER_QUESTION"),
                skippable: true,
                component: "SelectGender",
                options: [
                    {
                        text: t("QUIZ.QUESTIONS.GENDER_OPTIONS.FEMALE"),
                        image: (
                            <FemaleIllustration
                                width={"100%"}
                                height={"100%"}
                            />
                        ),
                        value: "female",
                    },
                    {
                        text: t("QUIZ.QUESTIONS.GENDER_OPTIONS.MALE"),
                        image: (
                            <MaleIllustration width={"100%"} height={"100%"} />
                        ),
                        value: "male",
                    },
                    {
                        text: t("QUIZ.QUESTIONS.GENDER_OPTIONS.OTHER"),
                        value: "other",
                    },
                ],
                key: "gender",
            },
            // Weight
            {
                label: t("QUIZ.LABELS.WEIGHT"),
                question: t("QUIZ.QUESTIONS.WEIGHT_QUESTION"),
                skippable: true,
                component: "WeightBlock",
                options: WEIGHT_UNIT_OPTIONS,
                key: "weight",
                key_unit: "weight_unit",
            },
            // Height
            {
                label: t("QUIZ.LABELS.HEIGHT"),
                question: t("QUIZ.QUESTIONS.HEIGHT_QUESTION"),
                skippable: true,
                component: "HeightBlock",
                options: HEIGHT_UNIT_OPTIONS,
                key: "height",
                key_unit: "height_unit",
            },
            // Alcohol
            {
                label: t("QUIZ.LABELS.ALCOHOL"),
                question: t("QUIZ.QUESTIONS.ALCOHOL_QUESTION"),
                skippable: true,
                component: "AlcoholBlock",
                options: alcoholOptions,
                key: "alcohol",
            },
            // Smoke
            {
                label: t("QUIZ.LABELS.SMOKE"),
                question: t("QUIZ.QUESTIONS.SMOKE_QUESTION"),
                skippable: true,
                component: "SmokeBlock",
                options: smokeOptions,
                key: "smoking",
            },
            // Health Goals
            {
                label: t("QUIZ.LABELS.HEALTH_GOALS"),
                question: t("QUIZ.QUESTIONS.HEALTH_GOALS_QUESTION"),
                skippable: true,
                options: healthGoalOptions,
                component: "HealthGoals",
                key: "health_goal",
            },
            // Professional Help
            {
                label: t("QUIZ.LABELS.SPECIALIST"),
                question: t("QUIZ.QUESTIONS.SPECIALIST_QUESTION"),
                skippable: true,
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
                label: t("QUIZ.LABELS.CHRONICAL_DISEASES"),
                question: t("QUIZ.QUESTIONS.CHRONICAL_DISEASES_QUESTION"),
                skippable: true,
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
                label: t("QUIZ.LABELS.TREATMENT"),
                question: t("QUIZ.QUESTIONS.TREATMENT_QUESTION"),
                skippable: true,
                component: "MedicationTreatment",
                options: [
                    {
                        text: t(
                            "QUIZ.QUESTIONS.TREATMENT_OPTIONS.PRESCRIBED_MEDICATION",
                        ),
                        ...createIcon(DrugContainerIcon, {
                            width: 30,
                            height: 30,
                        })(iconColors),
                        value: "Prescribed Medications",
                    },
                    {
                        text: t(
                            "QUIZ.QUESTIONS.TREATMENT_OPTIONS.COUNTER_SUPPLEMENTS",
                        ),
                        ...createIcon(DrugStoreIcon, {
                            width: 30,
                            height: 30,
                        })(iconColors),
                        value: "Counter Supplements",
                    },
                    {
                        text: t("QUIZ.QUESTIONS.TREATMENT_OPTIONS.NOT_TAKING"),
                        ...createIcon(PillRoundIcon, {
                            width: 30,
                            height: 30,
                        })(iconColors),
                        value: "Not taking",
                    },
                    {
                        text: t("QUIZ.QUESTIONS.TREATMENT_OPTIONS.NOT_TO_SAY"),
                        ...createIcon(CrossIcon, {
                            width: 30,
                            height: 30,
                        })(iconColors),
                        value: "Not to say",
                    },
                ],
                key: "medication_treatment",
            },
            // Allergies
            {
                label: t("QUIZ.LABELS.ALLERGIES"),
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
                label: t("QUIZ.LABELS.STRESS"),
                question: t("QUIZ.QUESTIONS.STRESS_QUESTION"),
                skippable: true,
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
                label: t("QUIZ.LABELS.SPORTS"),
                question: t("QUIZ.QUESTIONS.SPORT_QUESTION"),
                skippable: true,
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
                label: t("QUIZ.LABELS.SURGERY"),
                question: t("QUIZ.QUESTIONS.SURGERY_QUESTION"),
                skippable: true,
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
                label: t("QUIZ.LABELS.MIND"),
                question: t("QUIZ.QUESTIONS.MIND_QUESTION"),
                skippable: true,
                component: "EndMessage",
                key: "summary_message",
            },
        ];
    }, [text, t, white]);

    return questions;
};
