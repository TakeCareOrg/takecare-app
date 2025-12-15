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
                "auth-storage-token",
                "mock-jwt-token-12345",
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

            const { login } = useAuthStore.getState();

            await expect(
                login("test@example.com", "Password123"),
            ).rejects.toThrow();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isLoading).toBe(false);
        });
    });

    describe("register", () => {
        it("should successfully register with valid data", async () => {
            (AuthService.register as jest.Mock).mockResolvedValue(
                mockAuthResponse.success,
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
    });

    describe("logout", () => {
        it("should clear authentication state on logout", async () => {
            useAuthStore.setState({
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
            });

            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            const { logout } = useAuthStore.getState();
            await logout();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-token",
            );
        });

        it("should clear user data on logout", async () => {
            useUserStore.setState({
                user: { id: "123", email: "test@example.com" } as any,
                isLoading: false,
            });

            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            const { logout } = useAuthStore.getState();
            await logout();

            const userState = useUserStore.getState();
            expect(userState.user).toBeNull();
        });
    });

    describe("checkAuthStatus", () => {
        it("should set authenticated if token exists", async () => {
            (secureStorage.getItem as jest.Mock).mockResolvedValue(
                "mock-token",
            );

            const { checkAuthStatus } = useAuthStore.getState();
            await checkAuthStatus();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(true);
            expect(state.isInitialized).toBe(true);
            expect(state.isLoading).toBe(false);
        });

        it("should set unauthenticated if no token exists", async () => {
            (secureStorage.getItem as jest.Mock).mockResolvedValue(null);

            const { checkAuthStatus } = useAuthStore.getState();
            await checkAuthStatus();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
            expect(state.isLoading).toBe(false);
        });

        it("should handle errors and clear auth data", async () => {
            (secureStorage.getItem as jest.Mock).mockRejectedValue(
                new Error("Storage error"),
            );
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            const { checkAuthStatus } = useAuthStore.getState();
            await checkAuthStatus();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
            expect(secureStorage.removeItem).toHaveBeenCalled();
        });
    });
});
