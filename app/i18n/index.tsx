import { getLocales } from "expo-localization";

import { secureStorage } from "@utils/storage";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTrad from "./locales/en-US.json";
import frTrad from "./locales/fr-FR.json";

const initializeI18n = async () => {
    try {
        const storedLanguage = await secureStorage.getItem("language");

        const languageToUse = storedLanguage || getLocales()[0].languageTag;

        if (!storedLanguage) {
            await secureStorage.setItem(
                "language",
                getLocales()[0].languageTag,
            );
        }

        i18n.use(initReactI18next).init({
            lng: languageToUse,
            ns: ["full_trads"],
            defaultNS: "full_trads",
            fallbackLng: "en",
            resources: {
                en: { full_trads: enTrad },
                fr: { full_trads: frTrad },
            },
            react: {
                useSuspense: false,
            },
            saveMissing: true,
        });
    } catch (error) {
        throw new Error("Failed to initialize i18n: " + error);
    }
};

initializeI18n();

export default i18n;
