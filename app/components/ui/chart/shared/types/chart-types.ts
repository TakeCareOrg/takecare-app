import { RefObject } from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
} from "react-native";

/**
 * Common types shared between all chart components
 */

// Scroll event type
export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

// Base data item interface
export interface BaseBarDataItem {
    value: number;
    color?: string;
}

// Daily bar data (with date)
export interface DailyBarDataItem extends BaseBarDataItem {
    day: string;
    startDate?: string;
}

// Interval bar data (hours, days, months)
export interface IntervalBarDataItem extends BaseBarDataItem {
    label: string;
    intervalKey: string;
    day?: string; // Alias for label used in some components
}

// Internal processed interval data
export interface ProcessedIntervalBarDataItem extends BaseBarDataItem {
    day: string;
    intervalKey: string;
}

// Reference line configuration
export interface ReferenceLine {
    value: number;
    label: string;
    lineColor?: string;
    labelColor?: string;
    color?: string;
    dashArray?: number[];
}

// Dynamic colors configuration
export interface DynamicColors {
    belowFirstReference: string;
    aboveFirstReference: string;
    aboveSecondReference?: string;
}

// Common props shared between charts
export interface BaseChartProps<T extends BaseBarDataItem> {
    data: T[];
    maxValue?: number;
    referenceLines?: ReferenceLine[];
    buffer?: number;
    height?: number;
    onSelect?: (selectedData: T, index: number) => void;
    dynamicColors?: DynamicColors;
}

// Visible indices state
export interface VisibleIndices {
    start: number;
    end: number;
}

// Chart dimensions configuration
export interface ChartDimensions {
    chartHeight: number;
    viewportWidth: number;
    contentWidth: number;
}

// Scroll refs bundle
export interface ScrollRefs {
    scrollViewRef: RefObject<ScrollView>;
    scrollOffsetRef: RefObject<number>;
    isUserScrollingRef: RefObject<boolean>;
    isAdjustingRef: RefObject<boolean>;
    isInitializedRef: RefObject<boolean>;
    lastScrollTimeRef: RefObject<number>;
    scrollVelocityRef: RefObject<number>;
    lastScrollOffsetRef: RefObject<number>;
}

// Bar configuration
export interface BarConfig {
    barWidth: number;
    barGap: number;
    barActualWidth: number;
}
