import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { fetchCurrentWeather } from "@app/services/weather";
import { getWeatherConditionFromCode } from "@app/utils/weather-helper";
import { Text } from "@components/ui/text";
import { padding } from "@utils/styles";

interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    description: string;
}

interface WeatherAdvice {
    title: string;
    advice: string;
    emoji: string;
}

export function WeatherBox() {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getWeatherAdvice = (
        condition: string,
        temp: number,
    ): WeatherAdvice => {
        const tempCelsius = temp;

        // Conseils basés sur la météo
        if (condition.includes("rain") || condition.includes("drizzle")) {
            return {
                title: t("WEATHER.ADVICE.RAIN_TITLE"),
                advice: t("WEATHER.ADVICE.RAIN_TEXT"),
                emoji: "🌧️",
            };
        }

        if (condition.includes("snow")) {
            return {
                title: t("WEATHER.ADVICE.SNOW_TITLE"),
                advice: t("WEATHER.ADVICE.SNOW_TEXT"),
                emoji: "❄️",
            };
        }

        if (condition.includes("thunderstorm")) {
            return {
                title: t("WEATHER.ADVICE.STORM_TITLE"),
                advice: t("WEATHER.ADVICE.STORM_TEXT"),
                emoji: "⛈️",
            };
        }

        if (condition.includes("clear") && tempCelsius > 25) {
            return {
                title: t("WEATHER.ADVICE.HOT_TITLE"),
                advice: t("WEATHER.ADVICE.HOT_TEXT"),
                emoji: "☀️",
            };
        }

        if (tempCelsius < 5) {
            return {
                title: t("WEATHER.ADVICE.COLD_TITLE"),
                advice: t("WEATHER.ADVICE.COLD_TEXT"),
                emoji: "🧊",
            };
        }

        if (condition.includes("cloud")) {
            return {
                title: t("WEATHER.ADVICE.CLOUDY_TITLE"),
                advice: t("WEATHER.ADVICE.CLOUDY_TEXT"),
                emoji: "☁️",
            };
        }

        // Temps agréable par défaut
        return {
            title: t("WEATHER.ADVICE.NICE_TITLE"),
            advice: t("WEATHER.ADVICE.NICE_TEXT"),
            emoji: "🌤️",
        };
    };

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
            };

            setWeather(weatherData);
            setLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError(t("WEATHER.ERRORS.FETCH_FAILED"));
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <LinearGradient
                colors={["#4A90E2", "#7B68EE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.container,
                    {
                        shadowColor: colors.black,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}
            >
                <ActivityIndicator size="large" color={colors.white} />
            </LinearGradient>
        );
    }

    if (error || !weather) {
        return (
            <LinearGradient
                colors={["#4A90E2", "#7B68EE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.container,
                    {
                        shadowColor: colors.black,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}
            >
                <Text
                    fontSize={14}
                    weight="600"
                    color={colors.white}
                    style={{ textAlign: "center" }}
                >
                    {error || t("WEATHER.ERRORS.NO_DATA")}
                </Text>
            </LinearGradient>
        );
    }

    const advice = getWeatherAdvice(weather.condition, weather.temp);

    return (
        <LinearGradient
            colors={["#4A90E2", "#7B68EE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, { shadowColor: colors.black }]}
        >
            <View style={styles.header}>
                <View style={styles.tempContainer}>
                    <Text fontSize={48} weight="800" color={colors.white}>
                        {weather.temp}°
                    </Text>
                </View>
                <Text
                    fontSize={32}
                    weight="400"
                    color={colors.white}
                    style={{ marginLeft: 8 }}
                >
                    {advice.emoji}
                </Text>
            </View>

            <View style={styles.descriptionContainer}>
                <Text
                    fontSize={14}
                    weight="600"
                    color={colors.white}
                    style={{ textTransform: "capitalize" }}
                >
                    {weather.description}
                </Text>
            </View>

            <View style={styles.adviceContainer}>
                <Text
                    fontSize={13}
                    weight="700"
                    color={colors.white}
                    style={{ marginBottom: 4 }}
                >
                    {advice.title}
                </Text>
                <Text
                    fontSize={11}
                    weight="400"
                    color={colors.white}
                    style={{ lineHeight: 14, opacity: 0.95 }}
                >
                    {advice.advice}
                </Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 32,
        ...padding(16),
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
        minHeight: 200,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    tempContainer: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    descriptionContainer: {
        marginBottom: 12,
    },
    adviceContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 16,
        padding: 12,
        marginTop: 4,
    },
});
