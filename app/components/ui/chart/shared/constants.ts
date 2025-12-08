/**
 * Shared constants for all chart components
 */

// Layout constants
export const PADDING_TOP = 20;
export const PADDING_BOTTOM = 30;
export const RIGHT_PADDING_WIDTH = 30;

// Bar constants (default values)
export const BAR_WIDTH = 30;
export const BAR_GAP = 8;
export const BAR_ACTUAL_WIDTH = 10;
export const BAR_BORDER_RADIUS = 5;

// Chart scaling constants
export const MAX_CHART_HEIGHT = 100;
export const MIN_CHART_HEIGHT = 60;

// Selection zone constants
export const SELECTION_ZONE_WIDTH = BAR_WIDTH + 3;
export const SELECTION_ZONE_BORDER_RADIUS = 8;
export const CENTERING_OFFSET = 5;

// Animation constants
export const ANIMATION_DURATION = 200;
export const RENDER_DELAY = 100;

// Reference lines constants
export const DOT_SIZE = 1;
export const GAP_SIZE = 4;
export const LINE_HEIGHT = 1;
export const LINE_STOP_MARGIN = 10;

// Text constants
export const LABEL_FONT_SIZE = 12;
export const LABEL_BOTTOM_POSITION = 10;
export const SELECTED_LABEL_WIDTH = 35;
export const SELECTED_LABEL_BACKGROUND_PADDING = 4;

// Year divider constants (for DailyBarChart)
export const YEAR_DIVIDER_WIDTH = 40;
export const YEAR_DIVIDER_LINE_WIDTH = 2;

// Default values
export const DEFAULT_BUFFER = 20;
export const REFERENCE_LINE_BUFFER = 25;
export const DEFAULT_HEIGHT = 150;

// Z-Index constants
export const Z_INDEX = {
    BARS: 4,
    LABEL_BG: 5,
    REFERENCE_LABELS: 15,
    YEAR_DIVIDER: 3,
    SELECTED_LABEL_BG: 6,
} as const;

// Color constants
export const COLORS = {
    SELECTED_BAR: "#5B7BFB",
    NORMAL_BAR: "#3B5AFB",
    LABEL_TEXT: "#888",
    SELECTED_LABEL_TEXT: "#fff",
    SELECTED_LABEL_BG: "rgba(0, 0, 0, 0.7)",
    SELECTION_ZONE_BG: "rgba(79, 79, 79, 0.55)",
    REFERENCE_LABEL: "blue",
    YEAR_DIVIDER: "#666",
} as const;

// Interval types and configurations
export type IntervalType = "24hours" | "7days" | "31days" | "12months";

export const INTERVAL_CONFIGS = {
    "24hours": {
        labels: Array.from({ length: 24 }, (_, i) =>
            i.toString().padStart(2, "0"),
        ),
        keys: Array.from({ length: 24 }, (_, i) => i.toString()),
    },
    "7days": {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        keys: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ],
    },
    "31days": {
        labels: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
        keys: Array.from({ length: 31 }, (_, i) => `day-${i + 1}`),
    },
    "12months": {
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        keys: [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
        ],
    },
} as const;
