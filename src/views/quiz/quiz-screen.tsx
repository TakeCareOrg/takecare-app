import React, { useState, useCallback, useEffect } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
    Keyboard,
    TouchableWithoutFeedback,
    BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColors } from "../../styles/Colors";
import {
    QUIZ_STEPS,
    QUIZ_USER_DEFAULT,
    QuizSteps,
    QuizUserResponse,
} from "../../types/quiz.types";
import { QuestionsQuiz } from "../../utils/questions-quiz";
import { useAuth } from "../../contexts/auth-context";
import { QuizHeader } from "./components/utils/quiz-header";
import { RenderInputQuiz } from "../../utils/render-input-quiz";
import { QuizFooter } from "./components/utils/quiz-footer";
import Copyright from "../../ui/copyright";

export const QuizScreen = () => {
    const { main } = useColors();
    const [indexQ, setIndexQ] = useState(0);
    const [step, setStep] = useState<QuizSteps>("NameBlock");
    const questions = QuestionsQuiz();
    const { signInQuiz, makeAPICall } = useAuth();

    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);

    const getLang = async () => {
        try {
            const lang = await AsyncStorage.getItem("@Lang");
            return lang || "en";
        } catch (error) {
            console.error("Error getting language", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const lang = await getLang();
            setLoading(true);
            const [
                allergies,
                jobs,
                sports,
                chronic_illnesses,
                surgical_interventions,
            ] = await Promise.all([
                makeAPICall("GET", "/medical/allergies?lang=" + lang),
                makeAPICall("GET", "/medical/jobs?lang=" + lang),
                makeAPICall("GET", "/medical/sports?lang=" + lang),
                makeAPICall("GET", "/medical/chronic_illnesses?lang=" + lang),
                makeAPICall(
                    "GET",
                    "/medical/surgical_interventions?lang=" + lang,
                ),
            ]);

            setData({
                allergies,
                jobs,
                sports,
                chronic_illnesses,
                surgical_interventions,
            });
            setLoading(false);
        };

        fetchData();

        const backAction = () => {
            handleStepChange("back");
            return true; // Return true to indicate that the back action has been handled
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    const [userResponse, setUserResponse] =
        useState<QuizUserResponse>(QUIZ_USER_DEFAULT);

    const updateUserResponse = (key: keyof QuizUserResponse, value: any) => {
        setUserResponse((prev) => ({
            ...prev,
            [key]: value,
        }));
        if (step === "SelectGender") {
            handleContinue();
        }
    };

    const handleStepChange = useCallback(
        (
            direction: "next" | "back",
            callback?: (newIndexQ: number) => void,
        ) => {
            const currentIndex = QUIZ_STEPS.indexOf(step);
            const newIndex =
                direction === "next" ? currentIndex + 1 : currentIndex - 1;
            if (newIndex >= 0 && newIndex < QUIZ_STEPS.length) {
                setStep(QUIZ_STEPS[newIndex]);
                setIndexQ((prev) => {
                    const updatedIndex =
                        direction === "next" ? prev + 1 : prev - 1;
                    if (updatedIndex >= 0 && updatedIndex < questions.length) {
                        if (callback) callback(updatedIndex);
                        return updatedIndex;
                    }
                    if (callback) callback(prev);
                    return prev;
                });
            }
        },
        [step, questions.length],
    );

    const handlePrevious = useCallback(() => {
        handleStepChange("back");
    }, [handleStepChange]);

    const handleContinue = useCallback(() => {
        handleStepChange("next");
    }, [handleStepChange]);

    const handleSave = useCallback(async () => {
        await signInQuiz(userResponse);
    }, [signInQuiz, userResponse]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            "keyboardWillShow",
            () => {
                setKeyboardOpen(true);
            },
        );
        const hideSubscription = Keyboard.addListener(
            "keyboardWillHide",
            () => {
                setKeyboardOpen(false);
            },
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: main.background }]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                    style={{
                        flex: 1,
                        padding: 20,
                        justifyContent: "space-between",
                    }}
                >
                    <QuizHeader onPrevious={handlePrevious} indexQ={indexQ} />

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        {questions.map(
                            (question, index) =>
                                index === indexQ && (
                                    <RenderInputQuiz
                                        key={index}
                                        data={data}
                                        loading={loading}
                                        question={question}
                                        updateUserResponse={updateUserResponse}
                                        userResponse={userResponse}
                                        setUserResponse={setUserResponse}
                                    />
                                ),
                        )}
                    </View>

                    <View style={{ marginTop: keyboardOpen ? 32 : 0 }}>
                        <QuizFooter
                            step={step}
                            updateUserResponse={updateUserResponse}
                            onContinue={handleContinue}
                            onSave={handleSave}
                        />
                        <Copyright />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    quizHeader: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    tag: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 30,
    },
});
