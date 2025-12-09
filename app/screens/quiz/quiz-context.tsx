import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    ReactNode,
    useEffect,
} from "react";
import { useNavigation } from "@react-navigation/native";

import { useQuestionsQuiz, QuestionType } from "@hooks/useQuiz";
import { useUserData } from "@contexts/user-data-context";

type QuizFlowContextType = {
    currentIndex: number;
    currentQuestion: QuestionType;
    questions: QuestionType[];
    isLoading: boolean;
    canGoBack: boolean;
    canContinue: boolean;
    totalQuestions: number;
    goNext: () => void;
    goBack: () => void;
    completeQuiz: () => Promise<void>;
};

const QuizFlowContext = createContext<QuizFlowContextType | undefined>(
    undefined,
);

type QuizFlowProviderProps = {
    children: ReactNode;
};

export const QuizFlowProvider = ({ children }: QuizFlowProviderProps) => {
    const navigation = useNavigation();
    const questions = useQuestionsQuiz();
    const { userData, submitUserData, loadDictionaryData, isLoadingDictionary } =
        useUserData();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load dictionary data on mount
    useEffect(() => {
        loadDictionaryData();
    }, [loadDictionaryData]);

    const currentQuestion = useMemo(
        () => questions[currentIndex],
        [questions, currentIndex],
    );

    const canGoBack = useMemo(() => currentIndex > 0, [currentIndex]);

    const canContinue = useMemo(() => {
        if (!currentQuestion?.key) return true;

        const key = currentQuestion.key as keyof typeof userData;
        const value = userData[key];

        // Check if the current question is skippable
        if (currentQuestion.skippable) return true;

        // Check if value exists and is not empty
        if (value === undefined || value === null || value === "") {
            return false;
        }

        // For array values, check if not empty
        if (Array.isArray(value) && value.length === 0) {
            return false;
        }

        return true;
    }, [currentQuestion, userData]);

    const goNext = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, questions.length]);

    const goBack = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    }, [currentIndex]);

    const completeQuiz = useCallback(async () => {
        setIsSubmitting(true);
        try {
            await submitUserData();
            // Navigate to home or success screen after completion
            navigation.navigate("Home" as never);
        } catch (error) {
            console.error("Error completing quiz", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, [submitUserData, navigation]);

    const value: QuizFlowContextType = {
        currentIndex,
        currentQuestion,
        questions,
        isLoading: isLoadingDictionary || isSubmitting,
        canGoBack,
        canContinue,
        totalQuestions: questions.length,
        goNext,
        goBack,
        completeQuiz,
    };

    return (
        <QuizFlowContext.Provider value={value}>
            {children}
        </QuizFlowContext.Provider>
    );
};

export const useQuizFlow = (): QuizFlowContextType => {
    const context = useContext(QuizFlowContext);
    if (context === undefined) {
        throw new Error("useQuizFlow must be used within a QuizFlowProvider");
    }
    return context;
};
