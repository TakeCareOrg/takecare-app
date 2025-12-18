import { useCallback, useMemo, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import { useToastPromise } from "@app/hooks/use-toast";
import { AlcoholSmokeBlock } from "@components/health-quiz/alcohol-smoke-block";
import { BirthDayPicker } from "@components/health-quiz/date-picker";
import { EndMessage } from "@components/health-quiz/end-message";
import { HealthGoals } from "@components/health-quiz/health-goals";
import { HeightBlock } from "@components/health-quiz/height-block";
import { MedicationTreatment } from "@components/health-quiz/medication-treatment";
import { SelectGender } from "@components/health-quiz/select-gender";
import { StressLevel } from "@components/health-quiz/stress-level";
import { TreatmentEncyclopedia } from "@components/health-quiz/treatment-encyclopedia";
import { WeightBlock } from "@components/health-quiz/weight-block";
import { BubbleBlurView } from "@components/ui/bubble-blur-view";
import { Button } from "@components/ui/button";
import { UserHealthAttributions } from "@dtypes/base/users";
import { QuizUserResponse } from "@dtypes/quiz-types";
import { useColorTheme } from "@hooks/use-color-theme";
import { useKeyboard } from "@hooks/use-keyboard";
import { useQuestionsQuiz } from "@hooks/useQuiz";
import { useMedicalDataStore } from "@stores/medical-data";
import { useUserStore } from "@stores/users";

const Components = ({
    updatedData,
    field,
    onChange,
}: {
    updatedData: Partial<UserHealthAttributions>;
    field: string;
    onChange: (updater: (prev: QuizUserResponse) => QuizUserResponse) => void;
}) => {
    const userData = useUserStore((state) => state.user);
    const allergies = useMedicalDataStore((state) => state.allergies);
    const medicalJobs = useMedicalDataStore((state) => state.medical_jobs);
    const sports = useMedicalDataStore((state) => state.sports);
    const chronicIllnesses = useMedicalDataStore(
        (state) => state.chronic_illnesses,
    );
    const surgicalInterventions = useMedicalDataStore(
        (state) => state.surgical_interventions,
    );

    const questions = useQuestionsQuiz();

    const currentQuestion = useMemo(
        () => questions.find((question) => question.key === field),
        [questions, field],
    );

    const handleChange = useCallback(
        (updater: (prev: QuizUserResponse) => QuizUserResponse) => {
            onChange(updater);
        },
        [onChange],
    );

    if (!userData) return null;

    switch (field) {
        case "birth_date":
            return (
                <BirthDayPicker
                    value={updatedData.birth_date || userData.health.birth_date}
                    onChange={handleChange}
                />
            );

        case "gender":
            return (
                <SelectGender
                    gender={updatedData.gender || userData.health.gender}
                    onChange={handleChange}
                    options={currentQuestion?.options || []}
                />
            );

        case "weight":
            return (
                <WeightBlock
                    value={updatedData.weight || userData.health.weight}
                    unitValue={
                        updatedData.weight_unit ||
                        userData.health.weight_unit ||
                        "kg"
                    }
                    onChange={handleChange}
                    options={currentQuestion?.options || []}
                />
            );

        case "height":
            return (
                <HeightBlock
                    value={updatedData.height || userData.health.height || 0}
                    unitValue={
                        updatedData.height_unit ||
                        userData.health.height_unit ||
                        "cm"
                    }
                    onChange={handleChange}
                    options={currentQuestion?.options || []}
                />
            );

        case "alcohol":
            return (
                <AlcoholSmokeBlock
                    value={updatedData.alcohol || userData.health.alcohol}
                    onChange={handleChange}
                    options={currentQuestion?.options || []}
                    fieldKey="alcohol"
                />
            );

        case "smoking":
            return (
                <AlcoholSmokeBlock
                    value={updatedData.smoking || userData.health.smoking}
                    onChange={handleChange}
                    options={currentQuestion?.options || []}
                    fieldKey="smoking"
                />
            );

        case "health_goal":
            return (
                <HealthGoals
                    selectedGoals={
                        updatedData.health_goal ||
                        userData.health.health_goal ||
                        []
                    }
                    onChange={handleChange}
                    options={currentQuestion?.options || []}
                />
            );

        case "professional_help":
            return (
                <TreatmentEncyclopedia
                    value={
                        updatedData.professional_help ||
                        userData.health.professional_help ||
                        []
                    }
                    onChange={handleChange}
                    options={medicalJobs || []}
                    fieldKey="professional_help"
                />
            );

        case "chronic_illness":
            return (
                <TreatmentEncyclopedia
                    value={
                        updatedData.chronic_illness ||
                        userData.health.chronic_illness ||
                        []
                    }
                    onChange={handleChange}
                    options={chronicIllnesses || []}
                    fieldKey="chronic_illness"
                />
            );

        case "medication_treatment":
            return (
                <MedicationTreatment
                    selected={
                        updatedData.medication_treatment ||
                        userData.health.medication_treatment ||
                        []
                    }
                    onChange={handleChange}
                    options={currentQuestion?.options || []}
                />
            );

        case "allergies":
            return (
                <TreatmentEncyclopedia
                    value={
                        updatedData.allergies || userData.health.allergies || []
                    }
                    onChange={handleChange}
                    options={allergies || []}
                    fieldKey="allergies"
                />
            );

        case "stress_level":
            return (
                <StressLevel
                    level={
                        updatedData.stress_level || userData.health.stress_level
                    }
                    onChange={handleChange}
                    options={currentQuestion?.options || []}
                />
            );

        case "practice_sports":
            return (
                <TreatmentEncyclopedia
                    value={
                        updatedData.practice_sports ||
                        userData.health.practice_sports ||
                        []
                    }
                    onChange={handleChange}
                    options={sports || []}
                    fieldKey="practice_sports"
                />
            );

        case "surgery_before":
            return (
                <TreatmentEncyclopedia
                    value={
                        updatedData.surgery_before ||
                        userData.health.surgery_before ||
                        []
                    }
                    onChange={handleChange}
                    options={surgicalInterventions || []}
                    fieldKey="surgery_before"
                />
            );

        case "summary_message":
            return (
                <EndMessage
                    value={
                        updatedData.summary_message ||
                        userData.health.summary_message ||
                        ""
                    }
                    onChange={handleChange}
                />
            );

        default:
            return <View />;
    }
};

export const UpdateUserHealthDataModal = ({
    isVisible,
    onClose,
    field,
}: {
    isVisible: boolean;
    onClose: () => void;
    field: keyof UserHealthAttributions;
}) => {
    const { background, isDark } = useColorTheme();
    const userData = useUserStore((state) => state.user);
    const updateUserHealthData = useUserStore(
        (state) => state.updateUserHealthData,
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [updatedData, setUpdatedData] = useState<
        Partial<UserHealthAttributions>
    >(field ? { [field]: userData?.health[field] } : {});

    const isKeyboardVisible = useKeyboard();
    const toastPromise = useToastPromise();

    const onChange = useCallback(
        (updater: (prev: QuizUserResponse) => QuizUserResponse) => {
            setUpdatedData((prev) => {
                const newUpdatedData = updater(prev as QuizUserResponse);
                return { ...prev, ...newUpdatedData };
            });
        },
        [],
    );

    const onSubmit = useCallback(() => {
        setIsLoading(true);
        toastPromise(updateUserHealthData(updatedData), {
            loading: "Updating your health data...",
            success: "Health data updated successfully",
            error: "Failed to update your health data",
        })
            .then(() => {
                onClose();
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [updatedData, updateUserHealthData, toastPromise, onClose]);

    if (!userData || !field) return null;

    return (
        <Modal
            visible={isVisible}
            onRequestClose={onClose}
            animationType="slide"
            presentationStyle="pageSheet"
            statusBarTranslucent={true}
            backdropColor={background}
        >
            <BubbleBlurView
                intensity={100}
                tint={
                    isDark
                        ? "systemChromeMaterialDark"
                        : "systemUltraThinMaterialLight"
                }
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
                        style={{
                            flex: 1,
                            justifyContent: "space-between",
                            paddingHorizontal: 16,
                        }}
                    >
                        <View style={styles.container}>
                            <View style={{ flex: 1 }}>
                                <Components
                                    updatedData={updatedData}
                                    field={field}
                                    onChange={onChange}
                                />
                            </View>

                            <View
                                style={{
                                    marginTop: isKeyboardVisible ? 32 : 0,
                                }}
                            >
                                <Button
                                    title="Submit"
                                    onPress={onSubmit}
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </BubbleBlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 32,
        flex: 1,
    },
});
