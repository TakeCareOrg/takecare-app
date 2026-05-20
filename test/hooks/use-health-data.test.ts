import { Platform } from "react-native";

import { mockHealthKitModule } from "../mocks/api-mocks";

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

describe("fetchHealthData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHealthKitModule.isHealthKitAvailable.mockResolvedValue(true);
        mockHealthKitModule.requestAuthorization.mockResolvedValue(true);
    });

    describe("fetchHealthData - iOS", () => {
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
                fetchHealthData,
            } = require("@app/services/health/fetch-health-data.ios");

            const result = await fetchHealthData({
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
            });

            expect(result.steps).toBeDefined();
            expect(result.heartRate).toBeDefined();
            expect(result.distance).toBeDefined();
            expect(result.activeEnergyBurned).toBeDefined();
        });

        it("should handle errors gracefully in fetchHealthData", async () => {
            mockHealthKitModule.getQuantityData.mockRejectedValue(
                new Error("HealthKit error"),
            );

            const {
                fetchHealthData,
            } = require("@app/services/health/fetch-health-data.ios");

            const result = await fetchHealthData({
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
            });

            expect(result).toBeDefined();
            expect(result.steps).toBeNull();
        });
    });

    describe("fetchHealthData - Android", () => {
        beforeEach(() => {
            (Platform.OS as any) = "android";
        });

        it("should fetch all health data types via the Nitro module", async () => {
            mockHealthKitModule.getQuantityData.mockResolvedValue([
                {
                    value: 100,
                    startDate: new Date("2024-01-01T10:00:00Z"),
                    endDate: new Date("2024-01-01T11:00:00Z"),
                },
            ]);
            mockHealthKitModule.getAggregatedQuantity.mockResolvedValue(100);

            const {
                fetchHealthData,
            } = require("@app/services/health/fetch-health-data.android");

            const result = await fetchHealthData({
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
            });

            expect(result.steps).toBeDefined();
            expect(result.heartRate).toBeDefined();
        });

        it("returns an empty envelope when Health Connect is unavailable", async () => {
            mockHealthKitModule.isHealthKitAvailable.mockResolvedValueOnce(false);

            const {
                fetchHealthData,
            } = require("@app/services/health/fetch-health-data.android");

            const result = await fetchHealthData({
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
            });

            expect(result).toBeDefined();
            expect(result.steps).toBeNull();
        });
    });
});
