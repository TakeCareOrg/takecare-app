import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";
import { useTranslation } from "react-i18next";

import { UserService } from "@app/services/users";
import {
    DictionaryData,
    QUIZ_USER_DEFAULT,
    QuizUserResponse,
} from "@dtypes/quiz-types";
import axios from "@services/axios";

type UserQuizDataContextType = {
    userData: QuizUserResponse;
    dictionaryData: DictionaryData;
    isLoadingDictionary: boolean;
    updateField: <K extends keyof QuizUserResponse>(
        key: K,
        value: QuizUserResponse[K],
    ) => void;
    bulkUpdate: (partial: Partial<QuizUserResponse>) => void;
    loadDictionaryData: (lang?: string) => Promise<void>;
    submitUserData: () => Promise<void>;
    resetData: () => void;
};

const UserQuizDataContext = createContext<UserQuizDataContextType | undefined>(
    undefined,
);

type UserQuizDataProviderProps = {
    children: ReactNode;
    initialData?: Partial<QuizUserResponse>;
};

export const UserQuizDataProvider = ({
    children,
    initialData,
}: UserQuizDataProviderProps) => {
    const [userData, setUserData] = useState<QuizUserResponse>({
        ...QUIZ_USER_DEFAULT,
        ...initialData,
    });
    const [dictionaryData, setDictionaryData] = useState<DictionaryData>({});
    const [isLoadingDictionary, setIsLoadingDictionary] = useState(false);
    const { i18n } = useTranslation();

    const updateField = useCallback(
        <K extends keyof QuizUserResponse>(
            key: K,
            value: QuizUserResponse[K],
        ) => {
            setUserData((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        [],
    );

    const bulkUpdate = useCallback((partial: Partial<QuizUserResponse>) => {
        setUserData((prev) => ({
            ...prev,
            ...partial,
        }));
    }, []);

    const getLang = useCallback(async () => {
        try {
            const lang = i18n.resolvedLanguage;
            return lang || "en";
        } catch {
            return "en";
        }
    }, [i18n]);

    const loadDictionaryData = useCallback(async () => {
        setIsLoadingDictionary(true);
        try {
            const language = await getLang();

            const [
                allergies,
                medical_jobs,
                sports,
                chronic_illnesses,
                surgical_interventions,
            ] = await Promise.all([
                axios
                    .get(`/quiz/allergies?lang=${language}`)
                    .then((res) => res.data.allergies),
                axios
                    .get(`/quiz/medical_jobs?lang=${language}`)
                    .then((res) => res.data.medical_jobs),
                axios
                    .get(`/quiz/sports?lang=${language}`)
                    .then((res) => res.data.sports),
                axios
                    .get(`/quiz/chronic_illnesses?lang=${language}`)
                    .then((res) => res.data.chronic_illnesses),
                axios
                    .get(`/quiz/surgical_interventions?lang=${language}`)
                    .then((res) => res.data.surgical_interventions),
            ]);

            setDictionaryData({
                allergies,
                medical_jobs,
                sports,
                chronic_illnesses,
                surgical_interventions,
            });
        } catch {
        } finally {
            setIsLoadingDictionary(false);
        }
    }, [getLang]);

    const submitUserData = useCallback(async () => {
        try {
            // TODO: Replace with actual API call when available
            // For now, using the auth service to complete quiz
            await UserService.completeQuiz(userData);
        } catch {
            throw new Error("Error submitting user data");
        }
    }, [userData]);

    const resetData = useCallback(() => {
        setUserData(QUIZ_USER_DEFAULT);
    }, []);

    const value: UserQuizDataContextType = {
        userData,
        dictionaryData,
        isLoadingDictionary,
        updateField,
        bulkUpdate,
        loadDictionaryData,
        submitUserData,
        resetData,
    };

    return (
        <UserQuizDataContext.Provider value={value}>
            {children}
        </UserQuizDataContext.Provider>
    );
};

export const useUserQuizData = (): UserQuizDataContextType => {
    const context = useContext(UserQuizDataContext);
    if (context === undefined) {
        throw new Error(
            "useUserQuizData must be used within a UserQuizDataProvider",
        );
    }
    return context;
};
