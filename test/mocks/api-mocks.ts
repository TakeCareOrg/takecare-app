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
            startDate: "2024-01-01T00:00:00Z",
            endDate: "2024-01-01T23:59:59Z",
        },
        {
            value: 7500,
            startDate: "2024-01-02T00:00:00Z",
            endDate: "2024-01-02T23:59:59Z",
        },
    ],
    flights: [
        {
            value: 10,
            startDate: "2024-01-01T00:00:00Z",
            endDate: "2024-01-01T23:59:59Z",
        },
        {
            value: 15,
            startDate: "2024-01-02T00:00:00Z",
            endDate: "2024-01-02T23:59:59Z",
        },
    ],
    distance: [
        {
            value: 3500,
            startDate: "2024-01-01T00:00:00Z",
            endDate: "2024-01-01T23:59:59Z",
        },
        {
            value: 5000,
            startDate: "2024-01-02T00:00:00Z",
            endDate: "2024-01-02T23:59:59Z",
        },
    ],
    activeEnergyBurned: [
        {
            value: 250,
            startDate: "2024-01-01T00:00:00Z",
            endDate: "2024-01-01T23:59:59Z",
        },
        {
            value: 400,
            startDate: "2024-01-02T00:00:00Z",
            endDate: "2024-01-02T23:59:59Z",
        },
    ],
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
