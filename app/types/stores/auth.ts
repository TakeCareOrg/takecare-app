export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
}

export interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        confirmPassword: string,
    ) => Promise<void>;
    logout: () => Promise<void>;
    resetAuthState: () => void;
    checkAuthStatus: () => Promise<void>;
}
