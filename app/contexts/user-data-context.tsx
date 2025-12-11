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

type UserDataContextType = {
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

const UserDataContext = createContext<UserDataContextType | undefined>(
    undefined,
);

type UserDataProviderProps = {
    children: ReactNode;
    initialData?: Partial<QuizUserResponse>;
};

export const UserDataProvider = ({
    children,
    initialData,
}: UserDataProviderProps) => {
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

    const getLang = async () => {
        try {
            const lang = i18n.resolvedLanguage;
            return lang || "en";
        } catch {
            return "en";
        }
    };

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
    }, []);

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

    const value: UserDataContextType = {
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
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = (): UserDataContextType => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error("useUserData must be used within a UserDataProvider");
    }
    return context;
};
