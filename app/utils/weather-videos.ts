/**
 * Weather video mapping helper
 * Maps weather conditions to background videos from Pixabay
 */

export interface WeatherVideoConfig {
    videoId: number | undefined;
    fallbackColors: [string, string];
}

// Pixabay Video IDs for each weather condition (better than storage them c:)
const WEATHER_VIDEO_IDS: Record<string, number> = {
    clear: 4753, // https://pixabay.com/videos/clouds-sky-oxygen-air-atmosphere-4753/
    cloud: 221180, // https://pixabay.com/videos/sky-clouds-sunrays-cloudy-221180/
    rain: 203878, // https://pixabay.com/videos/leaves-foliage-plants-rain-water-203878/
    snow: 85104, // https://pixabay.com/videos/snow-trees-blizzard-christmas-85104/
    fog: 149330, // https://pixabay.com/videos/animal-contest-animal-competition-149330/
    thunderstorm: 16160, // https://pixabay.com/videos/storm-ocean-sky-rain-the-waves-16160/
};

/**
 * Get video ID for weather condition
 * @param condition - Weather condition (clear, rain, snow, etc.)
 * @returns Video ID and fallback gradient colors
 */
export const getWeatherVideoConfig = (
    condition: string,
): WeatherVideoConfig => {
    return {
        videoId: WEATHER_VIDEO_IDS[condition],
        fallbackColors: ["#4A90E2", "#7B68EE"],
    };
};
