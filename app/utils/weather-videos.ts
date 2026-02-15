/**
 * Weather video mapping helper
 * Maps weather conditions to background videos
 */

export interface WeatherVideoConfig {
    source: number | undefined;
    fallbackColors: [string, string];
}

// Video sources map
const VIDEO_SOURCES: Record<string, number | undefined> = {
    clear: require("@app/assets/videos/clear.mp4"),
    cloud: require("@app/assets/videos/cloudy.mp4"),
    rain: require("@app/assets/videos/raining.mp4"),
    snow: require("@app/assets/videos/snowing.mp4"),
    fog: require("@app/assets/videos/fog.mp4"),
    thunderstorm: require("@app/assets/videos/storm.mp4"),
};

/**
 * Get video source for weather condition
 * @param condition - Weather condition (clear, rain, snow, etc.)
 * @returns Video source or fallback gradient colors
 */
export const getWeatherVideoConfig = (
    condition: string,
): WeatherVideoConfig => {
    return {
        source: VIDEO_SOURCES[condition],
        fallbackColors: ["#4A90E2", "#7B68EE"],
    };
};
