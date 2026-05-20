import "@testing-library/jest-native/extend-expect";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: { changeLanguage: jest.fn() },
    }),
    initReactI18next: {
        type: '3rdParty',
        init: jest.fn(),
    },
}));

jest.mock("@services/auth", () => ({
    AuthService: {
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        refresh: jest.fn(),
        forgotPassword: jest.fn(),
        verifyResetCode: jest.fn(),
        resetPassword: jest.fn(),
    },
}));

jest.mock("@services/chat", () => ({
    ChatService: {
        sendMessages: jest.fn(),
    },
}));

jest.mock("@services/users", () => ({
    UserService: {
        loadUserData: jest.fn(() =>
            Promise.resolve({
                status: 200,
                data: {
                    user: {
                        id: "123",
                        email: "test@example.com",
                        health: { age: 30, gender: "male" },
                    },
                },
            }),
        ),
    },
}));

jest.mock("@utils/storage", () => ({
    secureStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
}));

jest.mock("@constants/auth", () => ({
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    ACCESS_TOKEN_KEY: "auth-storage-access-token",
    REFRESH_TOKEN_KEY: "auth-storage-refresh-token",
}));

jest.mock("axios");

jest.mock("expo-secure-store", () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

jest.mock("@takecareorg/takecare-healthkit", () => ({
    HealthKitModule: {
        isHealthKitAvailable: jest.fn(() => Promise.resolve(true)),
        requestAuthorization: jest.fn(() => Promise.resolve(true)),
        checkAuthorizationStatus: jest.fn(() =>
            Promise.resolve("sharingAuthorized"),
        ),
        getQuantityData: jest.fn(() => Promise.resolve([])),
        getAggregatedQuantity: jest.fn(() => Promise.resolve(0)),
        getCategoryData: jest.fn(() => Promise.resolve([])),
        getWorkouts: jest.fn(() => Promise.resolve([])),
        getRealtimeData: jest.fn(() => Promise.resolve({})),
        getHealthData: jest.fn(() =>
            Promise.resolve({
                steps: null,
                heartRate: null,
                activeEnergy: null,
                distance: null,
                sleepAnalysis: null,
                quantities: null,
                categories: null,
            }),
        ),
        getHealthDataForTimeRange: jest.fn(() =>
            Promise.resolve({
                steps: null,
                heartRate: null,
                activeEnergy: null,
                distance: null,
                sleepAnalysis: null,
                quantities: null,
                categories: null,
            }),
        ),
        clearCache: jest.fn(() => Promise.resolve()),
        writeQuantityData: jest.fn(() => Promise.resolve(true)),
        writeCategoryData: jest.fn(() => Promise.resolve(true)),
        observeQuantityChanges: jest.fn(() => Promise.resolve("sub-1")),
        observeCategoryChanges: jest.fn(() => Promise.resolve("sub-2")),
        removeObserver: jest.fn(() => Promise.resolve()),
        removeAllObservers: jest.fn(() => Promise.resolve()),
        registerBackgroundSync: jest.fn(() => Promise.resolve()),
        unregisterBackgroundSync: jest.fn(() => Promise.resolve()),
        isBackgroundSyncRegistered: jest.fn(() => Promise.resolve(false)),
        getSteps: jest.fn(() => Promise.resolve(0)),
        getHeartRate: jest.fn(() => Promise.resolve(0)),
        seedTestHealthData: jest.fn(() => Promise.resolve()),
    },
    HealthKitQuantityType: {
        STEPS: "HKQuantityTypeIdentifierStepCount",
        HEART_RATE: "HKQuantityTypeIdentifierHeartRate",
        RESTING_HEART_RATE: "HKQuantityTypeIdentifierRestingHeartRate",
        ACTIVE_ENERGY_BURNED: "HKQuantityTypeIdentifierActiveEnergyBurned",
        DISTANCE_WALKING_RUNNING:
            "HKQuantityTypeIdentifierDistanceWalkingRunning",
        FLIGHTS_CLIMBED: "HKQuantityTypeIdentifierFlightsClimbed",
        APPLE_EXERCISE_TIME: "HKQuantityTypeIdentifierAppleExerciseTime",
    },
    HealthKitCategoryType: {
        SLEEP_ANALYSIS: "HKCategoryTypeIdentifierSleepAnalysis",
    },
    TimeRange: {
        TODAY: "today",
        THIS_WEEK: "this_week",
        LAST_30_DAYS: "last_30_days",
        CUSTOM: "custom",
    },
    AggregationType: {
        SUM: "sum",
        AVERAGE: "average",
        MIN: "min",
        MAX: "max",
        COUNT: "count",
    },
    getHealthKit: jest.fn(() => ({})),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
}));

global.fetch = jest.fn();

global.FormData = class FormData {
    constructor() {
        this.data = new Map();
    }
    append(key, value) {
        this.data.set(key, value);
    }
    get(key) {
        return this.data.get(key);
    }
};

global.atob = (str) => Buffer.from(str, "base64").toString("binary");

global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
};
