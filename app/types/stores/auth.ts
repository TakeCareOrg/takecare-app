export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    resetPasswordEmail: string | null;
    resetPasswordToken: string | null;
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
    forgotPassword: (email: string) => Promise<void>;
    verifyResetCode: (code: string) => Promise<void>;
    resetPassword: (
        newPassword: string,
        confirmPassword: string,
    ) => Promise<void>;
    clearResetPasswordState: () => void;
}
