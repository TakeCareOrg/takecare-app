import { renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";

jest.mock("react-native", () => ({
    Platform: {
        OS: "ios",
        select: jest.fn((obj) => obj.ios),
    },
}));

const mockHealthKit = {
    isHealthKitAvailable: jest.fn().mockResolvedValue(true),
    requestAuthorization: jest.fn().mockResolvedValue(true),
    getQuantityData: jest.fn().mockResolvedValue([
        {
            value: 5000,
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-01-01"),
        },
    ]),
    getSteps: jest.fn().mockResolvedValue(5000),
    getAggregatedQuantity: jest.fn().mockResolvedValue(5000),
    getCategoryData: jest.fn().mockResolvedValue([]),
    getWorkouts: jest.fn().mockResolvedValue([]),
};

const mockHealthConnect = {
    initialize: jest.fn().mockResolvedValue(1),
    readRecords: jest.fn().mockResolvedValue({
        records: [
            { count: 5000, startTime: "2024-01-01", endTime: "2024-01-01" },
        ],
    }),
};

jest.mock("@takecareorg/takecare-healthkit", () => ({
    HealthKitModule: mockHealthKit,
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

jest.mock("react-native-health-connect", () => mockHealthConnect);

describe("useHealthData Real Code", () => {
    const defaultParams = {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-02"),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockHealthKit.isHealthKitAvailable.mockResolvedValue(true);
        mockHealthKit.requestAuthorization.mockResolvedValue(true);
        mockHealthKit.getQuantityData.mockResolvedValue([
            {
                value: 5000,
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-01"),
            },
        ]);
        mockHealthKit.getSteps.mockResolvedValue(5000);
        mockHealthConnect.initialize.mockResolvedValue(1);
        mockHealthConnect.readRecords.mockResolvedValue({
            records: [
                { count: 5000, startTime: "2024-01-01", endTime: "2024-01-01" },
            ],
        });
    });

    describe("iOS Platform", () => {
        beforeEach(() => {
            (Platform.OS as any) = "ios";
        });

        it("should render without crashing on iOS", () => {
            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            expect(() => {
                renderHook(() => useHealthData(defaultParams));
            }).not.toThrow();
        });

        it("should accept Date objects", () => {
            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            expect(() => {
                renderHook(() =>
                    useHealthData({
                        startDate: new Date("2024-01-01"),
                        endDate: new Date("2024-01-02"),
                    }),
                );
            }).not.toThrow();
        });

        it("should accept string dates", () => {
            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;

            expect(() => {
                renderHook(() =>
                    useHealthData({
                        startDate: "2024-01-01",
                        endDate: "2024-01-02",
                    }),
                );
            }).not.toThrow();
        });

        it("should return health data structure", () => {
            const useHealthData =
                require("@hooks/health/use-health-data.ios").default;
            const { result } = renderHook(() => useHealthData(defaultParams));

            expect(result.current).toHaveProperty("steps");
            expect(result.current).toHaveProperty("flights");
            expect(result.current).toHaveProperty("distance");
            expect(result.current).toHaveProperty("activeEnergyBurned");
        });
    });

    describe("Android Platform", () => {
        beforeEach(() => {
            (Platform.OS as any) = "android";
        });

        it("should render without crashing on Android", () => {
            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            expect(() => {
                renderHook(() => useHealthData(defaultParams));
            }).not.toThrow();
        });

        it("should accept Date objects on Android", () => {
            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            expect(() => {
                renderHook(() =>
                    useHealthData({
                        startDate: new Date("2024-01-01"),
                        endDate: new Date("2024-01-02"),
                    }),
                );
            }).not.toThrow();
        });

        it("should accept string dates on Android", () => {
            const useHealthData =
                require("@hooks/health/use-health-data.android").default;

            expect(() => {
                renderHook(() =>
                    useHealthData({
                        startDate: "2024-01-01",
                        endDate: "2024-01-02",
                    }),
                );
            }).not.toThrow();
        });

        it("should return health data structure on Android", () => {
            const useHealthData =
                require("@hooks/health/use-health-data.android").default;
            const { result } = renderHook(() => useHealthData(defaultParams));

            expect(result.current).toHaveProperty("steps");
            expect(result.current).toHaveProperty("flights");
            expect(result.current).toHaveProperty("distance");
            expect(result.current).toHaveProperty("activeEnergyBurned");
        });
    });

    describe("Main hook", () => {
        it("should work on iOS platform", () => {
            (Platform.OS as any) = "ios";
            const useHealthData =
                require("@hooks/health/use-health-data").default;

            expect(() => {
                renderHook(() => useHealthData(defaultParams));
            }).not.toThrow();
        });

        it("should work on Android platform", () => {
            (Platform.OS as any) = "android";
            const useHealthData =
                require("@hooks/health/use-health-data").default;

            expect(() => {
                renderHook(() => useHealthData(defaultParams));
            }).not.toThrow();
        });
    });
});
