import { syncHealthData } from "@app/services/health/health-sync";
import { useHealthDataStore } from "@stores/health-data";
import { useGamificationStore } from "@stores/gamification";
import { useAuthStore } from "@stores/auth";

jest.mock("@react-native-async-storage/async-storage", () => ({
    __esModule: true,
    default: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    },
}));

jest.mock("@stores/health-data");
jest.mock("@stores/gamification");
jest.mock("@stores/auth");
jest.mock("react-native", () => ({
    Platform: { OS: "ios" },
    AppState: {
        addEventListener: jest.fn(),
        currentState: "active",
    },
}));

const mockFetchHealthData = jest.fn();
const mockRequestHealthPermissions = jest.fn().mockResolvedValue(true);
jest.mock("@services/health/health-data-fetcher.ios", () => ({
    fetchHealthDataOnce: mockFetchHealthData,
    requestHealthPermissions: mockRequestHealthPermissions,
}));

describe("Health + Gamification Sync Integration", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useAuthStore.getState as jest.Mock).mockReturnValue({
            isAuthenticated: true,
        });
    });

    it("should sync health data and trigger gamification with steps", async () => {
        const mockSyncSteps = jest.fn().mockResolvedValue([]);
        const mockSetTodayCache = jest.fn();

        (useHealthDataStore.getState as jest.Mock).mockReturnValue({
            shouldRefetchToday: jest.fn().mockReturnValue(true),
            shouldRefetchHistorical: jest.fn().mockReturnValue(false),
            setTodayCache: mockSetTodayCache,
            setHistoricalCache: jest.fn(),
        });

        (useGamificationStore.getState as jest.Mock).mockReturnValue({
            syncSteps: mockSyncSteps,
        });

        mockFetchHealthData.mockResolvedValueOnce({
            steps: 8500,
            distance: 6.5,
            flights: 10,
            activeEnergyBurned: 350,
        });

        await syncHealthData();

        expect(mockSetTodayCache).toHaveBeenCalled();
        expect(mockSyncSteps).toHaveBeenCalledWith(8500);
    });

    it("should not sync gamification if steps are null", async () => {
        const mockSyncSteps = jest.fn();

        (useHealthDataStore.getState as jest.Mock).mockReturnValue({
            shouldRefetchToday: jest.fn().mockReturnValue(true),
            shouldRefetchHistorical: jest.fn().mockReturnValue(false),
            setTodayCache: jest.fn(),
            setHistoricalCache: jest.fn(),
        });

        (useGamificationStore.getState as jest.Mock).mockReturnValue({
            syncSteps: mockSyncSteps,
        });

        mockFetchHealthData.mockResolvedValueOnce({
            steps: null,
            distance: null,
            flights: null,
            activeEnergyBurned: null,
        });

        await syncHealthData();

        expect(mockSyncSteps).not.toHaveBeenCalled();
    });

    it("should not sync gamification if steps are 0", async () => {
        const mockSyncSteps = jest.fn();

        (useHealthDataStore.getState as jest.Mock).mockReturnValue({
            shouldRefetchToday: jest.fn().mockReturnValue(true),
            shouldRefetchHistorical: jest.fn().mockReturnValue(false),
            setTodayCache: jest.fn(),
            setHistoricalCache: jest.fn(),
        });

        (useGamificationStore.getState as jest.Mock).mockReturnValue({
            syncSteps: mockSyncSteps,
        });

        mockFetchHealthData.mockResolvedValueOnce({
            steps: 0,
            distance: 5.2,
            flights: 8,
            activeEnergyBurned: 280,
        });

        await syncHealthData();

        expect(mockSyncSteps).not.toHaveBeenCalled();
    });

    it("should continue health sync even if gamification fails", async () => {
        const mockSyncSteps = jest
            .fn()
            .mockRejectedValue(new Error("Gamification API error"));
        const mockSetTodayCache = jest.fn();

        (useHealthDataStore.getState as jest.Mock).mockReturnValue({
            shouldRefetchToday: jest.fn().mockReturnValue(true),
            shouldRefetchHistorical: jest.fn().mockReturnValue(false),
            setTodayCache: mockSetTodayCache,
            setHistoricalCache: jest.fn(),
        });

        (useGamificationStore.getState as jest.Mock).mockReturnValue({
            syncSteps: mockSyncSteps,
        });

        mockFetchHealthData.mockResolvedValueOnce({
            steps: 7000,
            distance: 5.2,
            flights: 8,
            activeEnergyBurned: 280,
        });

        await syncHealthData();

        expect(mockSetTodayCache).toHaveBeenCalled();
        expect(mockSyncSteps).toHaveBeenCalled();
    });

    it("should handle multiple health syncs accumulating steps", async () => {
        const mockSyncSteps = jest.fn().mockResolvedValue([]);
        const mockSetTodayCache = jest.fn();

        (useHealthDataStore.getState as jest.Mock).mockReturnValue({
            shouldRefetchToday: jest.fn().mockReturnValue(true),
            shouldRefetchHistorical: jest.fn().mockReturnValue(false),
            setTodayCache: mockSetTodayCache,
            setHistoricalCache: jest.fn(),
        });

        (useGamificationStore.getState as jest.Mock).mockReturnValue({
            syncSteps: mockSyncSteps,
        });

        mockFetchHealthData.mockResolvedValueOnce({
            steps: 3000,
            distance: 2.0,
            flights: 5,
            activeEnergyBurned: 150,
        });

        await syncHealthData();

        expect(mockSyncSteps).toHaveBeenCalledWith(3000);

        mockSyncSteps.mockClear();

        mockFetchHealthData.mockResolvedValueOnce({
            steps: 8000,
            distance: 6.0,
            flights: 12,
            activeEnergyBurned: 320,
        });

        await syncHealthData();

        expect(mockSyncSteps).toHaveBeenCalledWith(8000);
    });

    it("should not sync if user is not authenticated", async () => {
        (useAuthStore.getState as jest.Mock).mockReturnValue({
            isAuthenticated: false,
        });

        const mockSyncSteps = jest.fn();
        const mockSetTodayCache = jest.fn();

        (useHealthDataStore.getState as jest.Mock).mockReturnValue({
            shouldRefetchToday: jest.fn().mockReturnValue(true),
            shouldRefetchHistorical: jest.fn().mockReturnValue(false),
            setTodayCache: mockSetTodayCache,
            setHistoricalCache: jest.fn(),
        });

        (useGamificationStore.getState as jest.Mock).mockReturnValue({
            syncSteps: mockSyncSteps,
        });

        await syncHealthData();

        expect(mockFetchHealthData).not.toHaveBeenCalled();
        expect(mockSetTodayCache).not.toHaveBeenCalled();
        expect(mockSyncSteps).not.toHaveBeenCalled();
    });

    it("should sync both today and historical data on first launch", async () => {
        const mockSyncSteps = jest.fn().mockResolvedValue([]);
        const mockSetTodayCache = jest.fn();
        const mockSetHistoricalCache = jest.fn();

        (useHealthDataStore.getState as jest.Mock).mockReturnValue({
            shouldRefetchToday: jest.fn().mockReturnValue(true),
            shouldRefetchHistorical: jest.fn().mockReturnValue(true),
            setTodayCache: mockSetTodayCache,
            setHistoricalCache: mockSetHistoricalCache,
        });

        (useGamificationStore.getState as jest.Mock).mockReturnValue({
            syncSteps: mockSyncSteps,
        });

        mockFetchHealthData.mockResolvedValueOnce({
            steps: 5000,
            distance: 4.0,
            flights: 8,
            activeEnergyBurned: 200,
        });

        mockFetchHealthData.mockResolvedValueOnce({
            steps: 3000,
            distance: 2.5,
            flights: 5,
            activeEnergyBurned: 120,
        });

        await syncHealthData();

        expect(mockFetchHealthData).toHaveBeenCalledTimes(2);
        expect(mockSetTodayCache).toHaveBeenCalled();
        expect(mockSetHistoricalCache).toHaveBeenCalled();
        expect(mockSyncSteps).toHaveBeenCalledWith(5000);
    });
});
