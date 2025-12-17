import { AuthService } from "@services/auth";
import { UserService } from "@services/users";
import { useAuthStore } from "@stores/auth";
import { useUserStore } from "@stores/users";
import { secureStorage } from "@utils/storage";

import { mockAuthResponse, mockUserDataResponse } from "../mocks/api-mocks";

describe("Auth Integration Flow", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useAuthStore.setState({
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,
        });

        useUserStore.setState({
            user: null,
            isLoading: false,
        });
    });

    describe("Complete Login Flow", () => {
        it("should handle full login flow: validation → API → storage → user data", async () => {
            (AuthService.login as jest.Mock).mockResolvedValue(
                mockAuthResponse.success,
            );
            (UserService.loadUserData as jest.Mock).mockResolvedValue(
                mockUserDataResponse.success,
            );
            (secureStorage.setItem as jest.Mock).mockResolvedValue(null);

            const { login } = useAuthStore.getState();
            await login("test@example.com", "Password123");

            const authState = useAuthStore.getState();
            expect(authState.isAuthenticated).toBe(true);
            expect(authState.isLoading).toBe(false);

            expect(secureStorage.setItem).toHaveBeenCalledWith(
                "auth-storage-token",
                "mock-jwt-token-12345",
            );

            const userState = useUserStore.getState();
            expect(userState.user).toBeTruthy();
            expect(userState.user?.email).toBe("test@example.com");

            expect(AuthService.login).toHaveBeenCalledWith(
                "test@example.com",
                "Password123",
            );
            expect(UserService.loadUserData).toHaveBeenCalled();
        });

        it("should reject invalid email during login flow", async () => {
            const { login } = useAuthStore.getState();

            await expect(login("invalid-email", "Password123")).rejects.toThrow(
                "Invalid email format",
            );

            expect(AuthService.login).not.toHaveBeenCalled();
            expect(secureStorage.setItem).not.toHaveBeenCalled();
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });

        it("should reject weak password during login flow", async () => {
            const { login } = useAuthStore.getState();

            await expect(login("test@example.com", "weak")).rejects.toThrow(
                "Password must be at least 8 characters",
            );

            expect(AuthService.login).not.toHaveBeenCalled();
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });

        it("should handle API error during login", async () => {
            const apiError = new Error("Network error");
            (AuthService.login as jest.Mock).mockRejectedValue(apiError);

            const { login } = useAuthStore.getState();

            await expect(
                login("test@example.com", "Password123"),
            ).rejects.toThrow("Network error");

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isLoading).toBe(false);

            expect(secureStorage.setItem).not.toHaveBeenCalled();
        });
    });

    describe("Complete Registration Flow", () => {
        it("should handle full registration flow: validation → API → storage → user data", async () => {
            (AuthService.register as jest.Mock).mockResolvedValue(
                mockAuthResponse.successRegister,
            );
            (UserService.loadUserData as jest.Mock).mockResolvedValue(
                mockUserDataResponse.success,
            );
            (secureStorage.setItem as jest.Mock).mockResolvedValue(null);

            const { register } = useAuthStore.getState();

            await register("newuser@example.com", "Password123", "Password123");

            expect(AuthService.register).toHaveBeenCalledWith(
                "newuser@example.com",
                "Password123",
            );
            expect(secureStorage.setItem).toHaveBeenCalledWith(
                "auth-storage-token",
                "mock-jwt-token-12345",
            );
            expect(UserService.loadUserData).toHaveBeenCalled();

            const authState = useAuthStore.getState();
            expect(authState.isAuthenticated).toBe(true);

            const userState = useUserStore.getState();
            expect(userState.user).toBeTruthy();
        });

        it("should reject mismatched passwords", async () => {
            const { register } = useAuthStore.getState();

            await expect(
                register("test@example.com", "Password123", "DifferentPass123"),
            ).rejects.toThrow("PASSWORDS_DO_NOT_MATCH");

            expect(AuthService.register).not.toHaveBeenCalled();
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });

        it("should reject when fields are missing", async () => {
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

            expect(AuthService.register).not.toHaveBeenCalled();
        });
    });

    describe("Complete Logout Flow", () => {
        it("should handle full logout flow: clear storage → reset auth → reset user", async () => {
            useAuthStore.setState({
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
            });

            useUserStore.setState({
                user: {
                    id: "123",
                    email: "test@example.com",
                } as any,
                isLoading: false,
            });

            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            const { logout } = useAuthStore.getState();
            await logout();

            expect(secureStorage.removeItem).toHaveBeenCalledWith(
                "auth-storage-token",
            );

            const authState = useAuthStore.getState();
            expect(authState.isAuthenticated).toBe(false);
            expect(authState.isInitialized).toBe(true);

            const userState = useUserStore.getState();
            expect(userState.user).toBeNull();
        });
    });

    describe("Session Persistence Flow", () => {
        it("should restore session when valid token exists", async () => {
            (secureStorage.getItem as jest.Mock).mockResolvedValue(
                "valid-token",
            );
            (UserService.loadUserData as jest.Mock).mockResolvedValue(
                mockUserDataResponse.success,
            );

            const { checkAuthStatus } = useAuthStore.getState();
            await checkAuthStatus();

            const authState = useAuthStore.getState();
            expect(authState.isAuthenticated).toBe(true);
            expect(authState.isInitialized).toBe(true);

            const userState = useUserStore.getState();
            expect(userState.user).toBeTruthy();
            expect(UserService.loadUserData).toHaveBeenCalled();
        });

        it("should not restore session when no token exists", async () => {
            (secureStorage.getItem as jest.Mock).mockResolvedValue(null);

            const { checkAuthStatus } = useAuthStore.getState();
            await checkAuthStatus();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
            expect(UserService.loadUserData).not.toHaveBeenCalled();
        });

        it("should clear invalid session on error", async () => {
            (secureStorage.getItem as jest.Mock).mockRejectedValue(
                new Error("Token expired"),
            );
            (secureStorage.removeItem as jest.Mock).mockResolvedValue(null);

            const { checkAuthStatus } = useAuthStore.getState();
            await checkAuthStatus();

            expect(secureStorage.removeItem).toHaveBeenCalled();

            const authState = useAuthStore.getState();
            expect(authState.isAuthenticated).toBe(false);

            const userState = useUserStore.getState();
            expect(userState.user).toBeNull();
        });
    });
});
