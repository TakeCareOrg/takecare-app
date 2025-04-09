import i18n from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initReactI18next } from "react-i18next";
import fr from "./fr";
import en from "./en";

const initializeI18n = async () => {
    try {
        const storedLanguage = await AsyncStorage.getItem("@Lang");

        // Get the device's language
        const deviceLanguage = (navigator as any)?.language || "en";

        const languageToUse = storedLanguage || deviceLanguage;

        if (!storedLanguage) {
            await AsyncStorage.setItem("@Lang", deviceLanguage);
        }

        i18n.use(initReactI18next).init({
            // compatibilityJSON: "v3",
            lng: languageToUse,
            fallbackLng: "en",
            resources: {
                en: { translation: en },
                fr: { translation: fr },
            },
            react: {
                useSuspense: false,
            },
            saveMissing: true,
        });
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la langue :", error);
    }
};

initializeI18n();

export default i18n;
