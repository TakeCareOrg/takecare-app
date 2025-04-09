/* File who contains  all the colors used in the app */

import { ColorSchemeName, useColorScheme } from "react-native";

// Create a function that returns colors based on provided theme
export const getColorsByScheme = (colorScheme: ColorSchemeName) => {
    const isDarkMode = colorScheme === "dark";

    return {
        isDarkMode,
        main: {
            background: isDarkMode ? "#0B0B0B" : "#EDEDED",
            container: isDarkMode ? "#1A1A1A" : "#FFFFFF",
            button: isDarkMode ? "#2C2C2C" : "#6F6F6F",
            primary: isDarkMode ? "#EEEEEE" : "#0B0B0B",
            containerTitle: isDarkMode ? "#9E9E9E" : "#696969",
            navIconActive: isDarkMode ? "#FFFFFF" : "#5585FF",
            inputBorder: isDarkMode ? "#CCCCCC" : "#C6C6C6",
            selectItem: isDarkMode
                ? "rgba(79, 79, 79, 0.55)"
                : "rgba(198, 198, 198, 0.55)",
            inputBackground: isDarkMode ? "#2A2A2A" : "#EDEDED",
            menuBackground: isDarkMode
                ? "rgba(42, 42, 42, 0.87)"
                : "rgba(255, 255, 255, 0.87)",
            secondary: "#8E8E8E",
            iconSecondary: "#BFBFBF", //? usefull for icons where the background is not black or white
            navIcon: "#A1A1A1",
            graphGraduation: "#909090",
            graphRow: "#4A4A4A",
            white: "#FFFFFF",
            black: "#000000",
            red: "#C93434",
            green: "#18E85E",
            blueGray: "#7387CE",
            magenta: "#FF3C77",
            emerauld: "#32C89B",
            blue: "#36709B",
            orange: "#ED7E1C",
            shadow: isDarkMode ? "#EDEDED" : "#141414",
            grey: "#696969",
            reverse: isDarkMode ? "#0B0B0B" : "#EDEDED", //? usefull for components that have a background color same than the primary color
            placeholder: "#999999",
        },
        message: {
            errorBackground: "#FFEEE2",
            errorText: "#ED4E1C",
            warningBackground: "#FFF7E5",
            warningText: "#F5A623",
            successBackground: "#E8F5E9",
            successText: "#00A859",
            infoBackground: "#E8F5F9",
            infoText: "#00A8C9",
        },
        pastels: {
            //? Colors for the advices,tags and mood
            redBackground: "#923939",
            redText: "#FC9090",
            blueBackground: "#394792",
            blueText: "#9CAAF0",
            greenBackground: "#399262",
            greenText: "#B9F5AA",
            yellowBackground: "#927E39",
            yellowText: "#FFE791",
            purpleBackground: "#6F3A7D",
            purpleText: "#B08CC7",
            orangeBackground: "#924E39",
            orangeText: "#F0C49C",
            pinkBackground: "#92397E",
            pinkText: "#F09CED",
            lightBlueBackground: "#397292",
            lightBlueText: "#9CD2F0",
        },
        healthScore: {
            VB: "rgba(77, 27, 27, 0.4)",
            B: "rgba(67, 44, 30, 0.4)",
            A: "rgba(23, 44, 63, 0.4)",
            G: "rgba(25, 61, 42, 0.4)",
            VG: "rgba(6, 43, 23,0.4)",
            VBBackground: ["#923939", "#644444"],
            BBackground: ["#925939", "#675545"],
            ABackground: ["#396792", "#3F4E5E"],
            GBackground: ["#399262", "#496C62"],
            VGBackground: ["#11DA6D", "#4B6947"],
            empty: ["#394792", "#2C2935"],
            text: "rgba(193, 193, 193, 0.79)",
        },
        stats: {
            bloodPressureDP: ["#52BB9B", "rgba(0, 0, 0, 0)"],
            bloodPressureSP: ["#0373B3", "rgba(0, 0, 0, 0)"],
            weightGood: ["#27AE8E", "rgba(0, 0, 0, 0)"],
            weightBad: [" #AE2727", "rgba(0, 0, 0, 0)"],
            aboveGraph: "#F86800",
            graphGoodAreaGreen: "rgba(97, 202, 101, 0.17)",
        },
        IBM: ["#0170D7", "#0BA6C9", "#13D154", "#E89C2B", "#C02C2C", "#540909"], // right: start={{x: 0, y: 0}} end={{x: 1, y: 0}}
        diary: ["#396792", "#1E1E4D"],
        takecare: ["#346F99", "#7487CF"],
        quiz: {
            background: ["#7588D0", "#202E61"],
            wheelGrad: isDarkMode ? "#646464" : "#ACA9A5",
            wheelThird: isDarkMode ? "#2F2F2F" : "#E1E1E0",
            graduationSecondary: "#BFCCD7",
            graduationThird: isDarkMode ? "#22314F" : "#D9E1E8",
            searchHeaderBackground: isDarkMode ? "#2A2A2A" : "#E1E1E0",
            searchHeaderText: isDarkMode ? "#9E9E9E" : "#736B66",
            blue: "#5184D1",
            shadow: "#6F81C8",
            questionBackground: isDarkMode ? "#DFDFDF" : "#5780F3",
            question: isDarkMode ? "#454545" : "#FFFFFF",
            text: isDarkMode ? "#79A5CC" : "#22314F",
            lightBlue: "#79A5CC",
            icon: isDarkMode ? "#FFFF" : "#878787",
        },
        food: {
            lowIntake: "#B9F5AA",
            average: "#32CD67",
            highIntake: "#F3722C",
            carbohydrates: "#F94144",
            proteins: "#F3722C",
            fats: "#F9C74F",
            vitamins: "#F8961E",
            others: "#90BE6D",
            high: "#F94144",
            good: "#32CD67",
            low: "#F7FFA0",
        },
        sleep: {
            awake: "#FF6C01",
            light: "#6095F8",
            deep: "#1330FE",
            REM: "#6AC7FF",
            rate: ["rgba(43, 96, 232, 0.5)", "rgba(12, 28, 176, 0.5)"], // right: start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            less: "#A0C1FF",
            good: "#2B60E8",
            more: "#0C1CB0",
            sleepCycle: "#49D5F4",
            mentalRecovery: "#496FF4",
            physicalRecovery: "#18E85E",
            graphGradient: ["#FF6C01", "#6AC7FF", "#6095F8", "#1330FE"],
            moodUnselectedBackground: "rgba(160, 193, 255, 0.53)",
            moodUnselectedText: "#060B36",
        },
        BPM: {
            graphBPMArea: "rgba(202, 116, 97, 0.32)",
            primary: "#C93434",
            secondary: "#3B1B1B",
            orange: "#F3722C",
        },
        water: {
            primary: "#4CDFFF",
            secondary: "#108AA5",
            background: ["rgba(17, 39, 63, 1)", "rgba(10, 141, 155, 1)"],
        },
        chat: {
            userMessageBackground: ["#3E73A1", "#5A82FF"], // right: start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            aiMessageBackground: "#DFDFDF",
            chatUsername: isDarkMode ? "#CCCCCC" : "#696969",
            chatInput: "#5780F3",
            message: "#454545",
            time: "#9E9E9E",
        },
        stress: {
            level1: "#138FD5",
            level2: "#13D56C",
            level3: "#D5C213",
            level4: "#D56413",
            level5: "#D51313",
        },
        period: {
            primary: "#C93460",
        },
        customs: {
            pencil1: "#0D9EC0",
            pencil2: "#51D2E1",
            pencil3: "#263B74",
        },
        //? Start to mig to the new color system
        black: {
            black50: "#E6E6E6",
            black100: "#B0B0B0",
            black200: "#8A8A8A",
            black300: "#545454",
            black400: "#333333",
            black450: "#191919",
            black500: "#000000",
        },
        white: {
            white500: "#FFFFFF",
            white600: "#E8E8E8",
            white700: "#BEBEBE",
            white800: "#8C8C8C",
            white900: "#6B6B6B",
        },
        blue: {
            blue50: "#E7E8F7",
            blue100: "#B4B9E7",
            blue200: "#8F97DB",
            blue300: "#5C67CA",
            blue400: "#3D49C0",
            blue500: "#0C1CB0",
            blue600: "#0B19A0",
            blue700: "#09147D",
            blue800: "#070F61",
            blue900: "#050C4A",
        },
    };
};

// Define light and dark themes statically for non-component usage
export const LightColors = getColorsByScheme("light");
export const DarkColors = getColorsByScheme("dark");

// Create a hook for components that need dynamic theme switching
export const useColors = () => {
    const colorScheme = useColorScheme();
    return getColorsByScheme(colorScheme);
};
