import { useGamificationStore } from "@stores/gamification";
import { useAuthStore } from "@stores/auth";
import { useUserStore } from "@stores/users";
import { GamificationService } from "@services/gamification";
import { mockGamificationResponse } from "../mocks/api-mocks";

jest.mock("@react-native-async-storage/async-storage", () => ({
    __esModule: true,
    default: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    },
}));

jest.mock("@stores/auth");
jest.mock("@stores/users");
jest.mock("@services/gamification");

describe("Gamification Store", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useGamificationStore.setState({
            cache: null,
            isLoading: false,
            error: null,
        });

        (useAuthStore.getState as jest.Mock).mockReturnValue({
            isAuthenticated: true,
        });
        (useUserStore.getState as jest.Mock).mockReturnValue({
            user: { user_id: "user123" },
        });
    });

    describe("fetchProgress", () => {
        it("should fetch and cache gamification data successfully", async () => {
            (GamificationService.getProgress as jest.Mock).mockResolvedValue(
                mockGamificationResponse.success,
            );

            const { fetchProgress } = useGamificationStore.getState();
            await fetchProgress();

            expect(GamificationService.getProgress).toHaveBeenCalled();

            const state = useGamificationStore.getState();
            expect(state.cache).not.toBeNull();
            expect(state.cache?.totalPoints).toBe(150);
            expect(state.cache?.levelInfo?.level).toBe(5);
            expect(state.cache?.levelInfo?.title).toBe("Expert");
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
        });

        it("should skip fetch if cache is valid", async () => {
            useGamificationStore.setState({
                cache: {
                    achievements: [],
                    totalPoints: 100,
                    levelInfo: null,
                    lastFetch: new Date().toISOString(),
                },
            });

            const { fetchProgress } = useGamificationStore.getState();
            await fetchProgress(false);

            expect(GamificationService.getProgress).not.toHaveBeenCalled();
        });

        it("should refetch if cache is older than 1 hour", async () => {
            const oldDate = new Date();
            oldDate.setHours(oldDate.getHours() - 2);

            useGamificationStore.setState({
                cache: {
                    achievements: [],
                    totalPoints: 50,
                    levelInfo: null,
                    lastFetch: oldDate.toISOString(),
                },
            });

            (GamificationService.getProgress as jest.Mock).mockResolvedValue(
                mockGamificationResponse.success,
            );

            const { fetchProgress } = useGamificationStore.getState();
            await fetchProgress(false);

            expect(GamificationService.getProgress).toHaveBeenCalled();

            const state = useGamificationStore.getState();
            expect(state.cache?.totalPoints).toBe(150);
        });

        it("should force refetch when forceReload is true", async () => {
            useGamificationStore.setState({
                cache: {
                    achievements: [],
                    totalPoints: 100,
                    levelInfo: null,
                    lastFetch: new Date().toISOString(),
                },
            });

            (GamificationService.getProgress as jest.Mock).mockResolvedValue(
                mockGamificationResponse.success,
            );

            const { fetchProgress } = useGamificationStore.getState();
            await fetchProgress(true);

            expect(GamificationService.getProgress).toHaveBeenCalled();

            const state = useGamificationStore.getState();
            expect(state.cache?.totalPoints).toBe(150);
        });

        it("should not fetch if user is not authenticated", async () => {
            (useAuthStore.getState as jest.Mock).mockReturnValue({
                isAuthenticated: false,
            });

            const { fetchProgress } = useGamificationStore.getState();
            await fetchProgress();

            expect(GamificationService.getProgress).not.toHaveBeenCalled();

            const state = useGamificationStore.getState();
            expect(state.cache).toBeNull();
        });

        it("should not fetch if user_id is missing", async () => {
            (useUserStore.getState as jest.Mock).mockReturnValue({
                user: null,
            });

            const { fetchProgress } = useGamificationStore.getState();
            await fetchProgress();

            expect(GamificationService.getProgress).not.toHaveBeenCalled();
        });

        it("should handle API error and reset state", async () => {
            const apiError: any = new Error("Network error");
            apiError.response = { data: { message: "Server unavailable" } };
            (GamificationService.getProgress as jest.Mock).mockRejectedValue(apiError);

            const { fetchProgress } = useGamificationStore.getState();

            await expect(fetchProgress()).rejects.toThrow();

            const state = useGamificationStore.getState();
            expect(state.cache).toBeNull();
            expect(state.isLoading).toBe(false);
        });
    });

    describe("syncSteps", () => {
        it("should sync steps and update achievements", async () => {
            useGamificationStore.setState({
                cache: {
                    achievements: [],
                    totalPoints: 150,
                    levelInfo: mockGamificationResponse.success.data.data.levelInfo,
                    lastFetch: new Date().toISOString(),
                },
            });

            (GamificationService.syncSteps as jest.Mock).mockResolvedValue(
                mockGamificationResponse.syncStepsSuccess,
            );

            const { syncSteps } = useGamificationStore.getState();
            const newAchievements = await syncSteps(10000);

            expect(GamificationService.syncSteps).toHaveBeenCalledWith(10000);
            expect(newAchievements).toHaveLength(1);
            expect(newAchievements?.[0].achievementId).toBe("daily_steps_10k");

            const state = useGamificationStore.getState();
            expect(state.cache?.totalPoints).toBe(180);
            expect(state.cache?.levelInfo?.level).toBe(6);
            expect(state.isLoading).toBe(false);
        });

        it("should accumulate achievements across multiple syncs", async () => {
            useGamificationStore.setState({
                cache: {
                    achievements: [
                        mockGamificationResponse.success.data.data.achievements[0],
                    ],
                    totalPoints: 150,
                    levelInfo: mockGamificationResponse.success.data.data.levelInfo,
                    lastFetch: new Date().toISOString(),
                },
            });

            (GamificationService.syncSteps as jest.Mock).mockResolvedValue(
                mockGamificationResponse.syncStepsSuccess,
            );

            const { syncSteps } = useGamificationStore.getState();
            await syncSteps(10000);

            const state = useGamificationStore.getState();
            expect(state.cache?.achievements).toHaveLength(2);
            expect(state.cache?.achievements[0].achievementId).toBe("daily_steps_5k");
            expect(state.cache?.achievements[1].achievementId).toBe("daily_steps_10k");
        });

        it("should not sync if user is not authenticated", async () => {
            (useAuthStore.getState as jest.Mock).mockReturnValue({
                isAuthenticated: false,
            });

            const { syncSteps } = useGamificationStore.getState();
            const result = await syncSteps(5000);

            expect(GamificationService.syncSteps).not.toHaveBeenCalled();
            expect(result).toBeUndefined();
        });

        it("should not sync if user_id is missing", async () => {
            (useUserStore.getState as jest.Mock).mockReturnValue({
                user: null,
            });

            const { syncSteps } = useGamificationStore.getState();
            const result = await syncSteps(5000);

            expect(GamificationService.syncSteps).not.toHaveBeenCalled();
            expect(result).toBeUndefined();
        });

        it("should handle sync error and update error state", async () => {
            const apiError: any = new Error("Sync failed");
            apiError.response = { data: { message: "Invalid steps data" } };
            (GamificationService.syncSteps as jest.Mock).mockRejectedValue(apiError);

            const { syncSteps } = useGamificationStore.getState();

            await expect(syncSteps(5000)).rejects.toThrow();

            const state = useGamificationStore.getState();
            expect(state.error).toBe("Sync failed");
            expect(state.isLoading).toBe(false);
        });
    });

    describe("clearCache", () => {
        it("should clear all gamification data", () => {
            useGamificationStore.setState({
                cache: {
                    achievements: [],
                    totalPoints: 150,
                    levelInfo: mockGamificationResponse.success.data.data.levelInfo,
                    lastFetch: new Date().toISOString(),
                },
            });

            const { clearCache } = useGamificationStore.getState();
            clearCache();

            const state = useGamificationStore.getState();
            expect(state.cache).toBeNull();
            expect(state.error).toBeNull();
        });
    });

    describe("shouldRefetch", () => {
        it("should return true if cache is null", () => {
            useGamificationStore.setState({ cache: null });

            const { shouldRefetch } = useGamificationStore.getState();
            expect(shouldRefetch()).toBe(true);
        });

        it("should return true if cache is older than 1 hour", () => {
            const oldDate = new Date();
            oldDate.setHours(oldDate.getHours() - 2);

            useGamificationStore.setState({
                cache: {
                    achievements: [],
                    totalPoints: 100,
                    levelInfo: null,
                    lastFetch: oldDate.toISOString(),
                },
            });

            const { shouldRefetch } = useGamificationStore.getState();
            expect(shouldRefetch()).toBe(true);
        });

        it("should return false if cache is recent", () => {
            useGamificationStore.setState({
                cache: {
                    achievements: [],
                    totalPoints: 100,
                    levelInfo: null,
                    lastFetch: new Date().toISOString(),
                },
            });

            const { shouldRefetch } = useGamificationStore.getState();
            expect(shouldRefetch()).toBe(false);
        });
    });
});