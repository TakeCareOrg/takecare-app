/**
 * Weather helper functions for mapping WMO weather codes to conditions
 */

export interface WeatherCondition {
    condition: string;
    descriptionKey: string;
}

/**
 * Map WMO Weather Interpretation Code to weather condition
 * @param weatherCode - WMO weather code from Open-Meteo API
 * @returns Weather condition and translation key
 */
export const getWeatherConditionFromCode = (
    weatherCode: number,
): WeatherCondition => {
    if (weatherCode === 0) {
        return {
            condition: "clear",
            descriptionKey: "WEATHER.CONDITIONS.CLEAR",
        };
    }

    if (weatherCode >= 1 && weatherCode <= 3) {
        return {
            condition: "cloud",
            descriptionKey: "WEATHER.CONDITIONS.CLOUDY",
        };
    }

    if (weatherCode === 45 || weatherCode === 48) {
        return {
            condition: "fog",
            descriptionKey: "WEATHER.CONDITIONS.FOG",
        };
    }

    if (
        (weatherCode >= 51 && weatherCode <= 65) ||
        (weatherCode >= 80 && weatherCode <= 82)
    ) {
        return {
            condition: "rain",
            descriptionKey: "WEATHER.CONDITIONS.RAIN",
        };
    }

    if (
        weatherCode === 56 ||
        weatherCode === 57 ||
        weatherCode === 66 ||
        weatherCode === 67 ||
        weatherCode === 85 ||
        weatherCode === 86
    ) {
        return {
            condition: "snow",
            descriptionKey: "WEATHER.CONDITIONS.SNOW",
        };
    }

    if (weatherCode >= 71 && weatherCode <= 77) {
        return {
            condition: "snow",
            descriptionKey: "WEATHER.CONDITIONS.SNOW_FALL",
        };
    }

    if (weatherCode >= 95 && weatherCode <= 99) {
        return {
            condition: "thunderstorm",
            descriptionKey: "WEATHER.CONDITIONS.THUNDERSTORM",
        };
    }

    return {
        condition: "clear",
        descriptionKey: "WEATHER.CONDITIONS.CLEAR",
    };
};
