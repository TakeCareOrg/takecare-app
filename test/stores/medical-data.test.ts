import axios from "axios";
import { useAuthStore } from "@stores/auth";
import {
    useMedicalDataStore,
    initializeMedicalData,
} from "@stores/medical-data";

jest.mock("axios");
jest.mock("@app/i18n", () => ({
    resolvedLanguage: "en",
}));

const mockMedicalData = {
    allergies: [
        { label: "Pollen", value: "pollen" },
        { label: "Dust", value: "dust" },
    ],
    medical_jobs: [
        { label: "Doctor", value: "doctor" },
        { label: "Nurse", value: "nurse" },
    ],
    sports: [
        { label: "Running", value: "running" },
        { label: "Swimming", value: "swimming" },
    ],
    chronic_illnesses: [
        { label: "Diabetes", value: "diabetes" },
        { label: "Hypertension", value: "hypertension" },
    ],
    surgical_interventions: [
        { label: "Appendectomy", value: "appendectomy" },
    ],
};

describe("Medical Data Store", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useMedicalDataStore.setState({
            allergies: null,
            medical_jobs: null,
            sports: null,
            chronic_illnesses: null,
            surgical_interventions: null,
            isLoading: false,
        });

        useAuthStore.setState({
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,
        });
    });

    describe("loadMedicalData", () => {
        it("should load all medical data successfully", async () => {
            (axios.get as jest.Mock).mockImplementation((url: string) => {
                if (url.includes("allergies"))
                    return Promise.resolve({
                        data: { allergies: mockMedicalData.allergies },
                    });
                if (url.includes("medical_jobs"))
                    return Promise.resolve({
                        data: { medical_jobs: mockMedicalData.medical_jobs },
                    });
                if (url.includes("sports"))
                    return Promise.resolve({
                        data: { sports: mockMedicalData.sports },
                    });
                if (url.includes("chronic_illnesses"))
                    return Promise.resolve({
                        data: {
                            chronic_illnesses: mockMedicalData.chronic_illnesses,
                        },
                    });
                if (url.includes("surgical_interventions"))
                    return Promise.resolve({
                        data: {
                            surgical_interventions:
                                mockMedicalData.surgical_interventions,
                        },
                    });
            });

            await useMedicalDataStore.getState().loadMedicalData();

            const state = useMedicalDataStore.getState();
            expect(state.allergies).toEqual(mockMedicalData.allergies);
            expect(state.medical_jobs).toEqual(mockMedicalData.medical_jobs);
            expect(state.sports).toEqual(mockMedicalData.sports);
            expect(state.chronic_illnesses).toEqual(
                mockMedicalData.chronic_illnesses,
            );
            expect(state.surgical_interventions).toEqual(
                mockMedicalData.surgical_interventions,
            );
            expect(state.isLoading).toBe(false);
        });

        it("should set isLoading to true during fetch", async () => {
            let loadingDuringCall = false;

            (axios.get as jest.Mock).mockImplementation((url: string) => {
                loadingDuringCall = useMedicalDataStore.getState().isLoading;
                if (url.includes("allergies"))
                    return Promise.resolve({ data: { allergies: [] } });
                if (url.includes("medical_jobs"))
                    return Promise.resolve({ data: { medical_jobs: [] } });
                if (url.includes("sports"))
                    return Promise.resolve({ data: { sports: [] } });
                if (url.includes("chronic_illnesses"))
                    return Promise.resolve({ data: { chronic_illnesses: [] } });
                if (url.includes("surgical_interventions"))
                    return Promise.resolve({
                        data: { surgical_interventions: [] },
                    });
            });

            await useMedicalDataStore.getState().loadMedicalData();

            expect(loadingDuringCall).toBe(true);
            expect(useMedicalDataStore.getState().isLoading).toBe(false);
        });

        it("should use resolved language in API calls", async () => {
            (axios.get as jest.Mock).mockResolvedValue({ data: {} });

            await useMedicalDataStore.getState().loadMedicalData().catch(() => {});

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("lang=en"),
            );
        });

        it("should reset to initial state and rethrow on API error", async () => {
            useMedicalDataStore.setState({
                allergies: [{ label: "Pollen", value: "pollen" }],
                medical_jobs: [{ label: "Doctor", value: "doctor" }],
                sports: null,
                chronic_illnesses: null,
                surgical_interventions: null,
                isLoading: false,
            });

            (axios.get as jest.Mock).mockRejectedValue(
                new Error("Network error"),
            );

            await expect(
                useMedicalDataStore.getState().loadMedicalData(),
            ).rejects.toThrow("Network error");

            const state = useMedicalDataStore.getState();
            expect(state.allergies).toBeNull();
            expect(state.medical_jobs).toBeNull();
            expect(state.isLoading).toBe(false);
        });

        it("should make exactly 5 API calls in parallel", async () => {
            (axios.get as jest.Mock).mockImplementation((url: string) => {
                if (url.includes("allergies"))
                    return Promise.resolve({ data: { allergies: [] } });
                if (url.includes("medical_jobs"))
                    return Promise.resolve({ data: { medical_jobs: [] } });
                if (url.includes("sports"))
                    return Promise.resolve({ data: { sports: [] } });
                if (url.includes("chronic_illnesses"))
                    return Promise.resolve({ data: { chronic_illnesses: [] } });
                if (url.includes("surgical_interventions"))
                    return Promise.resolve({
                        data: { surgical_interventions: [] },
                    });
            });

            await useMedicalDataStore.getState().loadMedicalData();

            expect(axios.get).toHaveBeenCalledTimes(5);
        });

        it("should reset state when one of the parallel requests fails", async () => {
            (axios.get as jest.Mock).mockImplementation((url: string) => {
                if (url.includes("allergies"))
                    return Promise.reject(new Error("Allergies API down"));
                return Promise.resolve({ data: {} });
            });

            await expect(
                useMedicalDataStore.getState().loadMedicalData(),
            ).rejects.toThrow("Allergies API down");

            expect(useMedicalDataStore.getState().allergies).toBeNull();
            expect(useMedicalDataStore.getState().isLoading).toBe(false);
        });
    });

    describe("clearMedicalData", () => {
        it("should reset all fields to initial state", () => {
            useMedicalDataStore.setState({
                allergies: mockMedicalData.allergies,
                medical_jobs: mockMedicalData.medical_jobs,
                sports: mockMedicalData.sports,
                chronic_illnesses: mockMedicalData.chronic_illnesses,
                surgical_interventions: mockMedicalData.surgical_interventions,
                isLoading: false,
            });

            useMedicalDataStore.getState().clearMedicalData();

            const state = useMedicalDataStore.getState();
            expect(state.allergies).toBeNull();
            expect(state.medical_jobs).toBeNull();
            expect(state.sports).toBeNull();
            expect(state.chronic_illnesses).toBeNull();
            expect(state.surgical_interventions).toBeNull();
            expect(state.isLoading).toBe(false);
        });

        it("should handle clearing when already in initial state", () => {
            expect(() =>
                useMedicalDataStore.getState().clearMedicalData(),
            ).not.toThrow();

            expect(useMedicalDataStore.getState().allergies).toBeNull();
        });
    });

    describe("initializeMedicalData", () => {
        it("should call loadMedicalData when auth becomes authenticated and not loading", async () => {
            const loadMedicalData = jest.fn().mockResolvedValue(undefined);
            useMedicalDataStore.setState({ loadMedicalData } as any);

            initializeMedicalData();

            useAuthStore.setState({ isAuthenticated: true, isLoading: false });

            await Promise.resolve();

            expect(loadMedicalData).toHaveBeenCalled();
        });

        it("should not call loadMedicalData when auth is loading", async () => {
            const loadMedicalData = jest.fn().mockResolvedValue(undefined);
            useMedicalDataStore.setState({ loadMedicalData } as any);

            initializeMedicalData();

            useAuthStore.setState({ isAuthenticated: true, isLoading: true });

            await Promise.resolve();

            expect(loadMedicalData).not.toHaveBeenCalled();
        });

        it("should call clearMedicalData when auth becomes unauthenticated", () => {
            const clearMedicalData = jest.fn();
            useMedicalDataStore.setState({ clearMedicalData } as any);

            useAuthStore.setState({ isAuthenticated: true });

            initializeMedicalData();

            useAuthStore.setState({ isAuthenticated: false });

            expect(clearMedicalData).toHaveBeenCalled();
        });
    });
});
