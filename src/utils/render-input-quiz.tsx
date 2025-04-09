import React from "react";
import { Question, QuizUserResponse } from "../types/quiz.types";
import { DatePickerInput } from "../ui/inputs/date-picker-input";
import { AlcoholSmokeBlock } from "../views/quiz/components/alcohol-smoke-block";
import { EndMessage } from "../views/quiz/components/end-message";
import { HealthGoals } from "../views/quiz/components/health-goals";
import { HeightBlock } from "../views/quiz/components/height-block";
import { MedicationTreatment } from "../views/quiz/components/medication-treatment";
import { NameBlock } from "../views/quiz/components/name-block";
import { SelectGender } from "../views/quiz/components/select-gender";
import { StressLevel } from "../views/quiz/components/stress-level";
import { TreatmentEncyclopedia } from "../views/quiz/components/treatment-encyclopedia";
import { WeightBlock } from "../views/quiz/components/weight-block";

interface RenderInputQuizProps {
    data: any;
    loading: boolean;
    question: Question;
    updateUserResponse: (key: keyof QuizUserResponse, _value: any) => void;
    userResponse: QuizUserResponse;
    setUserResponse: (_value: QuizUserResponse) => void;
}

export const RenderInputQuiz: React.FC<RenderInputQuizProps> = ({
    data,
    loading,
    question,
    updateUserResponse,
    userResponse,
    setUserResponse,
}) => {
    const { component, options } = question;

    return (
        <>
            {component === "NameBlock" && (
                <NameBlock
                    onChange={setUserResponse}
                    firstname={userResponse.first_name}
                    lastname={userResponse.last_name}
                />
            )}
            {component === "SelectGender" && (
                <SelectGender
                    options={options}
                    onChange={(val) => updateUserResponse("gender", val)}
                    value={userResponse.gender}
                />
            )}
            {component === "WeightBlock" && (
                <WeightBlock
                    options={options}
                    onChange={setUserResponse}
                    value={userResponse.weight}
                    unitValue={userResponse.weight_unit}
                />
            )}
            {component === "HeightBlock" && (
                <HeightBlock
                    options={options}
                    onChange={setUserResponse}
                    value={userResponse.height}
                    unitValue={userResponse.height_unit}
                />
            )}
            {component === "AlcoholBlock" && (
                <AlcoholSmokeBlock
                    options={options}
                    onChange={(val) => updateUserResponse("alcohol", val)}
                    value={userResponse.alcohol}
                />
            )}
            {component === "SmokeBlock" && (
                <AlcoholSmokeBlock
                    options={options}
                    onChange={(val) => updateUserResponse("smoking", val)}
                    value={userResponse.smoking}
                />
            )}
            {component === "HealthGoals" && (
                <HealthGoals
                    options={options}
                    onChange={(val) => updateUserResponse("health_goal", val)}
                    value={userResponse.health_goal}
                />
            )}
            {component === "MedicationTreatment" && (
                <MedicationTreatment
                    options={options}
                    onChange={(val) =>
                        updateUserResponse("medication_treatment", val)
                    }
                    value={userResponse.medication_treatment}
                />
            )}
            {component === "ProfessionalHelp" && (
                <TreatmentEncyclopedia
                    options={data?.jobs?.data || []}
                    onChange={(val) =>
                        updateUserResponse("professional_help", val)
                    }
                    value={userResponse.professional_help}
                    loading={loading}
                />
            )}
            {component === "ChronicalIllness" && (
                <TreatmentEncyclopedia
                    options={data?.chronic_illnesses?.data || []}
                    onChange={(val) =>
                        updateUserResponse("chronic_illness", val)
                    }
                    value={userResponse.chronic_illness}
                    loading={loading}
                />
            )}
            {component === "AllergiesEncyclopedia" && (
                <TreatmentEncyclopedia
                    options={data?.allergies?.data || []}
                    onChange={(val) => updateUserResponse("allergies", val)}
                    value={userResponse.allergies}
                    loading={loading}
                />
            )}
            {component === "SportEncyclopedia" && (
                <TreatmentEncyclopedia
                    options={data?.sports?.data || []}
                    onChange={(val) =>
                        updateUserResponse("practice_sports", val)
                    }
                    value={userResponse.practice_sports}
                    loading={loading}
                />
            )}
            {component === "TreatmentEncyclopedia" && (
                <TreatmentEncyclopedia
                    options={data?.chronic_illnesses?.data || []}
                    onChange={(val) =>
                        updateUserResponse("medical_treatments", val)
                    }
                    value={userResponse.medical_treatments}
                    loading={loading}
                />
            )}
            {component === "SurgeryBefore" && (
                <TreatmentEncyclopedia
                    options={data?.surgical_interventions?.data || []}
                    onChange={(val) =>
                        updateUserResponse("surgery_before", val)
                    }
                    value={userResponse.surgery_before}
                    loading={loading}
                />
            )}
            {component === "StressLevel" && (
                <StressLevel
                    options={options}
                    onChange={(val) => updateUserResponse("stress_level", val)}
                    value={userResponse.stress_level}
                />
            )}
            {component === "EndMessage" && (
                <EndMessage
                    onChange={(val) =>
                        updateUserResponse("summary_message", val)
                    }
                    value={userResponse.summary_message}
                />
            )}
            {component === "BirthDayPicker" && (
                <DatePickerInput
                    onChange={(val) => updateUserResponse("age", val)}
                    value={userResponse.age}
                />
            )}
        </>
    );
};
