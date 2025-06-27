//? This component is the daily bar chart, for the differents details screens, like steps, calories, etc.
//? It's still in draft, but the idea is to have the possibility to scroll through the bars, and have a dynamic max value based on the visible bars.
//? It also has reference lines, and a buffer to avoid the bars being too close to the top of the chart.

import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, LayoutChangeEvent, Animated, ScrollView } from 'react-native';
import { ReferenceLines } from './reference-lines';
import { ProgressBars, BarDataItem } from './progress-bars';
import { SelectionZone } from './selection-zone';
import {
  PADDING_TOP,
  PADDING_BOTTOM,
  RIGHT_PADDING_WIDTH,
  BAR_WIDTH,
  BAR_GAP,
  CENTERING_OFFSET,
  DEFAULT_BUFFER,
  DEFAULT_HEIGHT,
  DEFAULT_REFERENCE_LINES,
  ANIMATION_DURATION,
  ADJUSTMENT_SENSITIVITY,
  SELECTION_ZONE_WIDTH,
  RENDER_DELAY,
} from './constants';

interface DailyBarChartProps {
  data: BarDataItem[];
  maxValue?: number;
  referenceLines?: { value: number; label: string }[]; 
  buffer?: number;
  height?: number;
}

export const DailyBarChart = ({ 
  data, 
  maxValue: providedMaxValue, 
  referenceLines = DEFAULT_REFERENCE_LINES,
  buffer = DEFAULT_BUFFER,
  height = DEFAULT_HEIGHT,
}: DailyBarChartProps) => {
  // State
  const [visibleIndices, setVisibleIndices] = useState<{start: number, end: number}>({start: 0, end: Math.min(5, data.length - 1)});
  const [viewportWidth, setViewportWidth] = useState(0);
  const [selectedBarIndex, setSelectedBarIndex] = useState(data.length - 1);
  const [selectionZoneLeft, setSelectionZoneLeft] = useState<number | null>(null);
  
  // Refs
  const isAdjustingRef = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  
  // Create animated values for reference lines
  const animatedPositions = useRef<Animated.Value[]>(
    referenceLines.map(() => new Animated.Value(0))
  ).current;
  
  // Derived values
  const chartHeight = height - PADDING_TOP - PADDING_BOTTOM;
  const contentWidth = useMemo(() => {
    // Calculate the exact width needed for all bars
    const barsWidth = data.length * (BAR_WIDTH + BAR_GAP);
    
    // Add minimal padding to allow the last bar to be properly selectable
    // This should be just enough to center the last bar in the selection zone
    const minPadding = selectionZoneLeft !== null ? 
      Math.max(0, (selectionZoneLeft + SELECTION_ZONE_WIDTH / 2) - (viewportWidth - RIGHT_PADDING_WIDTH)) : 
      SELECTION_ZONE_WIDTH / 2;
    
    return barsWidth + minPadding;
  }, [data.length, viewportWidth, selectionZoneLeft]);
  
  // Calculate maximum value based on visible bars only
  const dynamicMaxValue = useMemo(() => {
    if (providedMaxValue) {
      return providedMaxValue;
    }
    
    // Extract visible data
    const visibleData = data.slice(visibleIndices.start, visibleIndices.end + 1);
    
    // Find maximum value in visible data
    const highestValue = Math.max(...visibleData.map(item => item.value), 1);
    
    return highestValue + (highestValue * buffer / 100);
  }, [
    data, 
    providedMaxValue, 
    buffer, 
    visibleIndices.start, 
    visibleIndices.end
  ]);
  
  // Animate reference lines when dynamicMaxValue changes
  useEffect(() => {
    const animations = referenceLines.map((line, index) => {
      const position = (line.value / dynamicMaxValue) * chartHeight;
      return Animated.timing(animatedPositions[index], {
        toValue: position > chartHeight ? chartHeight : position, // Cap at chart height
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      });
    });
    
    Animated.parallel(animations).start();
  }, [dynamicMaxValue, chartHeight, referenceLines, animatedPositions]);
  
  // Track scrolling position and update selected bar based on selection zone position
  const handleScroll = useCallback((event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollOffsetRef.current = offsetX;
    
    // Update selected bar in real-time during scroll if selection zone is positioned
    if (selectionZoneLeft !== null && !isAdjustingRef.current) {
      const selectionZoneCenter = selectionZoneLeft + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;
      
      // Calculate maximum allowed scroll position
      const lastBarCenter = (data.length - 1) * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
      const maxAllowedScroll = Math.max(0, lastBarCenter - selectionZoneCenter);
      const boundedOffsetX = Math.min(offsetX, maxAllowedScroll);
      
      const targetContentPosition = selectionZoneCenter + boundedOffsetX;
      const closestBarIndex = Math.round(targetContentPosition / (BAR_WIDTH + BAR_GAP));
      const barIndex = Math.min(data.length - 1, Math.max(0, closestBarIndex));
      
      // Only update if the bar index has changed to avoid unnecessary re-renders
      setSelectedBarIndex(prevIndex => prevIndex !== barIndex ? barIndex : prevIndex);
    }
  }, [selectionZoneLeft, data.length]);
  
  // End of scroll - find bar closest to selection zone and center it
  const handleMomentumScrollEnd = useCallback((event?: any) => {
    if (isAdjustingRef.current || selectionZoneLeft === null) {
      return;
    }
    
    const offsetX = event ? event.nativeEvent.contentOffset.x : scrollOffsetRef.current;
    const selectionZoneCenter = selectionZoneLeft + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;
    
    // Calculate maximum allowed scroll position to prevent going past the last bar
    const lastBarCenter = (data.length - 1) * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
    const maxAllowedScroll = Math.max(0, lastBarCenter - selectionZoneCenter);
    
    // Ensure we don't scroll past the maximum allowed position
    const boundedOffsetX = Math.min(offsetX, maxAllowedScroll);
    
    // Find the bar closest to the current selection zone center
    const targetContentPosition = selectionZoneCenter + boundedOffsetX;
    const closestBarIndex = Math.round(targetContentPosition / (BAR_WIDTH + BAR_GAP));
    const barIndex = Math.min(data.length - 1, Math.max(0, closestBarIndex));
    
    // Update selected bar index to the bar closest to the selection zone
    setSelectedBarIndex(barIndex);
    
    // Calculate the perfect position to center the selected bar in the selection zone
    const selectedBarCenter = barIndex * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
    const perfectScrollPosition = selectedBarCenter - selectionZoneCenter;
    
    // Apply bounds to the perfect scroll position
    const boundedPerfectScroll = Math.min(maxAllowedScroll, Math.max(0, perfectScrollPosition));
    
    // Only adjust if there's a significant difference between current and perfect position
    if (Math.abs(boundedOffsetX - boundedPerfectScroll) > ADJUSTMENT_SENSITIVITY) {
      isAdjustingRef.current = true;
      
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({x: boundedPerfectScroll, animated: true});
        
        setTimeout(() => {
          isAdjustingRef.current = false;
        }, ANIMATION_DURATION);
      });
    }
    
    // Update visible indices based on the final scroll position
    const finalScrollPosition = Math.abs(boundedOffsetX - boundedPerfectScroll) > ADJUSTMENT_SENSITIVITY ? 
      boundedPerfectScroll : boundedOffsetX;
    
    const barsPerScreen = Math.floor((viewportWidth - RIGHT_PADDING_WIDTH) / (BAR_WIDTH + BAR_GAP));
    const startIndex = Math.max(0, Math.floor(finalScrollPosition / (BAR_WIDTH + BAR_GAP)));
    const endIndex = Math.min(data.length - 1, startIndex + barsPerScreen);
    setVisibleIndices({start: startIndex, end: endIndex});
  }, [data.length, selectionZoneLeft, viewportWidth]);
  
  // Handle bar press with consistent offset
  const handleBarPress = useCallback((index: number) => {
    if (isAdjustingRef.current) return;
    
    // Set the selected bar index
    setSelectedBarIndex(index);
    
    // Calculate the position of the bar in the content
    const barContentPosition = index * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2; // Center of bar
    
    // Calculate the current scroll offset
    const offsetX = scrollOffsetRef.current;
    
    // Convert to viewport/container position
    const barViewportPosition = barContentPosition - offsetX;
    
    // Calculate desired selection zone position (centered on bar)
    const desiredZoneLeft = barViewportPosition - SELECTION_ZONE_WIDTH / 2 + CENTERING_OFFSET;
    
    // Calculate bounds for selection zone
    const minZoneLeft = 0; // Can't go past left edge
    const maxZoneLeft = viewportWidth - RIGHT_PADDING_WIDTH - SELECTION_ZONE_WIDTH; // Can't go past right edge
    
    // Clamp the zone position within bounds
    const clampedZoneLeft = Math.max(minZoneLeft, Math.min(maxZoneLeft, desiredZoneLeft));
    
    // Position the selection zone on the clicked bar
    setSelectionZoneLeft(clampedZoneLeft);
    
  }, [viewportWidth]);
  
  useEffect(() => {
    if (viewportWidth > 0 && selectionZoneLeft === null) {
      // Position selection zone at a fixed position (right side by default)
      const rightEdgePosition = viewportWidth - RIGHT_PADDING_WIDTH - SELECTION_ZONE_WIDTH;
      setSelectionZoneLeft(rightEdgePosition);
      
      // Calculate initial scroll to position last bar in the fixed selection zone
      const targetIndex = data.length - 1;
      const barCenter = targetIndex * (BAR_WIDTH + BAR_GAP) + (BAR_WIDTH / 2);
      const selectionCenter = rightEdgePosition + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;
      const scrollToOffset = Math.max(0, barCenter - selectionCenter);
      
      // Calculate scroll bounds - don't allow scrolling past what's necessary
      const lastBarCenter = (data.length - 1) * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
      const maxAllowedScroll = Math.max(0, lastBarCenter - selectionCenter);
      const boundedScrollOffset = Math.min(maxAllowedScroll, scrollToOffset);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({x: boundedScrollOffset, animated: false});
        setSelectedBarIndex(targetIndex);
      }, RENDER_DELAY);
    }
  }, [viewportWidth, data.length, selectionZoneLeft]);
  
  // Calculate viewport width and initialize visible indices
  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setViewportWidth(width);
    
    // Initialize visible indices once we know the width
    if (width > 0) {
      const barsPerScreen = Math.floor(width / (BAR_WIDTH + BAR_GAP));
      setVisibleIndices({start: 0, end: Math.min(barsPerScreen - 1, data.length - 1)});
    }
  };
  
  return (
    <View style={[styles.container, { height }]} onLayout={handleLayout}>
      <View style={[styles.chartAreaContainer, { 
        paddingRight: RIGHT_PADDING_WIDTH,
        height: height - PADDING_TOP
      }]}>
        <ReferenceLines 
          referenceLines={referenceLines}
          animatedPositions={animatedPositions}
        />
        
        <ProgressBars
          data={data}
          selectedBarIndex={selectedBarIndex}
          dynamicMaxValue={dynamicMaxValue}
          chartHeight={chartHeight}
          contentWidth={contentWidth}
          scrollViewRef={scrollViewRef}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onBarPress={handleBarPress}
        />
        
        <SelectionZone
          selectionZoneLeft={selectionZoneLeft}
          height={height}
          paddingTop={PADDING_TOP}
          paddingBottom={PADDING_BOTTOM}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingTop: PADDING_TOP,
  },
  chartAreaContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
});

