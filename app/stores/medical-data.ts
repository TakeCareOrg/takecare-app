import axios from "axios";
import { create } from "zustand";

import i18n from "@app/i18n";
import {
    MedicalDataActions,
    MedicalDataState,
} from "@dtypes/stores/medical-data";

import { useAuthStore } from "./auth";

const initialState: MedicalDataState = {
    allergies: null,
    medical_jobs: null,
    sports: null,
    chronic_illnesses: null,
    surgical_interventions: null,
    isLoading: false,
};

type MedicalDataStore = MedicalDataState & MedicalDataActions;

export const useMedicalDataStore = create<MedicalDataStore>((set, get) => ({
    ...initialState,
    loadMedicalData: async () => {
        set({ isLoading: true });

        try {
            const language = i18n.resolvedLanguage || "en";

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

            set({
                allergies,
                medical_jobs,
                sports,
                chronic_illnesses,
                surgical_interventions,
                isLoading: false,
            });
        } catch (error) {
            set({ ...initialState });
            throw error;
        }
    },

    clearMedicalData: () => set({ ...initialState }),
}));

export const initializeMedicalData = () => {
    // Make sure both stores are initialized before setting up subscriptions
    useAuthStore.subscribe((state) => {
        if (state.isAuthenticated && !state.isLoading) {
            useMedicalDataStore.getState().loadMedicalData();
        }
        if (!state.isAuthenticated) {
            useMedicalDataStore.getState().clearMedicalData();
        }
    });
};
