import "@testing-library/jest-native/extend-expect";

jest.mock("expo-localization", () => ({
    getLocales: jest.fn(() => [
        {
            languageTag: "en-US",
            languageCode: "en",
            textDirection: "ltr",
            digitGroupingSeparator: ",",
            decimalSeparator: ".",
            measurementSystem: "metric",
            currencyCode: "USD",
            currencySymbol: "$",
            regionCode: "US",
        },
    ]),
    getCalendars: jest.fn(() => []),
}));

jest.mock("@app/i18n", () => ({
    initI18n: jest.fn(() => Promise.resolve()),
    i18n: {
        t: (key) => key,
        changeLanguage: jest.fn(),
        language: "en",
    },
}));

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
}));

jest.mock("axios");

jest.mock("expo-secure-store", () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

jest.mock("react-native-audio-record", () => ({
    default: {
        init: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(() => Promise.resolve("/path/to/audio.wav")),
        on: jest.fn(),
    },
}));

jest.mock("react-native-health-connect", () => ({
    initialize: jest.fn(() => Promise.resolve(true)),
    readRecords: jest.fn(() => Promise.resolve({ records: [] })),
}));

jest.mock("@takecareorg/takecare-healthkit", () => ({
    default: {
        isAvailable: jest.fn(() => Promise.resolve(true)),
        requestAuthorization: jest.fn(() => Promise.resolve(true)),
        getStepCount: jest.fn(() => Promise.resolve({ value: 0 })),
        getFlightsClimbed: jest.fn(() => Promise.resolve({ value: 0 })),
        getDistanceWalkingRunning: jest.fn(() => Promise.resolve({ value: 0 })),
    },
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
