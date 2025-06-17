module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module-resolver",
                {
                    root: ["."],
                    extensions: [
                        ".ios.ts",
                        ".android.ts",
                        ".ts",
                        ".ios.tsx",
                        ".android.tsx",
                        ".tsx",
                        ".jsx",
                        ".js",
                        ".json",
                    ],
                    alias: {
                        "@app": "./app",
                        "@assets": "./app/assets",
                        "@types": "./app/types",
                        "@dtypes": "./app/types",
                        "@services": "./app/services",
                        "@stores": "./app/stores",
                        "@components": "./app/components",
                        "@hooks": "./app/hooks",
                        "@screens": "./app/screens",
                        "@navigation": "./app/navigation",
                        "@utils": "./app/utils",
                        "@constants": "./app/constants",
                        "@config": "./app/config",
                        "@locales": "./app/locales",
                    },
                },
            ],
        ],
    };
};
