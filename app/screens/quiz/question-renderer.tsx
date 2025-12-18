import { useCallback, useMemo } from "react";
import { View } from "react-native";

import { AlcoholSmokeBlock } from "@components/health-quiz/alcohol-smoke-block";
import { BirthDayPicker } from "@components/health-quiz/date-picker";
import { EndMessage } from "@components/health-quiz/end-message";
import { HealthGoals } from "@components/health-quiz/health-goals";
import { HeightBlock } from "@components/health-quiz/height-block";
import { MedicationTreatment } from "@components/health-quiz/medication-treatment";
// Import all quiz components
import { NameBlock } from "@components/health-quiz/name-block";
import { SelectGender } from "@components/health-quiz/select-gender";
import { StressLevel } from "@components/health-quiz/stress-level";
import { TreatmentEncyclopedia } from "@components/health-quiz/treatment-encyclopedia";
import { WeightBlock } from "@components/health-quiz/weight-block";
import { useQuizFlow } from "@contexts/quiz/quiz-context";
import { useUserQuizData } from "@contexts/quiz/user-quiz-data-context";
import { QuizUserResponse } from "@dtypes/quiz-types";

export const QuestionRenderer = () => {
    const { currentQuestion } = useQuizFlow();
    const { userData, updateField, dictionaryData } = useUserQuizData();

    const onChange = useCallback(
        (updater: (prev: QuizUserResponse) => QuizUserResponse) => {
            const newData = updater(userData);
            // Find what changed and update
            Object.keys(newData).forEach((key) => {
                const typedKey = key as keyof QuizUserResponse;
                if (newData[typedKey] !== userData[typedKey]) {
                    updateField(typedKey, newData[typedKey]);
                }
            });
        },
        [userData, updateField],
    );

    const component = useMemo(
        () => currentQuestion?.component,
        [currentQuestion],
    );

    switch (component) {
        case "NameBlock":
            return (
                <NameBlock
                    firstname={userData.first_name}
                    lastname={userData.last_name}
                    onChange={onChange}
                />
            );

        case "BirthDayPicker":
            return (
                <BirthDayPicker
                    value={userData.birth_date}
                    onChange={onChange}
                />
            );

        case "SelectGender":
            return (
                <SelectGender
                    gender={userData.gender}
                    onChange={onChange}
                    options={currentQuestion.options || []}
                />
            );

        case "WeightBlock":
            return (
                <WeightBlock
                    value={userData.weight}
                    unitValue={userData.weight_unit || "kg"}
                    onChange={onChange}
                    options={currentQuestion.options || []}
                />
            );

        case "HeightBlock":
            return (
                <HeightBlock
                    value={userData.height || 0}
                    unitValue={userData.height_unit || "cm"}
                    onChange={onChange}
                    options={currentQuestion.options || []}
                />
            );

        case "AlcoholBlock":
            return (
                <AlcoholSmokeBlock
                    value={userData.alcohol}
                    onChange={onChange}
                    options={currentQuestion.options || []}
                    fieldKey="alcohol"
                />
            );

        case "SmokeBlock":
            return (
                <AlcoholSmokeBlock
                    value={userData.smoking}
                    onChange={onChange}
                    options={currentQuestion.options || []}
                    fieldKey="smoking"
                />
            );

        case "HealthGoals":
            return (
                <HealthGoals
                    selectedGoals={userData.health_goal || []}
                    onChange={onChange}
                    options={currentQuestion.options || []}
                />
            );

        case "ProfessionalHelp":
            return (
                <TreatmentEncyclopedia
                    value={userData.professional_help || []}
                    onChange={onChange}
                    options={dictionaryData.medical_jobs || []}
                    fieldKey="professional_help"
                />
            );

        case "ChronicalIllness":
            return (
                <TreatmentEncyclopedia
                    value={userData.chronic_illness || []}
                    onChange={onChange}
                    options={dictionaryData.chronic_illnesses || []}
                    fieldKey="chronic_illness"
                />
            );

        case "MedicationTreatment":
            return (
                <MedicationTreatment
                    selected={userData.medication_treatment || []}
                    onChange={onChange}
                    options={currentQuestion.options || []}
                />
            );

        case "AllergiesEncyclopedia":
            return (
                <TreatmentEncyclopedia
                    value={userData.allergies || []}
                    onChange={onChange}
                    options={dictionaryData.allergies || []}
                    fieldKey="allergies"
                />
            );

        case "StressLevel":
            return (
                <StressLevel
                    level={userData.stress_level}
                    onChange={onChange}
                    options={currentQuestion.options || []}
                />
            );

        case "SportEncyclopedia":
            return (
                <TreatmentEncyclopedia
                    value={userData.practice_sports || []}
                    onChange={onChange}
                    options={dictionaryData.sports || []}
                    fieldKey="practice_sports"
                />
            );

        case "SurgeryBefore":
            return (
                <TreatmentEncyclopedia
                    value={userData.surgery_before || []}
                    onChange={onChange}
                    options={dictionaryData.surgical_interventions || []}
                    fieldKey="surgery_before"
                />
            );

        case "EndMessage":
            return (
                <EndMessage
                    value={userData.summary_message || ""}
                    onChange={onChange}
                />
            );

        default:
            return <View />;
    }
};
