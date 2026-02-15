import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useVideoPlayer, VideoView } from "expo-video";

import { useColorTheme } from "@app/hooks/use-color-theme";
import { fetchCurrentWeather } from "@app/services/weather";
import { getWeatherConditionFromCode } from "@app/utils/weather-helper";
import { getWeatherVideoConfig } from "@app/utils/weather-videos";
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
}

export function WeatherBox() {
    const { t } = useTranslation("full_trads");
    const colors = useColorTheme();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get video config based on weather (with default fallback)
    const videoConfig = weather
        ? getWeatherVideoConfig(weather.condition)
        : {
              source: undefined,
              fallbackColors: ["#4A90E2", "#7B68EE"] as [string, string],
          };

    // Create video player (always called at same level)
    const player = useVideoPlayer(videoConfig.source ?? null, (player) => {
        if (videoConfig.source) {
            player.loop = true;
            player.muted = true;
            player.play();
        }
    });

    // Update player when video source changes
    useEffect(() => {
        if (player && videoConfig.source) {
            player.loop = true;
            player.muted = true;
            player.play();
        }
    }, [player, videoConfig.source]);

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
            };
        }

        if (condition.includes("snow")) {
            return {
                title: t("WEATHER.ADVICE.SNOW_TITLE"),
                advice: t("WEATHER.ADVICE.SNOW_TEXT"),
            };
        }

        if (condition.includes("thunderstorm")) {
            return {
                title: t("WEATHER.ADVICE.STORM_TITLE"),
                advice: t("WEATHER.ADVICE.STORM_TEXT"),
            };
        }

        if (condition.includes("clear") && tempCelsius > 25) {
            return {
                title: t("WEATHER.ADVICE.HOT_TITLE"),
                advice: t("WEATHER.ADVICE.HOT_TEXT"),
            };
        }

        if (tempCelsius < 5) {
            return {
                title: t("WEATHER.ADVICE.COLD_TITLE"),
                advice: t("WEATHER.ADVICE.COLD_TEXT"),
            };
        }

        if (condition.includes("cloud")) {
            return {
                title: t("WEATHER.ADVICE.CLOUDY_TITLE"),
                advice: t("WEATHER.ADVICE.CLOUDY_TEXT"),
            };
        }

        // Temps agréable par défaut
        return {
            title: t("WEATHER.ADVICE.NICE_TITLE"),
            advice: t("WEATHER.ADVICE.NICE_TEXT"),
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
            <View style={[styles.container, { shadowColor: colors.black }]}>
                <LinearGradient
                    colors={["#4A90E2", "#7B68EE"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.background}
                />
                <View style={styles.overlay} />
                <View style={styles.content}>
                    <ActivityIndicator size="large" color={colors.white} />
                </View>
            </View>
        );
    }

    if (error || !weather) {
        return (
            <View style={[styles.container, { shadowColor: colors.black }]}>
                <LinearGradient
                    colors={["#4A90E2", "#7B68EE"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.background}
                />
                <View style={styles.overlay} />
                <View style={styles.content}>
                    <Text
                        fontSize={14}
                        weight="600"
                        color={colors.white}
                        style={{ textAlign: "center" }}
                    >
                        {error || t("WEATHER.ERRORS.NO_DATA")}
                    </Text>
                </View>
            </View>
        );
    }

    const advice = getWeatherAdvice(weather.condition, weather.temp);

    return (
        <View style={[styles.container, { shadowColor: colors.black }]}>
            {/* Video background or gradient fallback */}
            {videoConfig.source ? (
                <VideoView
                    player={player}
                    style={styles.background}
                    contentFit="cover"
                    nativeControls={false}
                />
            ) : (
                <LinearGradient
                    colors={videoConfig.fallbackColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.background}
                />
            )}

            {/* Semi-transparent overlay for text readability */}
            <View style={styles.overlay} />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.tempContainer}>
                        <Text fontSize={48} weight="800" color={colors.white}>
                            {weather.temp}°
                        </Text>
                    </View>
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 32,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
        minHeight: 200,
        overflow: "hidden",
        position: "relative",
    },
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.15)",
    },
    content: {
        ...padding(16),
        position: "relative",
        zIndex: 1,
        flex: 1,
        justifyContent: "center",
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
