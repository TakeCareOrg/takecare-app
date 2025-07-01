// Global constants for DailyBarChart component and its sub-components

// Layout constants
export const PADDING_TOP = 20;
export const PADDING_BOTTOM = 30;
export const RIGHT_PADDING_WIDTH = 30; // Width for label area

// Bar constants
export const BAR_WIDTH = 30; // Representing the hitbox width of each bar
export const BAR_GAP = 8;
export const BAR_ACTUAL_WIDTH = 10;
export const BAR_BORDER_RADIUS = 5;

// Chart scaling constants
export const MAX_CHART_HEIGHT = 100; // Hauteur maximale effective du chart (sans padding)
export const MIN_CHART_HEIGHT = 60;  // Hauteur minimale pour éviter des barres trop petites

// Selection zone constants
export const SELECTION_ZONE_WIDTH = BAR_WIDTH + 3;
export const SELECTION_ZONE_BORDER_RADIUS = 8;
export const CENTERING_OFFSET = 5;

// Animation constants
export const ANIMATION_DURATION = 200;
export const ADJUSTMENT_SENSITIVITY = 50; // Increased more to reduce aggressive snapping
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

// Year divider constants
export const YEAR_DIVIDER_WIDTH = 40;
export const YEAR_DIVIDER_LINE_WIDTH = 2;

// Default values
export const DEFAULT_BUFFER = 20;
export const REFERENCE_LINE_BUFFER = 25; // Minimum buffer above reference lines (in percentage) - increased for more space
export const DEFAULT_HEIGHT = 150; // Total component height (with padding)
export const DEFAULT_REFERENCE_LINES = [
    { value: 20, label: "20%" },
    { value: 30, label: "30%" },
];

// Scroll velocity presets for testing and UX
export const SCROLL_VELOCITY = {
    NORMAL: 0.998,  // iOS default
    FAST: 0.85,     // Good balance for quick navigation
    ULTRA: 0.7,     // Very fast for testing
    SLOW: 0.99,     // Slower for precise control
} as const;

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