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
            accessToken: "mock-access-token-12345",
            refreshToken: "mock-refresh-token-12345",
        },
    },
    successRegister: {
        status: 201,
        data: {
            accessToken: "mock-access-token-12345",
            refreshToken: "mock-refresh-token-12345",
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
    getHeartRate: jest.fn().mockResolvedValue(72),
    getAggregatedQuantity: jest.fn().mockResolvedValue(5000),
    getCategoryData: jest.fn().mockResolvedValue([]),
    getWorkouts: jest.fn().mockResolvedValue([]),
    getRealtimeData: jest.fn().mockResolvedValue({}),
    getHealthDataForTimeRange: jest.fn().mockResolvedValue({
        steps: 5000,
        heartRate: 72,
        activeEnergy: 300,
        distance: 4000,
        sleepAnalysis: "ASLEEP",
        quantities: null,
        categories: null,
    }),
    getHealthData: jest.fn().mockResolvedValue({
        steps: null,
        heartRate: null,
        activeEnergy: null,
        distance: null,
        sleepAnalysis: null,
        quantities: null,
        categories: null,
    }),
    checkAuthorizationStatus: jest.fn().mockResolvedValue("sharingAuthorized"),
    clearCache: jest.fn().mockResolvedValue(undefined),
    writeQuantityData: jest.fn().mockResolvedValue(true),
    writeCategoryData: jest.fn().mockResolvedValue(true),
    observeQuantityChanges: jest.fn().mockResolvedValue("sub-q"),
    observeCategoryChanges: jest.fn().mockResolvedValue("sub-c"),
    removeObserver: jest.fn().mockResolvedValue(undefined),
    removeAllObservers: jest.fn().mockResolvedValue(undefined),
    registerBackgroundSync: jest.fn().mockResolvedValue(undefined),
    unregisterBackgroundSync: jest.fn().mockResolvedValue(undefined),
    isBackgroundSyncRegistered: jest.fn().mockResolvedValue(false),
    seedTestHealthData: jest.fn().mockResolvedValue(undefined),
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

export const mockImageAnalysisResponse = {
    togetherSuccess: {
        choices: [
            {
                message: {
                    content:
                        "Based on the image analysis:\n\n1. Observations: The image shows a skin lesion with irregular borders.\n2. Possible diagnoses: Could be benign nevus or potentially atypical mole.\n3. Recommendations: Monitor for changes in size, shape, or color.\n4. Medical attention: Consult a dermatologist within 2 weeks for proper evaluation.",
                },
            },
        ],
    },
    togetherComplex: {
        choices: [
            {
                message: {
                    content:
                        "Detailed complex analysis with differential diagnosis and multiple recommendations.",
                },
            },
        ],
    },
    geminiSuccess: {
        candidates: [
            {
                content: {
                    parts: [
                        {
                            text: "Medical image analysis:\n\n1. Visual observations indicate...\n2. Differential diagnosis includes...\n3. Recommended next steps...\n4. Seek immediate care if symptoms worsen.",
                        },
                    ],
                },
            },
        ],
    },
    togetherError: {
        error: "Together API rate limit exceeded",
    },
    geminiError: {
        error: "Gemini API authentication failed",
    },
};

export const mockGamificationResponse = {
    success: {
        status: 200,
        data: {
            success: true,
            data: {
                achievements: [
                    {
                        achievementId: "daily_steps_5k",
                        pointsEarned: 10,
                        completedAt: "2024-02-10T12:00:00Z",
                        metadata: {
                            title: "5000 steps",
                            icon: "🚶",
                            description: "Walk 5000 steps in a day",
                        },
                    },
                ],
                totalPoints: 150,
                levelInfo: {
                    level: 5,
                    title: "Expert",
                    currentPoints: 150,
                    pointsForCurrentLevel: 100,
                    pointsForNextLevel: 200,
                    progressToNextLevel: 50,
                },
                dailyActivities: [],
            },
        },
    },
    syncStepsSuccess: {
        status: 200,
        data: {
            success: true,
            data: {
                newAchievements: [
                    {
                        achievementId: "daily_steps_10k",
                        pointsEarned: 30,
                        completedAt: "2024-02-10T14:00:00Z",
                        metadata: {
                            title: "10000 steps",
                            icon: "🏃",
                            description: "Walk 10000 steps in a day",
                        },
                    },
                ],
                pointsEarned: 30,
                currentStreak: 3,
                streakBonus: 5,
                levelInfo: {
                    level: 6,
                    title: "Master",
                    currentPoints: 180,
                    pointsForCurrentLevel: 200,
                    pointsForNextLevel: 400,
                    progressToNextLevel: 45,
                },
                totalPoints: 180,
                dailyActivities: [],
            },
        },
    },
    unauthorized: {
        status: 401,
        data: {
            success: false,
            error: "Unauthorized",
        },
    },
    error: {
        status: 500,
        data: {
            success: false,
            error: "Internal server error",
        },
    },
};
