import { UserService } from "@services/users";
import { useAuthStore } from "@stores/auth";
import { useUserStore } from "@stores/users";

import { mockUserDataResponse } from "../mocks/api-mocks";

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
