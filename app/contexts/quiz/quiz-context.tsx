import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useUserQuizData } from "@app/contexts/quiz/user-quiz-data-context";
import { useUserStore } from "@app/stores/users";
import { QuestionType, QuizUserResponse } from "@dtypes/quiz-types";
import { useQuestionsQuiz } from "@hooks/useQuiz";

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
    onComplete?: () => void;
};

export const QuizFlowProvider = ({
    children,
    onComplete,
}: QuizFlowProviderProps) => {
    const questions = useQuestionsQuiz();
    const {
        userData,
        submitUserData,
        loadDictionaryData,
        isLoadingDictionary,
    } = useUserQuizData();

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

        if (currentQuestion.key === "birth_date") {
            const birth_date = userData.birth_date;
            if (!birth_date) return false;
            const formattedAge = new Date(birth_date).getFullYear();
            const currentYear = new Date().getFullYear();
            return (
                formattedAge !== undefined &&
                formattedAge !== null &&
                currentYear - formattedAge >= 18
            );
        }

        if (currentQuestion.skippable) return true;

        const keys = currentQuestion.key as string | string[];
        if (Array.isArray(keys)) {
            return keys.every(
                (k) =>
                    userData[k as keyof QuizUserResponse] !== undefined &&
                    userData[k as keyof QuizUserResponse] !== null &&
                    userData[k as keyof QuizUserResponse] !== "",
            );
        }
        const value = userData[keys as keyof typeof userData];

        if (
            (currentQuestion.key === "weight" ||
                currentQuestion.key === "height") &&
            value === 0
        ) {
            return false;
        }

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

            await new Promise((resolve) => setTimeout(resolve, 500));

            await useUserStore.getState().loadUserData(true);

            if (onComplete) {
                onComplete();
            }
        } catch (error) {
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, [submitUserData, onComplete]);

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
