export const mockGroqTranscription = {
    success: {
        text: "This is a test transcription",
    },
    noSpeech: {
        text: "",
    },
    error: {
        message: "Transcription failed",
    },
};

export const mockChatResponse = {
    success: {
        status: 200,
        data: {
            chat: {
                content: "This is a test response from the AI",
            },
        },
    },
    insufficientTokens: {
        status: 403,
        data: {
            message: "INSUFFICIENT_CHAT_TOKENS",
        },
    },
    error: {
        status: 500,
        data: {
            message: "Internal server error",
        },
    },
};

export const mockAuthResponse = {
    success: {
        status: 200,
        data: {
            token: "mock-jwt-token-12345",
        },
    },
    invalidCredentials: {
        status: 401,
        data: {
            message: "Invalid credentials",
        },
    },
    error: {
        status: 500,
        data: {
            message: "Server error",
        },
    },
};

export const mockUserDataResponse = {
    success: {
        status: 200,
        data: {
            user: {
                id: "123",
                email: "test@example.com",
                health: {
                    age: 30,
                    gender: "male",
                },
            },
        },
    },
    unauthorized: {
        status: 401,
        data: {
            message: "Unauthorized",
        },
    },
};

export const mockHealthData = {
    steps: [
        {
            value: 5000,
            startDate: new Date("2024-01-01T00:00:00Z"),
            endDate: new Date("2024-01-01T23:59:59Z"),
        },
        {
            value: 7500,
            startDate: new Date("2024-01-02T00:00:00Z"),
            endDate: new Date("2024-01-02T23:59:59Z"),
        },
    ],
    flights: [
        {
            value: 10,
            startDate: new Date("2024-01-01T00:00:00Z"),
            endDate: new Date("2024-01-01T23:59:59Z"),
        },
        {
            value: 15,
            startDate: new Date("2024-01-02T00:00:00Z"),
            endDate: new Date("2024-01-02T23:59:59Z"),
        },
    ],
    distance: [
        {
            value: 3500,
            startDate: new Date("2024-01-01T00:00:00Z"),
            endDate: new Date("2024-01-01T23:59:59Z"),
        },
        {
            value: 5000,
            startDate: new Date("2024-01-02T00:00:00Z"),
            endDate: new Date("2024-01-02T23:59:59Z"),
        },
    ],
    activeEnergyBurned: [
        {
            value: 250,
            startDate: new Date("2024-01-01T00:00:00Z"),
            endDate: new Date("2024-01-01T23:59:59Z"),
        },
        {
            value: 400,
            startDate: new Date("2024-01-02T00:00:00Z"),
            endDate: new Date("2024-01-02T23:59:59Z"),
        },
    ],
};

export const mockHealthKitModule = {
    isHealthKitAvailable: jest.fn().mockResolvedValue(true),
    requestAuthorization: jest.fn().mockResolvedValue(true),
    getQuantityData: jest.fn((type: string) => {
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
    }),
    getSteps: jest.fn().mockResolvedValue(5000),
    getAggregatedQuantity: jest.fn().mockResolvedValue(5000),
    getCategoryData: jest.fn().mockResolvedValue([]),
    getWorkouts: jest.fn().mockResolvedValue([]),
};

export const mockHealthConnectModule = {
    initialize: jest.fn().mockResolvedValue(1),
    readRecords: jest.fn((type: string) => {
        const recordMap: Record<string, any> = {
            Steps: {
                records: mockHealthData.steps.map((step) => ({
                    count: step.value,
                    startTime: step.startDate.toISOString(),
                    endTime: step.endDate.toISOString(),
                })),
            },
            FloorsClimbed: {
                records: mockHealthData.flights.map((flight) => ({
                    floors: flight.value,
                    startTime: flight.startDate.toISOString(),
                    endTime: flight.endDate.toISOString(),
                })),
            },
            Distance: {
                records: mockHealthData.distance.map((dist) => ({
                    distance: dist.value,
                    startTime: dist.startDate.toISOString(),
                    endTime: dist.endDate.toISOString(),
                })),
            },
            ActiveCaloriesBurned: {
                records: mockHealthData.activeEnergyBurned.map((energy) => ({
                    energy: energy.value,
                    startTime: energy.startDate.toISOString(),
                    endTime: energy.endDate.toISOString(),
                })),
            },
        };
        return Promise.resolve(recordMap[type] || { records: [] });
    }),
};

export const setupFetchMock = (response: any, shouldFail = false) => {
    (global.fetch as any).mockImplementation(() => {
        if (shouldFail) {
            return Promise.reject(new Error("Network error"));
        }
        return Promise.resolve({
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            json: () => Promise.resolve(response.data),
            text: () => Promise.resolve(JSON.stringify(response.data)),
        });
    });
};

export const resetFetchMock = () => {
    (global.fetch as any).mockReset();
};
