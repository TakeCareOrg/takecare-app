const tseslint = require("@typescript-eslint/eslint-plugin");
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
    expoConfig,
    eslintPluginPrettierRecommended,
    {
        ignores: [
            "dist/*",
            "node_modules/*",
            "./expo/**/*",
            "test/**/*",
            "**/*.test.ts",
            "**/*.test.tsx",
        ],
    },
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
            prettier: require("eslint-plugin-prettier"),
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                project: "./tsconfig.json",
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-require-imports": "off",
            "prettier/prettier": "warn", // Downgrade to warning
            "no-console": "error", // Disallow console logs
            semi: ["error", "always"],
            quotes: ["error", "double"],
        },
    },
    prettierConfig,
]);
