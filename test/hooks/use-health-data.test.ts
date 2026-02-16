import { renderHook, waitFor } from "@testing-library/react-native";
import { Platform } from "react-native";

import {
    mockHealthConnectModule,
    mockHealthData,
    mockHealthKitModule,
} from "../mocks/api-mocks";

jest.mock("react-native", () => ({
    Platform: {
        OS: "ios",
        select: jest.fn((obj) => obj.ios),
    },
}));

jest.mock("@takecareorg/takecare-healthkit", () => ({
    HealthKitModule: mockHealthKitModule,
    HealthKitQuantityType: {
        HEART_RATE: "HEART_RATE",
        STEPS: "STEPS",
        FLIGHTS_CLIMBED: "FLIGHTS_CLIMBED",
        DISTANCE_WALKING_RUNNING: "DISTANCE_WALKING_RUNNING",
        ACTIVE_ENERGY_BURNED: "ACTIVE_ENERGY_BURNED",
        APPLE_EXERCISE_TIME: "APPLE_EXERCISE_TIME",
    },
    HealthKitCategoryType: {
        SLEEP_ANALYSIS: "SLEEP_ANALYSIS",
    },
}));

jest.mock("react-native-health-connect", () => mockHealthConnectModule);

describe("useHealthData", () => {
    const defaultParams = {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-02"),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockHealthKitModule.isHealthKitAvailable.mockResolvedValue(true);
        mockHealthKitModule.requestAuthorization.mockResolvedValue(true);
        mockHealthKitModule.getQuantityData.mockImplementation(
            (type: string) => {
                switch (type) {
                    case "STEPS":
                        return Promise.resolve(mockHealthData.steps);
                    case "FLIGHTS_CLIMBED":
                        return Promise.resolve(mockHealthData.flights);
                    case "DISTANCE_WALKING_RUNNING":
                        return Promise.resolve(mockHealthData.distance);
                    case "ACTIVE_ENERGY_BURNED":
                        return Promise.resolve(
                            mockHealthData.activeEnergyBurned,
                        );
                    default:
                        return Promise.resolve([]);
                }
            },
        );
        mockHealthKitModule.getSteps.mockResolvedValue(
            mockHealthData.steps[0].value,
        );
        mockHealthConnectModule.initialize.mockResolvedValue(1);
        mockHealthConnectModule.readRecords.mockImplementation(
            (type: string) => {
                const recordMap: Record<string, any> = {
                    Steps: {
                        records: mockHealthData.steps.map((step) => ({
                            count: step.value,
                            startTime: step.startDate.toISOString(),
                            endTime: step.endDate.toISOString(),
                        })),
                    },
                };
                return Promise.resolve(recordMap[type] || { records: [] });
            },
        );
    });

    describe("iOS - Error Handling & Edge Cases", () => {
        beforeEach(() => {
            (Platform.OS as any) = "ios";
        });

        it("should handle HealthKit not available", async () => {
            mockHealthKitModule.isHealthKitAvailable.mockResolvedValue(false);
            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.steps).toBeNull();
                expect(result.current.heartRate.values).toEqual([]);
            });
        });

        it("should handle authorization denied", async () => {
            mockHealthKitModule.requestAuthorization.mockResolvedValue(false);
            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.steps).toBeNull();
            });
        });

        it("should handle empty heart rate data", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "HEART_RATE") return Promise.resolve([]);
                return Promise.resolve(mockHealthData.steps);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.heartRate.lastHeartRateValue).toBeNull();
                expect(result.current.heartRate.values).toEqual([]);
            });
        });

        it("should handle error fetching heart rate", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "HEART_RATE")
                    return Promise.reject(new Error("HealthKit error"));
                return Promise.resolve(mockHealthData.steps);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.heartRate.values).toEqual([]);
            });
        });

        it("should handle error fetching steps (legacy)", async () => {
            mockHealthKitModule.getSteps.mockRejectedValue(
                new Error("HealthKit error"),
            );
            mockHealthKitModule.getQuantityData.mockResolvedValue(
                mockHealthData.steps,
            );

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.stepCount).toBeDefined();
            });
        });

        it("should handle empty steps data", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "STEPS") return Promise.resolve([]);
                return Promise.resolve([]);
            });
            mockHealthKitModule.getSteps.mockResolvedValue(0);

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.stepCount).toBe(0);
            });
        });

        it("should handle error fetching steps", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "STEPS")
                    return Promise.reject(new Error("HealthKit error"));
                return Promise.resolve([]);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.steps).toBeNull();
            });
        });

        it("should handle empty flights data", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "FLIGHTS_CLIMBED") return Promise.resolve([]);
                return Promise.resolve(mockHealthData.steps);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.flights).toBeNull();
            });
        });

        it("should handle error fetching flights", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "FLIGHTS_CLIMBED")
                    return Promise.reject(new Error("HealthKit error"));
                return Promise.resolve([]);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.flights).toBeNull();
            });
        });

        it("should handle empty distance data", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "DISTANCE_WALKING_RUNNING")
                    return Promise.resolve([]);
                return Promise.resolve(mockHealthData.steps);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.distance).toBeNull();
            });
        });

        it("should handle error fetching distance", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "DISTANCE_WALKING_RUNNING")
                    return Promise.reject(new Error("HealthKit error"));
                return Promise.resolve([]);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.distance).toBeNull();
            });
        });

        it("should handle empty active energy data", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "ACTIVE_ENERGY_BURNED") return Promise.resolve([]);
                return Promise.resolve(mockHealthData.steps);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.activeEnergyBurned).toBeNull();
            });
        });

        it("should handle error fetching active energy", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "ACTIVE_ENERGY_BURNED")
                    return Promise.reject(new Error("HealthKit error"));
                return Promise.resolve([]);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.activeEnergyBurned).toBeNull();
            });
        });

        it("should handle empty sleep data", async () => {
            mockHealthKitModule.getCategoryData.mockResolvedValue([]);
            mockHealthKitModule.getQuantityData.mockResolvedValue(
                mockHealthData.steps,
            );

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.sleepAnalysis.totalSleepValue).toBeNull();
                expect(result.current.sleepAnalysis.sleepSteps).toEqual([]);
            });
        });

        it("should handle error fetching sleep data", async () => {
            mockHealthKitModule.getCategoryData.mockRejectedValue(
                new Error("HealthKit error"),
            );
            mockHealthKitModule.getQuantityData.mockResolvedValue([]);

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.sleepAnalysis.sleepSteps).toEqual([]);
            });
        });

        it("should handle empty active minutes data", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "APPLE_EXERCISE_TIME") return Promise.resolve([]);
                return Promise.resolve(mockHealthData.steps);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.activeMinutes).toBeNull();
            });
        });

        it("should handle error fetching active minutes", async () => {
            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "APPLE_EXERCISE_TIME")
                    return Promise.reject(new Error("HealthKit error"));
                return Promise.resolve([]);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.activeMinutes).toBeNull();
            });
        });

        it("should handle empty workouts data", async () => {
            mockHealthKitModule.getWorkouts.mockResolvedValue([]);
            mockHealthKitModule.getQuantityData.mockResolvedValue(
                mockHealthData.steps,
            );

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.workouts).toBeNull();
            });
        });

        it("should handle error fetching workouts", async () => {
            mockHealthKitModule.getWorkouts.mockRejectedValue(
                new Error("HealthKit error"),
            );
            mockHealthKitModule.getQuantityData.mockResolvedValue([]);

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.workouts).toBeNull();
            });
        });

        it("should correctly sort and process heart rate samples", async () => {
            const heartRateSamples = [
                {
                    value: 70,
                    startDate: new Date("2024-01-01T10:00:00Z"),
                    endDate: new Date("2024-01-01T10:00:00Z"),
                },
                {
                    value: 75,
                    startDate: new Date("2024-01-01T12:00:00Z"),
                    endDate: new Date("2024-01-01T12:00:00Z"),
                },
                {
                    value: 68,
                    startDate: new Date("2024-01-01T08:00:00Z"),
                    endDate: new Date("2024-01-01T08:00:00Z"),
                },
            ];

            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "HEART_RATE")
                    return Promise.resolve(heartRateSamples);
                return Promise.resolve([]);
            });

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.heartRate.lastHeartRateValue?.value).toBe(
                    75,
                ); // Most recent
                expect(result.current.heartRate.values).toHaveLength(3);
            });
        });

        it("should correctly aggregate step count", async () => {
            const stepSamples = [
                {
                    value: 1000,
                    startDate: new Date("2024-01-01T09:00:00Z"),
                    endDate: new Date("2024-01-01T10:00:00Z"),
                },
                {
                    value: 1500,
                    startDate: new Date("2024-01-01T10:00:00Z"),
                    endDate: new Date("2024-01-01T11:00:00Z"),
                },
                {
                    value: 2000,
                    startDate: new Date("2024-01-01T11:00:00Z"),
                    endDate: new Date("2024-01-01T12:00:00Z"),
                },
            ];

            mockHealthKitModule.getQuantityData.mockImplementation((type) => {
                if (type === "STEPS") return Promise.resolve(stepSamples);
                return Promise.resolve([]);
            });
            mockHealthKitModule.getAggregatedQuantity.mockResolvedValue(4500);

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.stepCount).toBe(4500);
                expect(result.current.steps).toHaveLength(3);
            });
        });

        it("should process sleep data with stages", async () => {
            const sleepSamples = [
                {
                    value: 1,
                    startDate: new Date("2024-01-01T22:00:00Z"),
                    endDate: new Date("2024-01-02T06:00:00Z"),
                },
                {
                    value: 2,
                    startDate: new Date("2024-01-02T06:00:00Z"),
                    endDate: new Date("2024-01-02T06:30:00Z"),
                },
            ];

            mockHealthKitModule.getCategoryData.mockResolvedValue(sleepSamples);
            mockHealthKitModule.getQuantityData.mockResolvedValue([]);

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(
                    result.current.sleepAnalysis.totalSleepValue,
                ).not.toBeNull();
                expect(result.current.sleepAnalysis.sleepSteps).toHaveLength(1);
            });
        });

        it("should process workout data with metadata", async () => {
            const workoutSamples = [
                {
                    workoutActivityType: 1,
                    workoutActivityName: "Running",
                    duration: 1800,
                    totalEnergyBurned: 250,
                    totalDistance: 5000,
                    startDate: new Date("2024-01-01T08:00:00Z"),
                    endDate: new Date("2024-01-01T08:30:00Z"),
                    metadata: { location: "outdoor" },
                },
            ];

            mockHealthKitModule.getWorkouts.mockResolvedValue(workoutSamples);
            mockHealthKitModule.getQuantityData.mockResolvedValue([]);

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.workouts).toHaveLength(1);
                expect(result.current.workouts?.[0].location).toBe("outdoor");
            });
        });

        it("should handle workout without metadata location", async () => {
            const workoutSamples = [
                {
                    workoutActivityType: 1,
                    workoutActivityName: "Running",
                    duration: 1800,
                    totalEnergyBurned: 250,
                    totalDistance: 5000,
                    startDate: new Date("2024-01-01T08:00:00Z"),
                    endDate: new Date("2024-01-01T08:30:00Z"),
                    metadata: {},
                },
            ];

            mockHealthKitModule.getWorkouts.mockResolvedValue(workoutSamples);
            mockHealthKitModule.getQuantityData.mockResolvedValue([]);

            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.workouts).toHaveLength(1);
                expect(result.current.workouts?.[0].location).toBe("outdoor"); // Default
            });
        });
    });

    describe("Android - Error Handling & Edge Cases", () => {
        beforeEach(() => {
            (Platform.OS as any) = "android";
        });

        it("should handle Health Connect not initialized", async () => {
            mockHealthConnectModule.initialize.mockResolvedValue(0);
            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.steps).toBeNull();
            });
        });

        it("should handle permission request error", async () => {
            mockHealthConnectModule.readRecords.mockResolvedValue({
                records: [],
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current).toBeDefined();
                expect(result.current.steps).toBeNull();
            });
        });

        it("should handle empty steps data", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "Steps") return Promise.resolve({ records: [] });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.steps).toEqual([]);
            });
        });

        it("should handle error fetching steps", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "Steps")
                    return Promise.reject(new Error("Health Connect error"));
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.steps).toEqual([]);
            });
        });

        it("should handle distance with inMeters property", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "Distance")
                    return Promise.resolve({
                        records: [
                            {
                                distance: { inMeters: 5000 },
                                startTime: "2024-01-01T08:00:00Z",
                                endTime: "2024-01-01T09:00:00Z",
                            },
                        ],
                    });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.distance).toHaveLength(1);
                expect(result.current.distance?.[0].value).toBe(5000);
            });
        });

        it("should handle distance as number", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "Distance")
                    return Promise.resolve({
                        records: [
                            {
                                distance: 5000,
                                startTime: "2024-01-01T08:00:00Z",
                                endTime: "2024-01-01T09:00:00Z",
                            },
                        ],
                    });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.distance).toHaveLength(1);
                expect(result.current.distance?.[0].value).toBe(5000);
            });
        });

        it("should handle empty distance data", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "Distance")
                    return Promise.resolve({ records: [] });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.distance).toEqual([]);
            });
        });

        it("should handle error fetching distance", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "Distance")
                    return Promise.reject(new Error("Health Connect error"));
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.distance).toEqual([]);
            });
        });

        it("should handle floors with floors field", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "FloorsClimbed")
                    return Promise.resolve({
                        records: [
                            {
                                floors: 10,
                                startTime: "2024-01-01T08:00:00Z",
                                endTime: "2024-01-01T09:00:00Z",
                            },
                        ],
                    });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.flights).toHaveLength(1);
                expect(result.current.flights?.[0].value).toBe(10);
            });
        });

        it("should handle floors with count field", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "FloorsClimbed")
                    return Promise.resolve({
                        records: [
                            {
                                count: 10,
                                startTime: "2024-01-01T08:00:00Z",
                                endTime: "2024-01-01T09:00:00Z",
                            },
                        ],
                    });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.flights).toHaveLength(1);
                expect(result.current.flights?.[0].value).toBe(10);
            });
        });

        it("should handle empty floors data", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "FloorsClimbed")
                    return Promise.resolve({ records: [] });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.flights).toEqual([]);
            });
        });

        it("should handle error fetching floors", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "FloorsClimbed")
                    return Promise.reject(new Error("Health Connect error"));
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.flights).toEqual([]);
            });
        });

        it("should handle energy with inKilocalories", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "ActiveCaloriesBurned")
                    return Promise.resolve({
                        records: [
                            {
                                energy: { inKilocalories: 250 },
                                startTime: "2024-01-01T08:00:00Z",
                                endTime: "2024-01-01T09:00:00Z",
                            },
                        ],
                    });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.activeEnergyBurned).toHaveLength(1);
                expect(result.current.activeEnergyBurned?.[0].value).toBe(
                    250000,
                );
            });
        });

        it("should handle energy with inCalories", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "ActiveCaloriesBurned")
                    return Promise.resolve({
                        records: [
                            {
                                energy: { inCalories: 250000 },
                                startTime: "2024-01-01T08:00:00Z",
                                endTime: "2024-01-01T09:00:00Z",
                            },
                        ],
                    });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.activeEnergyBurned).toHaveLength(1);
                expect(result.current.activeEnergyBurned?.[0].value).toBe(
                    250000,
                );
            });
        });

        it("should handle energy as number", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "ActiveCaloriesBurned")
                    return Promise.resolve({
                        records: [
                            {
                                energy: 250,
                                startTime: "2024-01-01T08:00:00Z",
                                endTime: "2024-01-01T09:00:00Z",
                            },
                        ],
                    });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.activeEnergyBurned).toHaveLength(1);
                expect(result.current.activeEnergyBurned?.[0].value).toBe(250);
            });
        });

        it("should handle empty energy data", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "ActiveCaloriesBurned")
                    return Promise.resolve({ records: [] });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.activeEnergyBurned).toEqual([]);
            });
        });

        it("should handle error fetching energy", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "ActiveCaloriesBurned")
                    return Promise.reject(new Error("Health Connect error"));
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.activeEnergyBurned).toEqual([]);
            });
        });

        it("should process heart rate samples correctly", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "HeartRate")
                    return Promise.resolve({
                        records: [
                            {
                                samples: [
                                    {
                                        beatsPerMinute: 70,
                                        time: "2024-01-01T08:00:00Z",
                                    },
                                    {
                                        beatsPerMinute: 75,
                                        time: "2024-01-01T09:00:00Z",
                                    },
                                ],
                            },
                        ],
                    });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.heartRate.values).toHaveLength(2);
                expect(result.current.heartRate.lastHeartRateValue?.value).toBe(
                    75,
                );
            });
        });

        it("should handle empty heart rate data", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "HeartRate")
                    return Promise.resolve({ records: [] });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.heartRate.values).toEqual([]);
                expect(result.current.heartRate.lastHeartRateValue).toBeNull();
            });
        });

        it("should handle error fetching heart rate", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "HeartRate")
                    return Promise.reject(new Error("Health Connect error"));
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.heartRate.values).toEqual([]);
            });
        });

        it("should process sleep sessions with stages", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "SleepSession")
                    return Promise.resolve({
                        records: [
                            {
                                startTime: "2024-01-01T22:00:00Z",
                                endTime: "2024-01-02T06:00:00Z",
                                stages: [
                                    {
                                        stage: 5, // deep sleep
                                        startTime: "2024-01-01T22:00:00Z",
                                        endTime: "2024-01-01T23:00:00Z",
                                    },
                                    {
                                        stage: 6, // REM
                                        startTime: "2024-01-01T23:00:00Z",
                                        endTime: "2024-01-02T06:00:00Z",
                                    },
                                ],
                            },
                        ],
                    });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(
                    result.current.sleepAnalysis.totalSleepValue,
                ).not.toBeNull();
                expect(result.current.sleepAnalysis.sleepSteps).toHaveLength(1);
                expect(
                    result.current.sleepAnalysis.sleepSteps[0].stages,
                ).toHaveLength(2);
            });
        });

        it("should process sleep sessions without stages", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "SleepSession")
                    return Promise.resolve({
                        records: [
                            {
                                startTime: "2024-01-01T22:00:00Z",
                                endTime: "2024-01-02T06:00:00Z",
                            },
                        ],
                    });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(
                    result.current.sleepAnalysis.totalSleepValue,
                ).not.toBeNull();
                expect(result.current.sleepAnalysis.sleepSteps).toHaveLength(1);
                expect(
                    result.current.sleepAnalysis.sleepSteps[0].stages,
                ).toBeUndefined();
            });
        });

        it("should handle empty sleep data", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "SleepSession")
                    return Promise.resolve({ records: [] });
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.sleepAnalysis.totalSleepValue).toBeNull();
                expect(result.current.sleepAnalysis.sleepSteps).toEqual([]);
            });
        });

        it("should handle error fetching sleep", async () => {
            mockHealthConnectModule.readRecords.mockImplementation((type) => {
                if (type === "SleepSession")
                    return Promise.reject(new Error("Health Connect error"));
                return Promise.resolve({ records: [] });
            });

            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            const { result } = renderHook(() => useHealthData(defaultParams));

            await waitFor(() => {
                expect(result.current.sleepAnalysis.sleepSteps).toEqual([]);
            });
        });
    });

    describe("fetchHealthDataOnce - iOS", () => {
        beforeEach(() => {
            (Platform.OS as any) = "ios";
        });

        it("should fetch all health data types", async () => {
            mockHealthKitModule.getQuantityData.mockResolvedValue([
                {
                    value: 100,
                    startDate: new Date("2024-01-01T10:00:00Z"),
                    endDate: new Date("2024-01-01T10:00:00Z"),
                },
            ]);
            mockHealthKitModule.getAggregatedQuantity.mockResolvedValue(8500);
            mockHealthKitModule.getCategoryData.mockResolvedValue([]);
            mockHealthKitModule.getWorkouts.mockResolvedValue([]);

            const {
                fetchHealthDataOnce,
            } = require("@hooks/health/use-health-data.ios");

            const result = await fetchHealthDataOnce({
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
            });

            expect(result.steps).toBeDefined();
            expect(result.heartRate).toBeDefined();
            expect(result.distance).toBeDefined();
            expect(result.activeEnergyBurned).toBeDefined();
        });

        it("should handle errors gracefully in fetchHealthDataOnce", async () => {
            mockHealthKitModule.getQuantityData.mockRejectedValue(
                new Error("HealthKit error"),
            );

            const {
                fetchHealthDataOnce,
            } = require("@hooks/health/use-health-data.ios");

            const result = await fetchHealthDataOnce({
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
            });

            expect(result).toBeDefined();
            expect(result.steps).toBeNull();
        });
    });

    describe("fetchHealthDataOnce - Android", () => {
        beforeEach(() => {
            (Platform.OS as any) = "android";
        });

        it("should fetch all health data types", async () => {
            mockHealthConnectModule.readRecords.mockResolvedValue({
                records: [
                    {
                        count: 100,
                        startTime: "2024-01-01T10:00:00Z",
                        endTime: "2024-01-01T11:00:00Z",
                    },
                ],
            });

            const {
                fetchHealthDataOnce,
            } = require("@hooks/health/use-health-data.android");

            const result = await fetchHealthDataOnce({
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
            });

            expect(result.steps).toBeDefined();
            expect(result.heartRate).toBeDefined();
        });

        it("should handle errors gracefully in fetchHealthDataOnce", async () => {
            mockHealthConnectModule.initialize.mockResolvedValue(0);

            const {
                fetchHealthDataOnce,
            } = require("@hooks/health/use-health-data.android");

            const result = await fetchHealthDataOnce({
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
            });

            expect(result).toBeDefined();
            expect(result.steps).toBeNull();
        });
    });
});
