export interface MedicalDataState {
    allergies: { label: string; value: string }[] | null;
    medical_jobs: { label: string; value: string }[] | null;
    sports: { label: string; value: string }[] | null;
    chronic_illnesses: { label: string; value: string }[] | null;
    surgical_interventions: { label: string; value: string }[] | null;
    isLoading: boolean;
}

export interface MedicalDataActions {
    loadMedicalData: () => Promise<void>;
    clearMedicalData: () => void;
}
