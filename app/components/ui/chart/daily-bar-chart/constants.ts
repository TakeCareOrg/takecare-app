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

// Selection zone constants
export const SELECTION_ZONE_WIDTH = BAR_WIDTH + 3;
export const SELECTION_ZONE_BORDER_RADIUS = 8;
export const CENTERING_OFFSET = 5;

// Animation constants
export const ANIMATION_DURATION = 300;
export const ADJUSTMENT_SENSITIVITY = 3;
export const RENDER_DELAY = 100;

// Reference lines constants
export const DOT_SIZE = 1;
export const GAP_SIZE = 4;
export const LINE_HEIGHT = 1;
export const LINE_STOP_MARGIN = 10;

// Text constants
export const LABEL_FONT_SIZE = 12;
export const LABEL_BOTTOM_POSITION = 10;

// Default values
export const DEFAULT_BUFFER = 20;
export const DEFAULT_HEIGHT = 150;
export const DEFAULT_REFERENCE_LINES = [
    { value: 20, label: "20%" },
    { value: 30, label: "30%" },
];

// Z-Index constants
export const Z_INDEX = {
    BARS: 4,
    LABEL_BG: 5,
    REFERENCE_LABELS: 15,
} as const;

// Color constants
export const COLORS = {
    SELECTED_BAR: "#5B7BFB",
    NORMAL_BAR: "#3B5AFB",
    LABEL_TEXT: "#888",
    SELECTED_LABEL_TEXT: "#fff",
    SELECTION_ZONE_BG: "rgba(79, 79, 79, 0.55)",
    REFERENCE_LABEL: "blue",
} as const;
