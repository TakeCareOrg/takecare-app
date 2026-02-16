import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import * as Location from "expo-location";

import { fetchCurrentWeather } from "@app/services/weather";
import { getWeatherConditionFromCode } from "@app/utils/weather-helper";

export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    description: string;
    latitude: number;
    longitude: number;
    timestamp: number;
}

export interface UseWeatherReturn {
    weather: WeatherData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Cache global (en dehors du hook pour persister entre renders/composants)
let weatherCache: WeatherData | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export function useWeather(): UseWeatherReturn {
    const { t } = useTranslation("full_trads");
    const [weather, setWeather] = useState<WeatherData | null>(weatherCache);
    const [loading, setLoading] = useState(!weatherCache);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            setError(null);

            // Demander la permission de localisation
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setError(t("WEATHER.ERRORS.PERMISSION_DENIED"));
                setLoading(false);
                return;
            }

            // Obtenir la position actuelle
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const { latitude, longitude } = location.coords;

            // Appeler le service météo
            const weatherResponse = await fetchCurrentWeather(
                latitude,
                longitude,
            );

            // Mapper le weathercode vers nos conditions
            const weatherCondition = getWeatherConditionFromCode(
                weatherResponse.weatherCode,
            );

            const weatherData: WeatherData = {
                temp: Math.round(weatherResponse.temperature),
                condition: weatherCondition.condition,
                icon: String(weatherResponse.weatherCode),
                description: t(weatherCondition.descriptionKey),
                latitude,
                longitude,
                timestamp: Date.now(),
            };

            // Mettre à jour le cache global
            weatherCache = weatherData;
            setWeather(weatherData);
            setLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError(t("WEATHER.ERRORS.FETCH_FAILED"));
            setLoading(false);
        }
    };

    useEffect(() => {
        // Vérifier si le cache est valide
        if (
            weatherCache &&
            Date.now() - weatherCache.timestamp < CACHE_DURATION
        ) {
            setWeather(weatherCache);
            setLoading(false);
            return;
        }

        // Sinon, fetch
        fetchWeather();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { weather, loading, error, refetch: fetchWeather };
}
