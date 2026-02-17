import { AuthService } from "@services/auth";
import { useAuthStore } from "@stores/auth";
import { useUserStore } from "@stores/users";
import { secureStorage } from "@utils/storage";

import { mockAuthResponse, resetFetchMock } from "../mocks/api-mocks";

describe("Auth Store", () => {
    beforeEach(() => {
        useAuthStore.setState({
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,
            resetPasswordEmail: null,
            resetPasswordToken: null,
        });
        useUserStore.setState({
            user: null,
            isLoading: false,
        });

        resetFetchMock();
        jest.clearAllMocks();
    });

    describe("login", () => {
        it("should successfully login with valid credentials", async () => {
            (AuthService.login as jest.Mock).mockResolvedValue(
                mockAuthResponse.success,
            );
            (secureStorage.setItem as jest.Mock).mockResolvedValue(null);

            const { login } = useAuthStore.getState();
            await login("test@example.com", "Password123");

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(true);
            expect(state.isLoading).toBe(false);
            expect(secureStorage.setItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
                "mock-access-token-12345",
            );
            expect(secureStorage.setItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
                "mock-refresh-token-12345",
            );
        });

        it("should throw error with invalid email format", async () => {
            const { login } = useAuthStore.getState();

            await expect(login("invalid-email", "Password123")).rejects.toThrow(
                "Invalid email format",
            );

            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });

        it("should throw error with invalid password format", async () => {
            const { login } = useAuthStore.getState();

            await expect(login("test@example.com", "weak")).rejects.toThrow(
                "Password must be at least 8 characters",
            );

            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });

        it("should throw error when email or password is missing", async () => {
            const { login } = useAuthStore.getState();

            await expect(login("", "Password123")).rejects.toThrow(
                "Email and password are required",
            );

            await expect(login("test@example.com", "")).rejects.toThrow(
                "Email and password are required",
            );
        });

        it("should handle API error during login", async () => {
            (AuthService.login as jest.Mock).mockRejectedValue(
                new Error("API Error"),
            );
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            const { login } = useAuthStore.getState();

            await expect(
                login("test@example.com", "Password123"),
            ).rejects.toThrow();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isLoading).toBe(false);
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
            );
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
            );
        });

        it("should clean up tokens if storing refresh token fails", async () => {
            (AuthService.login as jest.Mock).mockResolvedValue(
                mockAuthResponse.success,
            );
            (secureStorage.setItem as jest.Mock)
                .mockResolvedValueOnce(null)
                .mockRejectedValueOnce(new Error("Storage full"));
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            const { login } = useAuthStore.getState();

            await expect(
                login("test@example.com", "Password123"),
            ).rejects.toThrow("Storage full");

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isLoading).toBe(false);
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
            );
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
            );
        });
    });

    describe("register", () => {
        it("should successfully register with valid data", async () => {
            (AuthService.register as jest.Mock).mockResolvedValue(
                mockAuthResponse.successRegister,
            );
            (secureStorage.setItem as jest.Mock).mockResolvedValue(null);

            const { register } = useAuthStore.getState();
            await register("test@example.com", "Password123", "Password123");

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(true);
            expect(state.isLoading).toBe(false);
        });

        it("should throw error when passwords do not match", async () => {
            const { register } = useAuthStore.getState();

            await expect(
                register(
                    "test@example.com",
                    "Password123",
                    "DifferentPassword123",
                ),
            ).rejects.toThrow("PASSWORDS_DO_NOT_MATCH");
        });

        it("should throw error when any field is missing", async () => {
            const { register } = useAuthStore.getState();

            await expect(
                register("", "Password123", "Password123"),
            ).rejects.toThrow("ALL_FIELDS_REQUIRED");

            await expect(
                register("test@example.com", "", "Password123"),
            ).rejects.toThrow("ALL_FIELDS_REQUIRED");

            await expect(
                register("test@example.com", "Password123", ""),
            ).rejects.toThrow("ALL_FIELDS_REQUIRED");
        });

        it("should throw error with invalid email format", async () => {
            const { register } = useAuthStore.getState();

            await expect(
                register("invalid-email", "Password123", "Password123"),
            ).rejects.toThrow("INVALID_EMAIL_FORMAT");
        });

        it("should throw error with weak password", async () => {
            const { register } = useAuthStore.getState();

            await expect(
                register("test@example.com", "weak", "weak"),
            ).rejects.toThrow("PASSWORD_VALIDATION_FAILED");
        });

        it("should clean up tokens if storing refresh token fails", async () => {
            (AuthService.register as jest.Mock).mockResolvedValue(
                mockAuthResponse.successRegister,
            );
            (secureStorage.setItem as jest.Mock)
                .mockResolvedValueOnce(null)
                .mockRejectedValueOnce(new Error("Storage full"));
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            const { register } = useAuthStore.getState();

            await expect(
                register("test@example.com", "Password123", "Password123"),
            ).rejects.toThrow("Storage full");

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isLoading).toBe(false);
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
            );
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
            );
        });
    });

    describe("logout", () => {
        it("should clear authentication state on logout", async () => {
            useAuthStore.setState({
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
            });

            (secureStorage.getItem as jest.Mock).mockResolvedValue(
                "mock-refresh-token",
            );
            (AuthService.logout as jest.Mock).mockResolvedValue({ status: 200 });
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            await useAuthStore.getState().logout();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
            expect(AuthService.logout).toHaveBeenCalledWith(
                "mock-refresh-token",
            );
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
            );
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
            );
        });

        it("should clear user data on logout", async () => {
            useUserStore.setState({
                user: { id: "123", email: "test@example.com" } as any,
                isLoading: false,
            });

            (secureStorage.getItem as jest.Mock).mockResolvedValue(null);
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            await useAuthStore.getState().logout();

            expect(useUserStore.getState().user).toBeNull();
        });

        it("should still clear local tokens if server logout fails", async () => {
            useAuthStore.setState({
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
            });

            (secureStorage.getItem as jest.Mock).mockResolvedValue(
                "mock-refresh-token",
            );
            (AuthService.logout as jest.Mock).mockRejectedValue(
                new Error("Network error"),
            );
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            await useAuthStore.getState().logout();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
            );
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
            );
        });

        it("should skip server logout call when no refresh token exists", async () => {
            (secureStorage.getItem as jest.Mock).mockResolvedValue(null);
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            await useAuthStore.getState().logout();

            expect(AuthService.logout).not.toHaveBeenCalled();
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });
    });

    describe("checkAuthStatus", () => {
        it("should set authenticated if both tokens exist", async () => {
            (secureStorage.getItem as jest.Mock).mockResolvedValue(
                "mock-token",
            );

            await useAuthStore.getState().checkAuthStatus();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(true);
            expect(state.isInitialized).toBe(true);
            expect(state.isLoading).toBe(false);
        });

        it("should set unauthenticated if no access token exists", async () => {
            (secureStorage.getItem as jest.Mock).mockResolvedValue(null);
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            await useAuthStore.getState().checkAuthStatus();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
            expect(state.isLoading).toBe(false);
        });

        it("should set unauthenticated and clean up if access token exists but refresh token is missing", async () => {
            (secureStorage.getItem as jest.Mock)
                .mockResolvedValueOnce("mock-access-token")
                .mockResolvedValueOnce(null);
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            await useAuthStore.getState().checkAuthStatus();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
            expect(state.isLoading).toBe(false);
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
            );
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
            );
        });

        it("should handle errors and clear auth data", async () => {
            (secureStorage.getItem as jest.Mock).mockRejectedValue(
                new Error("Storage error"),
            );
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            await useAuthStore.getState().checkAuthStatus();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
            );
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
            );
        });
    });

    describe("resetAuthState", () => {
        it("should reset auth state and clear user data", () => {
            useAuthStore.setState({
                isAuthenticated: true,
                isLoading: true,
                isInitialized: true,
                resetPasswordEmail: "test@example.com",
                resetPasswordToken: "some-token",
            });
            useUserStore.setState({
                user: { id: "123" } as any,
                isLoading: false,
            });

            useAuthStore.getState().resetAuthState();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isLoading).toBe(false);
            expect(state.isInitialized).toBe(true);
            expect(state.resetPasswordEmail).toBeNull();
            expect(state.resetPasswordToken).toBeNull();
            expect(useUserStore.getState().user).toBeNull();
        });

        it("should preserve isInitialized as true after reset", () => {
            useAuthStore.setState({ isInitialized: false });

            useAuthStore.getState().resetAuthState();

            expect(useAuthStore.getState().isInitialized).toBe(true);
        });
    });

    describe("forgotPassword", () => {
        it("should set resetPasswordEmail on success", async () => {
            (AuthService.forgotPassword as jest.Mock).mockResolvedValue({
                status: 200,
            });

            await useAuthStore.getState().forgotPassword("test@example.com");

            const state = useAuthStore.getState();
            expect(state.resetPasswordEmail).toBe("test@example.com");
            expect(state.isLoading).toBe(false);
            expect(AuthService.forgotPassword).toHaveBeenCalledWith(
                "test@example.com",
            );
        });

        it("should throw EMAIL_REQUIRED when email is empty", async () => {
            await expect(
                useAuthStore.getState().forgotPassword(""),
            ).rejects.toThrow("EMAIL_REQUIRED");

            expect(AuthService.forgotPassword).not.toHaveBeenCalled();
        });

        it("should throw INVALID_EMAIL_FORMAT when email is malformed", async () => {
            await expect(
                useAuthStore.getState().forgotPassword("not-an-email"),
            ).rejects.toThrow("INVALID_EMAIL_FORMAT");

            expect(AuthService.forgotPassword).not.toHaveBeenCalled();
        });

        it("should reset isLoading and rethrow on API error", async () => {
            (AuthService.forgotPassword as jest.Mock).mockRejectedValue(
                new Error("Network error"),
            );

            await expect(
                useAuthStore.getState().forgotPassword("test@example.com"),
            ).rejects.toThrow("Network error");

            expect(useAuthStore.getState().isLoading).toBe(false);
            expect(useAuthStore.getState().resetPasswordEmail).toBeNull();
        });

        it("should not update resetPasswordEmail when response status is not 200", async () => {
            (AuthService.forgotPassword as jest.Mock).mockResolvedValue({
                status: 204,
            });

            await useAuthStore.getState().forgotPassword("test@example.com");

            expect(useAuthStore.getState().resetPasswordEmail).toBeNull();
            expect(useAuthStore.getState().isLoading).toBe(false);
        });
    });

    describe("verifyResetCode", () => {
        beforeEach(() => {
            useAuthStore.setState({
                ...useAuthStore.getState(),
                resetPasswordEmail: "test@example.com",
                resetPasswordToken: null,
            });
        });

        it("should store reset token on success", async () => {
            (AuthService.verifyResetCode as jest.Mock).mockResolvedValue({
                status: 200,
                data: { token: "reset-token-xyz" },
            });
            (secureStorage.setItem as jest.Mock).mockResolvedValue(null);

            await useAuthStore.getState().verifyResetCode("123456");

            const state = useAuthStore.getState();
            expect(state.resetPasswordToken).toBe("reset-token-xyz");
            expect(state.isLoading).toBe(false);
            expect(AuthService.verifyResetCode).toHaveBeenCalledWith(
                "test@example.com",
                "123456",
            );
            expect(secureStorage.setItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
                "reset-token-xyz",
            );
        });

        it("should throw EMAIL_NOT_SET when resetPasswordEmail is null", async () => {
            useAuthStore.setState({
                ...useAuthStore.getState(),
                resetPasswordEmail: null,
            });

            await expect(
                useAuthStore.getState().verifyResetCode("123456"),
            ).rejects.toThrow("EMAIL_NOT_SET");

            expect(AuthService.verifyResetCode).not.toHaveBeenCalled();
        });

        it("should throw CODE_REQUIRED when code is empty", async () => {
            await expect(
                useAuthStore.getState().verifyResetCode(""),
            ).rejects.toThrow("CODE_REQUIRED");

            expect(AuthService.verifyResetCode).not.toHaveBeenCalled();
        });

        it("should reset isLoading and rethrow on API error", async () => {
            (AuthService.verifyResetCode as jest.Mock).mockRejectedValue(
                new Error("Invalid code"),
            );

            await expect(
                useAuthStore.getState().verifyResetCode("000000"),
            ).rejects.toThrow("Invalid code");

            expect(useAuthStore.getState().isLoading).toBe(false);
            expect(useAuthStore.getState().resetPasswordToken).toBeNull();
        });

        it("should not update resetPasswordToken when response status is not 200", async () => {
            (AuthService.verifyResetCode as jest.Mock).mockResolvedValue({
                status: 204,
                data: { token: "reset-token-xyz" },
            });

            await useAuthStore.getState().verifyResetCode("123456");

            expect(useAuthStore.getState().resetPasswordToken).toBeNull();
            expect(useAuthStore.getState().isLoading).toBe(false);
        });
    });

    describe("resetPassword", () => {
        beforeEach(() => {
            useAuthStore.setState({
                ...useAuthStore.getState(),
                resetPasswordToken: "valid-reset-token",
            });
        });

        it("should clear tokens and reset state on success", async () => {
            (secureStorage.setItem as jest.Mock).mockResolvedValue(null);
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);
            (AuthService.resetPassword as jest.Mock).mockResolvedValue({
                status: 200,
            });

            await useAuthStore
                .getState()
                .resetPassword("NewPassword1", "NewPassword1");

            const state = useAuthStore.getState();
            expect(state.isLoading).toBe(false);
            expect(state.resetPasswordEmail).toBeNull();
            expect(state.resetPasswordToken).toBeNull();
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
            );
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
            );
            expect(AuthService.resetPassword).toHaveBeenCalledWith(
                "NewPassword1",
            );
        });

        it("should throw RESET_TOKEN_NOT_SET when resetPasswordToken is null", async () => {
            useAuthStore.setState({
                ...useAuthStore.getState(),
                resetPasswordToken: null,
            });

            await expect(
                useAuthStore
                    .getState()
                    .resetPassword("NewPassword1", "NewPassword1"),
            ).rejects.toThrow("RESET_TOKEN_NOT_SET");

            expect(AuthService.resetPassword).not.toHaveBeenCalled();
        });

        it("should throw ALL_FIELDS_REQUIRED when any password field is empty", async () => {
            await expect(
                useAuthStore.getState().resetPassword("", "NewPassword1"),
            ).rejects.toThrow("ALL_FIELDS_REQUIRED");

            await expect(
                useAuthStore.getState().resetPassword("NewPassword1", ""),
            ).rejects.toThrow("ALL_FIELDS_REQUIRED");

            expect(AuthService.resetPassword).not.toHaveBeenCalled();
        });

        it("should throw PASSWORD_VALIDATION_FAILED for weak password", async () => {
            await expect(
                useAuthStore.getState().resetPassword("weak", "weak"),
            ).rejects.toThrow("PASSWORD_VALIDATION_FAILED");

            expect(AuthService.resetPassword).not.toHaveBeenCalled();
        });

        it("should throw PASSWORDS_DO_NOT_MATCH when passwords differ", async () => {
            await expect(
                useAuthStore
                    .getState()
                    .resetPassword("NewPassword1", "NewPassword2"),
            ).rejects.toThrow("PASSWORDS_DO_NOT_MATCH");

            expect(AuthService.resetPassword).not.toHaveBeenCalled();
        });

        it("should clear tokens and rethrow on API error", async () => {
            (secureStorage.setItem as jest.Mock).mockResolvedValue(null);
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);
            (AuthService.resetPassword as jest.Mock).mockRejectedValue(
                new Error("Server error"),
            );

            await expect(
                useAuthStore
                    .getState()
                    .resetPassword("NewPassword1", "NewPassword1"),
            ).rejects.toThrow("Server error");

            expect(useAuthStore.getState().isLoading).toBe(false);
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
            );
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-refresh-token",
            );
        });

        it("should set reset token as access token before API call", async () => {
            (secureStorage.setItem as jest.Mock).mockResolvedValue(null);
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);
            (AuthService.resetPassword as jest.Mock).mockResolvedValue({
                status: 200,
            });

            await useAuthStore
                .getState()
                .resetPassword("NewPassword1", "NewPassword1");

            expect(secureStorage.setItem).toHaveBeenCalledWith(
                "auth-storage-access-token",
                "valid-reset-token",
            );
        });

        it("should not clear reset state when response status is not 200", async () => {
            (secureStorage.setItem as jest.Mock).mockResolvedValue(null);
            (AuthService.resetPassword as jest.Mock).mockResolvedValue({
                status: 204,
            });

            await useAuthStore
                .getState()
                .resetPassword("NewPassword1", "NewPassword1");

            expect(useAuthStore.getState().resetPasswordToken).toBe(
                "valid-reset-token",
            );
            expect(useAuthStore.getState().isLoading).toBe(false);
        });
    });

    describe("clearResetPasswordState", () => {
        it("should clear resetPasswordEmail and resetPasswordToken", () => {
            useAuthStore.setState({
                ...useAuthStore.getState(),
                resetPasswordEmail: "test@example.com",
                resetPasswordToken: "some-token",
            });

            useAuthStore.getState().clearResetPasswordState();

            const state = useAuthStore.getState();
            expect(state.resetPasswordEmail).toBeNull();
            expect(state.resetPasswordToken).toBeNull();
        });

        it("should not affect other state fields", () => {
            useAuthStore.setState({
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
                resetPasswordEmail: "test@example.com",
                resetPasswordToken: "some-token",
            });

            useAuthStore.getState().clearResetPasswordState();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(true);
            expect(state.isInitialized).toBe(true);
        });

        it("should handle clearing when already null", () => {
            expect(() =>
                useAuthStore.getState().clearResetPasswordState(),
            ).not.toThrow();

            expect(useAuthStore.getState().resetPasswordEmail).toBeNull();
            expect(useAuthStore.getState().resetPasswordToken).toBeNull();
        });
    });
});
