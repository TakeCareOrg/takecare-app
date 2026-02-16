import axios, { isAxiosError } from "axios";

export interface WeatherResponse {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    time: string;
}

export interface WeatherError {
    message: string;
}

/**
 * Fetch current weather data from Open-Meteo API
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Current weather data
 */
export const fetchCurrentWeather = async (
    latitude: number,
    longitude: number,
): Promise<WeatherResponse> => {
    try {
        const response = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude,
                    longitude,
                    current_weather: true,
                    temperature_unit: "celsius",
                },
            },
        );

        const currentWeather = response.data.current_weather;

        return {
            temperature: currentWeather.temperature,
            weatherCode: currentWeather.weathercode,
            windSpeed: currentWeather.windspeed,
            windDirection: currentWeather.winddirection,
            time: currentWeather.time,
        };
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to fetch weather data",
            );
        }
        throw new Error("Unknown error occurred while fetching weather");
    }
};
