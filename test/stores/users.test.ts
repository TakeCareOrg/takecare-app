import { UserService } from "@services/users";
import { useAuthStore } from "@stores/auth";
import { useUserStore, initializeUserAuth } from "@stores/users";

import { mockUserDataResponse } from "../mocks/api-mocks";

jest.mock("@services/users", () => ({
    UserService: {
        loadUserData: jest.fn(),
        updateUserHealthData: jest.fn(),
    },
}));

describe("Users Store", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useUserStore.setState({
            user: null,
            isLoading: false,
        });

        useAuthStore.setState({
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,
        });
    });

    describe("loadUserData", () => {
        it("should load user data when authenticated", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            (UserService.loadUserData as jest.Mock).mockResolvedValue(
                mockUserDataResponse.success,
            );

            const { loadUserData } = useUserStore.getState();
            await loadUserData();

            const state = useUserStore.getState();
            expect(state.user).toBeTruthy();
            expect(state.user?.email).toBe("test@example.com");
            expect(state.isLoading).toBe(false);
            expect(UserService.loadUserData).toHaveBeenCalled();
        });

        it("should not load user data when not authenticated", async () => {
            useAuthStore.setState({ isAuthenticated: false });

            const { loadUserData } = useUserStore.getState();
            await loadUserData();

            const state = useUserStore.getState();
            expect(state.user).toBeNull();
            expect(state.isLoading).toBe(false);
            expect(UserService.loadUserData).not.toHaveBeenCalled();
        });

        it("should not reload if user data already exists", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            useUserStore.setState({
                user: {
                    id: "123",
                    email: "existing@example.com",
                } as any,
                isLoading: false,
            });

            const { loadUserData } = useUserStore.getState();
            await loadUserData();

            expect(UserService.loadUserData).not.toHaveBeenCalled();
            expect(useUserStore.getState().user?.email).toBe(
                "existing@example.com",
            );
        });

        it("should force reload even if user data exists when forceReload is true", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            useUserStore.setState({
                user: { id: "123", email: "old@example.com" } as any,
                isLoading: false,
            });
            (UserService.loadUserData as jest.Mock).mockResolvedValue(
                mockUserDataResponse.success,
            );

            await useUserStore.getState().loadUserData(true);

            expect(UserService.loadUserData).toHaveBeenCalled();
            expect(useUserStore.getState().user?.email).toBe(
                "test@example.com",
            );
        });

        it("should set loading state during API call", async () => {
            useAuthStore.setState({ isAuthenticated: true });

            let loadingDuringCall = false;
            (UserService.loadUserData as jest.Mock).mockImplementation(() => {
                loadingDuringCall = useUserStore.getState().isLoading;
                return Promise.resolve(mockUserDataResponse.success);
            });

            const { loadUserData } = useUserStore.getState();
            await loadUserData();

            expect(loadingDuringCall).toBe(true);
            expect(useUserStore.getState().isLoading).toBe(false);
        });

        it("should handle API error and reset state", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            const error = new Error("Failed to load user data");
            (UserService.loadUserData as jest.Mock).mockRejectedValue(error);

            const { loadUserData } = useUserStore.getState();

            await expect(loadUserData()).rejects.toThrow(
                "Failed to load user data",
            );

            const state = useUserStore.getState();
            expect(state.user).toBeNull();
            expect(state.isLoading).toBe(false);
        });

        it("should handle network timeout", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            (UserService.loadUserData as jest.Mock).mockRejectedValue(
                new Error("Network timeout"),
            );

            const { loadUserData } = useUserStore.getState();

            await expect(loadUserData()).rejects.toThrow("Network timeout");
            expect(useUserStore.getState().user).toBeNull();
        });

        it("should not set user when response status is not 200", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            (UserService.loadUserData as jest.Mock).mockResolvedValue({
                status: 204,
                data: { user: { email: "test@example.com" } },
            });

            await useUserStore.getState().loadUserData();

            expect(useUserStore.getState().user).toBeNull();
        });
    });

    describe("clearUserData", () => {
        it("should clear user data and reset state", () => {
            useUserStore.setState({
                user: {
                    id: "123",
                    email: "test@example.com",
                } as any,
                isLoading: false,
            });

            const { clearUserData } = useUserStore.getState();
            clearUserData();

            const state = useUserStore.getState();
            expect(state.user).toBeNull();
            expect(state.isLoading).toBe(false);
        });

        it("should handle clearing when already null", () => {
            useUserStore.setState({ user: null, isLoading: false });

            const { clearUserData } = useUserStore.getState();

            expect(() => clearUserData()).not.toThrow();
            expect(useUserStore.getState().user).toBeNull();
        });

        it("should reset loading state when clearing", () => {
            useUserStore.setState({
                user: { id: "123" } as any,
                isLoading: true,
            });

            const { clearUserData } = useUserStore.getState();
            clearUserData();

            expect(useUserStore.getState().isLoading).toBe(false);
        });
    });

    describe("updateUserData", () => {
        it("should update user data optimistically", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            useUserStore.setState({
                user: {
                    id: "123",
                    email: "test@example.com",
                    first_name: "John",
                    last_name: "Doe",
                } as any,
                isLoading: false,
            });

            await useUserStore
                .getState()
                .updateUserData({ first_name: "Jane" } as any);

            const user = useUserStore.getState().user;
            expect(user?.first_name).toBe("Jane");
            expect(user?.last_name).toBe("Doe");
            expect(user?.email).toBe("test@example.com");
        });

        it("should merge data without overwriting unrelated fields", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            useUserStore.setState({
                user: {
                    id: "123",
                    email: "test@example.com",
                    first_name: "John",
                    last_name: "Doe",
                    avatar: "avatar.jpg",
                } as any,
            });

            await useUserStore
                .getState()
                .updateUserData({ last_name: "Smith" } as any);

            const user = useUserStore.getState().user;
            expect(user?.first_name).toBe("John");
            expect(user?.last_name).toBe("Smith");
            expect(user?.avatar).toBe("avatar.jpg");
        });

        it("should throw when user is not authenticated", async () => {
            useAuthStore.setState({ isAuthenticated: false });
            useUserStore.setState({ user: null });

            await expect(
                useUserStore.getState().updateUserData({ first_name: "Jane" } as any),
            ).rejects.toThrow("User not authenticated");
        });

        it("should throw when authenticated but user is null", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            useUserStore.setState({ user: null });

            await expect(
                useUserStore.getState().updateUserData({ first_name: "Jane" } as any),
            ).rejects.toThrow("User not authenticated");
        });
    });

    describe("updateUserHealthData", () => {
        const mockUser = {
            id: "123",
            email: "test@example.com",
            health: { weight: 70, height: 175 },
        };

        it("should update health data and merge with existing health", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            useUserStore.setState({ user: mockUser as any });

            (UserService.updateUserHealthData as jest.Mock).mockResolvedValue({
                status: 200,
                data: { user: { weight: 80 } },
            });

            await useUserStore.getState().updateUserHealthData({ weight: 80 } as any);

            const user = useUserStore.getState().user;
            expect(user?.health?.weight).toBe(80);
            expect(user?.health?.height).toBe(175);
            expect(useUserStore.getState().isLoading).toBe(false);
        });

        it("should not update state when response status is not 200", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            useUserStore.setState({ user: mockUser as any });

            (UserService.updateUserHealthData as jest.Mock).mockResolvedValue({
                status: 204,
                data: { user: { weight: 80 } },
            });

            await useUserStore.getState().updateUserHealthData({ weight: 80 } as any);

            expect(useUserStore.getState().user?.health?.weight).toBe(70);
        });

        it("should throw when user is not authenticated", async () => {
            useAuthStore.setState({ isAuthenticated: false });
            useUserStore.setState({ user: null });

            await expect(
                useUserStore.getState().updateUserHealthData({ weight: 80 } as any),
            ).rejects.toThrow("User not authenticated");

            expect(UserService.updateUserHealthData).not.toHaveBeenCalled();
        });

        it("should throw when authenticated but user is null", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            useUserStore.setState({ user: null });

            await expect(
                useUserStore.getState().updateUserHealthData({ weight: 80 } as any),
            ).rejects.toThrow("User not authenticated");
        });

        it("should propagate API errors", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            useUserStore.setState({ user: mockUser as any });

            (UserService.updateUserHealthData as jest.Mock).mockRejectedValue(
                new Error("API error"),
            );

            await expect(
                useUserStore.getState().updateUserHealthData({ weight: 80 } as any),
            ).rejects.toThrow("API error");
        });

        it("should handle empty existing health data", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            useUserStore.setState({
                user: { ...mockUser, health: undefined } as any,
            });

            (UserService.updateUserHealthData as jest.Mock).mockResolvedValue({
                status: 200,
                data: { user: { weight: 80 } },
            });

            await useUserStore.getState().updateUserHealthData({ weight: 80 } as any);

            expect(useUserStore.getState().user?.health?.weight).toBe(80);
        });
    });

    describe("initializeUserAuth", () => {
        it("should clear user data when auth becomes unauthenticated", () => {
            useUserStore.setState({
                user: { id: "123", email: "test@example.com" } as any,
            });
            useAuthStore.setState({ isAuthenticated: true });

            initializeUserAuth();

            useAuthStore.setState({ isAuthenticated: false });

            expect(useUserStore.getState().user).toBeNull();
        });

        it("should not clear user data when auth remains authenticated", () => {
            useUserStore.setState({
                user: { id: "123", email: "test@example.com" } as any,
            });
            useAuthStore.setState({ isAuthenticated: true });

            initializeUserAuth();

            useAuthStore.setState({ isAuthenticated: true, isLoading: false });

            expect(useUserStore.getState().user).not.toBeNull();
        });
    });

    describe("Integration with auth store", () => {
        it("should clear user data when auth state becomes unauthenticated", () => {
            useUserStore.setState({
                user: { id: "123", email: "test@example.com" } as any,
                isLoading: false,
            });

            useAuthStore.setState({ isAuthenticated: false });
            useUserStore.getState().clearUserData();

            expect(useUserStore.getState().user).toBeNull();
        });

        it("should not load user data when loadUserData is called without auth", async () => {
            useAuthStore.setState({ isAuthenticated: false });

            const { loadUserData } = useUserStore.getState();
            await loadUserData();

            expect(UserService.loadUserData).not.toHaveBeenCalled();
            expect(useUserStore.getState().user).toBeNull();
        });

        it("should handle complete auth flow with user data", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            (UserService.loadUserData as jest.Mock).mockResolvedValue(
                mockUserDataResponse.success,
            );

            await useUserStore.getState().loadUserData();
            expect(useUserStore.getState().user).toBeTruthy();

            useAuthStore.setState({ isAuthenticated: false });
            useUserStore.getState().clearUserData();
            expect(useUserStore.getState().user).toBeNull();
        });
    });

    describe("Edge cases", () => {
        it("should handle partial user data", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            (UserService.loadUserData as jest.Mock).mockResolvedValue({
                status: 200,
                data: {
                    user: {
                        first_name: "John",
                    },
                },
            });

            await useUserStore.getState().loadUserData();

            const user = useUserStore.getState().user;
            expect(user?.first_name).toBe("John");
        });

        it("should handle empty response gracefully", async () => {
            useAuthStore.setState({ isAuthenticated: true });
            (UserService.loadUserData as jest.Mock).mockResolvedValue({
                status: 200,
                data: { user: null },
            });

            await useUserStore.getState().loadUserData();

            expect(useUserStore.getState().user).toBeNull();
        });
    });
});
