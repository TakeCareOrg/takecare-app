import { useCallback, useMemo } from "react";
import { View } from "react-native";

import { useUserData } from "@contexts/user-data-context";
import { QuizUserResponse } from "@dtypes/quiz-types";

import { useQuizFlow } from "../quiz-context";
import { AlcoholSmokeBlock } from "./alcohol-smoke-block";
import { BirthDayPicker } from "./date-picker";
import { EndMessage } from "./end-message";
import { HealthGoals } from "./health-goals";
import { HeightBlock } from "./height-block";
import { MedicationTreatment } from "./medication-treatment";
// Import all quiz components
import { NameBlock } from "./name-block";
import { SelectGender } from "./select-gender";
import { StressLevel } from "./stress-level";
import { TreatmentEncyclopedia } from "./treatment-encyclopedia";
import { WeightBlock } from "./weight-block";

export const QuestionRenderer = () => {
    const { currentQuestion } = useQuizFlow();
    const { userData, updateField, dictionaryData } = useUserData();

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
                    value={userData.age ?? new Date().getTime()}
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
                    value={userData.weight || 0}
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
                    options={dictionaryData.jobs || []}
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

    // return <View style={{ flex: 1 }}>{renderComponent()}</View>;
};
