import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";

import {
    DictionaryData,
    QUIZ_USER_DEFAULT,
    QuizUserResponse,
} from "@dtypes/quiz-types";
import { AuthService } from "@services/auth";
import axios from "@services/axios";
import { secureStorage } from "@utils/storage";

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
            // const lang = await AsyncStorage.getItem("@Lang");
            const lang = await secureStorage.getItem("language");
            return lang || "en";
        } catch {
            return "en";
        }
    };

    const loadDictionaryData = useCallback(async (lang?: string) => {
        setIsLoadingDictionary(true);
        try {
            const language = lang || (await getLang());
            const [
                allergies,
                jobs,
                sports,
                chronic_illnesses,
                surgical_interventions,
            ] = await Promise.all([
                axios
                    .get(`/medical/allergies?lang=${language}`)
                    .then((res) => res.data),
                axios
                    .get(`/medical/jobs?lang=${language}`)
                    .then((res) => res.data),
                axios
                    .get(`/medical/sports?lang=${language}`)
                    .then((res) => res.data),
                axios
                    .get(`/medical/chronic_illnesses?lang=${language}`)
                    .then((res) => res.data),
                axios
                    .get(`/medical/surgical_interventions?lang=${language}`)
                    .then((res) => res.data),
            ]);

            setDictionaryData({
                allergies,
                jobs,
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
            await AuthService.completeQuiz(userData);
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
