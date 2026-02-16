import { Platform } from "react-native";

import {
    mockHealthConnectModule,
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

describe("fetchHealthDataOnce", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHealthKitModule.isHealthKitAvailable.mockResolvedValue(true);
        mockHealthKitModule.requestAuthorization.mockResolvedValue(true);
        mockHealthConnectModule.initialize.mockResolvedValue(1);
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
