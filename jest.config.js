module.exports = {
    preset: "react-native",
    setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
    testMatch: ["<rootDir>/test/**/*.test.{ts,tsx}"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": [
            "babel-jest",
            { configFile: "./babel.config.js" },
        ],
    },
    transformIgnorePatterns: [
        "node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|react-native-reanimated|zustand)/)",
    ],
    moduleNameMapper: {
        "^@app/(.*)$": "<rootDir>/app/$1",
        "^@components/(.*)$": "<rootDir>/app/components/$1",
        "^@screens/(.*)$": "<rootDir>/app/screens/$1",
        "^@hooks/(.*)$": "<rootDir>/app/hooks/$1",
        "^@stores/(.*)$": "<rootDir>/app/stores/$1",
        "^@services/(.*)$": "<rootDir>/app/services/$1",
        "^@utils/(.*)$": "<rootDir>/app/utils/$1",
        "^@constants/(.*)$": "<rootDir>/app/constants/$1",
        "^@dtypes/(.*)$": "<rootDir>/app/types/$1",
        "^@layouts/(.*)$": "<rootDir>/app/layouts/$1",
    },
    collectCoverageFrom: [
        // Stores
        "app/stores/**/*.{ts,tsx}",

        // Hooks
        "app/hooks/chat/**/*.{ts,tsx}",
        "app/hooks/health/**/*.{ts,tsx}",

        // Utils (least prioritary)
        "app/utils/storage.ts",
        "app/utils/date.ts",
        "app/utils/parse-markdown.ts",

        // Services (already covered through store tests)
        "app/services/**/*.{ts,tsx}",

        // Exclusions
        "!app/**/*.test.{ts,tsx}",
        "!app/**/__tests__/**",
        "!app/types/**",
        "!app/**/*.d.ts",
        "!app/services/axios.ts",
    ],
    coverageThreshold: {
        global: {
            lines: 60,
            statements: 60,
        },
    },
    testEnvironment: "node",
};
