import { renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";
import {
    mockHealthKitModule,
    mockHealthConnectModule,
    mockHealthData,
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

describe("useHealthData Real Code", () => {
    const defaultParams = {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-02"),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockHealthKitModule.isHealthKitAvailable.mockResolvedValue(true);
        mockHealthKitModule.requestAuthorization.mockResolvedValue(true);
        mockHealthKitModule.getQuantityData.mockImplementation((type: string) => {
            switch (type) {
                case "STEPS":
                    return Promise.resolve(mockHealthData.steps);
                case "FLIGHTS_CLIMBED":
                    return Promise.resolve(mockHealthData.flights);
                case "DISTANCE_WALKING_RUNNING":
                    return Promise.resolve(mockHealthData.distance);
                case "ACTIVE_ENERGY_BURNED":
                    return Promise.resolve(mockHealthData.activeEnergyBurned);
                default:
                    return Promise.resolve([]);
            }
        });
        mockHealthKitModule.getSteps.mockResolvedValue(mockHealthData.steps[0].value);
        mockHealthConnectModule.initialize.mockResolvedValue(1);
        mockHealthConnectModule.readRecords.mockImplementation((type: string) => {
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
