import { useHealthDataStore } from "@stores/health-data";

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

const makeCache = ({ data: dataOverrides, ...rest }: Record<string, unknown> = {}) => ({
    data: {
        steps: [{ value: 1000, startDate: "2024-01-01", endDate: "2024-01-01" }],
        distance: [{ value: 800, startDate: "2024-01-01", endDate: "2024-01-01" }],
        flights: [{ value: 2, startDate: "2024-01-01", endDate: "2024-01-01" }],
        activeEnergyBurned: [{ value: 300, startDate: "2024-01-01", endDate: "2024-01-01" }],
        heartRate: {
            lastHeartRateValue: null,
            values: [{ value: 70, startDate: "2024-01-01", endDate: "2024-01-01" }],
        },
        sleepAnalysis: null,
        ...((dataOverrides as object) ?? {}),
    },
    lastFetch: new Date().toISOString(),
    dateRange: {
        startDate: "2024-01-01",
        endDate: "2024-01-01",
    },
    ...rest,
});

describe("Health Data Store", () => {
    beforeEach(() => {
        useHealthDataStore.setState({
            todayCache: null,
            historicalCache: null,
            isLoading: false,
            error: null,
        });
    });

    describe("setTodayCache", () => {
        it("should set today cache", () => {
            const cache = makeCache();

            useHealthDataStore.getState().setTodayCache(cache as any);

            expect(useHealthDataStore.getState().todayCache).toEqual(cache);
        });
    });

    describe("setHistoricalCache", () => {
        it("should set historical cache", () => {
            const cache = makeCache();

            useHealthDataStore.getState().setHistoricalCache(cache as any);

            expect(useHealthDataStore.getState().historicalCache).toEqual(cache);
        });
    });

    describe("clearCache", () => {
        it("should reset both caches and error to null", () => {
            useHealthDataStore.setState({
                todayCache: makeCache() as any,
                historicalCache: makeCache() as any,
                error: "some error",
            });

            useHealthDataStore.getState().clearCache();

            const state = useHealthDataStore.getState();
            expect(state.todayCache).toBeNull();
            expect(state.historicalCache).toBeNull();
            expect(state.error).toBeNull();
        });

        it("should handle clearing when already null", () => {
            expect(() => useHealthDataStore.getState().clearCache()).not.toThrow();
        });
    });

    describe("updateHealthData", () => {
        it("should update today cache data when cache exists", () => {
            const cache = makeCache();
            useHealthDataStore.setState({ todayCache: cache as any });

            useHealthDataStore
                .getState()
                .updateHealthData({ steps: 5000 } as any);

            expect(useHealthDataStore.getState().todayCache?.data.steps).toBe(
                5000,
            );
            expect(
                useHealthDataStore.getState().todayCache?.data.distance,
            ).toEqual([{ value: 800, startDate: "2024-01-01", endDate: "2024-01-01" }]);
        });

        it("should update lastFetch timestamp when updating data", () => {
            const oldDate = new Date(
                Date.now() - 60 * 60 * 1000,
            ).toISOString();
            const cache = makeCache({ lastFetch: oldDate });
            useHealthDataStore.setState({ todayCache: cache as any });

            useHealthDataStore
                .getState()
                .updateHealthData({ steps: 5000 } as any);

            expect(
                useHealthDataStore.getState().todayCache?.lastFetch,
            ).not.toBe(oldDate);
        });

        it("should do nothing when todayCache is null", () => {
            useHealthDataStore.setState({ todayCache: null });

            expect(() =>
                useHealthDataStore
                    .getState()
                    .updateHealthData({ steps: 5000 } as any),
            ).not.toThrow();

            expect(useHealthDataStore.getState().todayCache).toBeNull();
        });
    });

    describe("shouldRefetchToday", () => {
        it("should return true when todayCache is null", () => {
            useHealthDataStore.setState({ todayCache: null });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchToday("2024-01-01", "2024-01-01");

            expect(result).toBe(true);
        });

        it("should return true when all data fields are null (empty cache)", () => {
            const cache = makeCache({
                data: {
                    steps: null,
                    distance: null,
                    flights: null,
                    activeEnergyBurned: null,
                },
            });
            useHealthDataStore.setState({ todayCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchToday("2024-01-01", "2024-01-01");

            expect(result).toBe(true);
        });

        it("should return false when cache is fresh and date range matches", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
            });
            useHealthDataStore.setState({ todayCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchToday("2024-01-01", "2024-01-01");

            expect(result).toBe(false);
        });

        it("should return true when last fetch was more than 1 hour ago", () => {
            const oldDate = new Date(
                Date.now() - 61 * 60 * 1000,
            ).toISOString();
            const cache = makeCache({
                lastFetch: oldDate,
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
            });
            useHealthDataStore.setState({ todayCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchToday("2024-01-01", "2024-01-01");

            expect(result).toBe(true);
        });

        it("should return true when startDate changed", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
            });
            useHealthDataStore.setState({ todayCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchToday("2024-01-02", "2024-01-01");

            expect(result).toBe(true);
        });

        it("should return true when endDate changed", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
            });
            useHealthDataStore.setState({ todayCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchToday("2024-01-01", "2024-01-02");

            expect(result).toBe(true);
        });

        it("should return false when only some data fields are null", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                data: {
                    steps: null,
                    distance: [{ value: 800, startDate: "2024-01-01", endDate: "2024-01-01" }],
                    flights: null,
                    activeEnergyBurned: null,
                },
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
            });
            useHealthDataStore.setState({ todayCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchToday("2024-01-01", "2024-01-01");

            expect(result).toBe(false);
        });
    });

    describe("shouldRefetchHistorical", () => {
        it("should return true when historicalCache is null", () => {
            useHealthDataStore.setState({ historicalCache: null });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-01", "2024-01-01");

            expect(result).toBe(true);
        });

        it("should return false when cache is fresh and date range matches", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
                data: {
                    sleepAnalysis: null,
                },
            });
            useHealthDataStore.setState({ historicalCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-01", "2024-01-01");

            expect(result).toBe(false);
        });

        it("should return true when sleep steps have old format (no stages)", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
                data: {
                    sleepAnalysis: {
                        sleepSteps: [
                            {
                                endDate: new Date().toISOString(),
                                duration: 3600,
                                // no `stages` key → old format
                            },
                        ],
                    },
                },
            });
            useHealthDataStore.setState({ historicalCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-01", "2024-01-01");

            expect(result).toBe(true);
        });

        it("should return false when sleep steps have new format (with stages)", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
                data: {
                    sleepAnalysis: {
                        sleepSteps: [
                            {
                                endDate: new Date().toISOString(),
                                duration: 3600,
                                stages: [],
                            },
                        ],
                    },
                },
            });
            useHealthDataStore.setState({ historicalCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-01", "2024-01-01");

            expect(result).toBe(false);
        });

        it("should return true when a sleep step has duration less than 60", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
                data: {
                    sleepAnalysis: {
                        sleepSteps: [
                            {
                                endDate: new Date().toISOString(),
                                duration: 30,
                                stages: [],
                            },
                        ],
                    },
                },
            });
            useHealthDataStore.setState({ historicalCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-01", "2024-01-01");

            expect(result).toBe(true);
        });

        it("should return true when a sleep step has undefined duration (defaults to 0 < 60)", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
                data: {
                    sleepAnalysis: {
                        sleepSteps: [
                            {
                                endDate: new Date().toISOString(),
                                duration: undefined,
                                stages: [],
                            },
                        ],
                    },
                },
            });
            useHealthDataStore.setState({ historicalCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-01", "2024-01-01");

            expect(result).toBe(true);
        });

        it("should return true when a sleep step is older than 90 days", () => {
            const oldDate = new Date(
                Date.now() - 91 * 24 * 60 * 60 * 1000,
            ).toISOString();
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
                data: {
                    sleepAnalysis: {
                        sleepSteps: [
                            {
                                endDate: oldDate,
                                duration: 3600,
                                stages: [],
                            },
                        ],
                    },
                },
            });
            useHealthDataStore.setState({ historicalCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-01", "2024-01-01");

            expect(result).toBe(true);
        });

        it("should return true when last fetch was more than 24 hours ago", () => {
            const oldDate = new Date(
                Date.now() - 25 * 60 * 60 * 1000,
            ).toISOString();
            const cache = makeCache({
                lastFetch: oldDate,
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
                data: { sleepAnalysis: null },
            });
            useHealthDataStore.setState({ historicalCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-01", "2024-01-01");

            expect(result).toBe(true);
        });

        it("should return true when startDate changed", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-07" },
                data: { sleepAnalysis: null },
            });
            useHealthDataStore.setState({ historicalCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-02", "2024-01-07");

            expect(result).toBe(true);
        });

        it("should return true when endDate changed", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-07" },
                data: { sleepAnalysis: null },
            });
            useHealthDataStore.setState({ historicalCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-01", "2024-01-08");

            expect(result).toBe(true);
        });

        it("should return false when sleepSteps is empty array", () => {
            const cache = makeCache({
                lastFetch: new Date().toISOString(),
                dateRange: { startDate: "2024-01-01", endDate: "2024-01-01" },
                data: {
                    sleepAnalysis: {
                        sleepSteps: [],
                    },
                },
            });
            useHealthDataStore.setState({ historicalCache: cache as any });

            const result = useHealthDataStore
                .getState()
                .shouldRefetchHistorical("2024-01-01", "2024-01-01");

            expect(result).toBe(false);
        });
    });
});
