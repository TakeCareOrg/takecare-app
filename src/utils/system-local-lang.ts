import * as Localization from "expo-localization";

export const getDeviceLocale = () => {
    // Get the device locales using the non-deprecated method
    const locales = Localization.getLocales();

    // Return the first locale's languageTag, which has the format "languageCode-countryCode" (e.g., "en-US")
    // or fallback to "en-US" if somehow no locales are available
    return locales.length > 0 ? locales[0].languageTag : "en-US";
};
