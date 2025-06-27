//? This component is the daily bar chart, for the differents details screens, like steps, calories, etc.
//? It's still in draft, but the idea is to have the possibility to scroll through the bars, and have a dynamic max value based on the visible bars.
//? It also has reference lines, and a buffer to avoid the bars being too close to the top of the chart.

import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, LayoutChangeEvent, Animated, TouchableOpacity } from 'react-native';
import { DottedLine } from '@app/components/ui/chart/line';
import { useColorTheme } from '@app/hooks/use-color-theme';

// Global constants
const PADDING_TOP = 20;
const PADDING_BOTTOM = 30;
const RIGHT_PADDING_WIDTH = 30; // Width for label area
const LINE_STOP_MARGIN = 10; // Gap between line end and labels
const BAR_WIDTH = 30; //? Representing the hitbox width of each bar
const BAR_GAP = 8;
const CENTERING_OFFSET = 5;
const DEFAULT_BUFFER = 20;
const DEFAULT_HEIGHT = 150;
const DEFAULT_REFERENCE_LINES = [
  { value: 20, label: '20%' }, 
  { value: 30, label: '30%' }
];
const ANIMATION_DURATION = 300;
const ADJUSTMENT_SENSITIVITY = 3;
const SELECTION_ZONE_WIDTH = BAR_WIDTH + 3;
const RENDER_DELAY = 100;

// Style constants
const BAR_ACTUAL_WIDTH = 10; //? While it's the width of the actual visible bar, not the hitbox
const BAR_BORDER_RADIUS = 5;
const LABEL_FONT_SIZE = 12;
const LABEL_BOTTOM_POSITION = 10;
const DOT_SIZE = 1;
const GAP_SIZE = 4;
const LINE_HEIGHT = 1;
const SELECTION_ZONE_BORDER_RADIUS = 8;
const Z_INDEX = {
  LABELS: 6,
  LABEL_BG: 5,
  BARS: 4,
  REFERENCE_LABELS: 15,
  };

const COLORS = {
  SELECTED_BAR: '#5B7BFB',
  NORMAL_BAR: '#3B5AFB',
  LABEL_TEXT: '#888',
  SELECTED_LABEL_TEXT: '#fff',
  SELECTION_ZONE_BG: 'rgba(79, 79, 79, 0.55)',
  REFERENCE_LABEL: 'blue',
  REFERENCE_COLOR: '#3B5AFB',
};

type BarDataItem = {
  day: string;
  value: number;
  color?: string; 
};

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

  const colors = useColorTheme();
  
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
        {/* Reference lines that stop before the padding area */}
        <View style={[styles.referenceLinesContainer, { top: 0, bottom: PADDING_BOTTOM }]}>
          {referenceLines.map((line, index) => {
            const animatedStyle = {
              bottom: animatedPositions[index]
            };
            
            return (
              <Animated.View 
                key={index} 
                style={[
                  styles.referenceLineContainer, 
                  animatedStyle
                ]}
              >
                {/* Only the dotted line, without inline label */}
                <View style={styles.dottedLineOnly}>
                  <DottedLine 
                    color={COLORS.NORMAL_BAR}
                    segmentSize={DOT_SIZE}
                    gapSize={GAP_SIZE}
                    height={LINE_HEIGHT}
                  />
                </View>
              </Animated.View>
            );
          })}
        </View>
        
        {/* Label panel background with solid background */}
        <View style={[styles.labelBackground, {
          width: RIGHT_PADDING_WIDTH,
          top: 0,
          bottom: PADDING_BOTTOM,
          right: 0,
        }]} />
        
        {/* Reference labels on the right side */}
        <View style={[styles.referenceLabelsContainer, { 
          width: RIGHT_PADDING_WIDTH,
          top: 0,
          bottom: PADDING_BOTTOM,
          right: 0,
        }]}>
          {referenceLines.map((line, index) => {
            const animatedStyle = {
              bottom: animatedPositions[index],
              transform: [{ translateY: 7 }] // Center the label on the line
            };
            
            return (
              <Animated.View 
                key={index} 
                style={[
                  styles.referenceLabelContainer, 
                  animatedStyle,
                  { backgroundColor: colors.background }
                ]}
              >
                <Text style={styles.referenceLabel}>
                  {line.label}
                </Text>
              </Animated.View>
            );
          })}
        </View>
        
        {/* Bottom border line between bars and day labels */}
        <View style={[styles.bottomBorderLine, {
          bottom: PADDING_BOTTOM,
          left: 0,
          right: RIGHT_PADDING_WIDTH,
        }]} />
        
        {/* Scrollable chart with snap behavior */}
        <ScrollView 
          ref={scrollViewRef}
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: contentWidth }}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScrollEndDrag={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          snapToInterval={BAR_WIDTH + BAR_GAP}
          decelerationRate="fast"
          bounces={false} // Désactiver le rebond élastique sur iOS
          overScrollMode="never" // Désactiver le dépassement sur Android
        >
          {data.map((item, index) => {
            const isSelected = selectedBarIndex === index;
            
            return (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.7}
                style={styles.barTouchable}
                onPress={() => handleBarPress(index)}
              >
                <View style={[styles.barContainer, { paddingBottom: PADDING_BOTTOM }]}>
                  {/* Bar */}
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: Math.min((item.value / dynamicMaxValue) * chartHeight, chartHeight),
                        backgroundColor: item.color || (isSelected ? COLORS.SELECTED_BAR : COLORS.NORMAL_BAR)
                      }
                    ]} 
                  />
                  
                  <Text style={[
                    styles.dayLabel, 
                    isSelected ? styles.selectedDayLabel : null
                  ]}>
                    {item.day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        
        {/* Selection zone with dynamic left position */}
        {selectionZoneLeft !== null && (
          <View 
            style={[
              styles.selectionZone,
              { 
                left: selectionZoneLeft, 
                height: height - PADDING_TOP - PADDING_BOTTOM,
                width: SELECTION_ZONE_WIDTH,
              }
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingTop: PADDING_TOP,
  },
  referenceLinesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  referenceLineContainer: {
    position: 'absolute',
    left: 0,
    right: RIGHT_PADDING_WIDTH + LINE_STOP_MARGIN, // Stop before the label area with margin
  },
  dottedLineOnly: {
    height: LINE_HEIGHT,
  },
  bottomBorderLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: COLORS.LABEL_TEXT,
    opacity: 0.3,
  },
  selectionZone: {
    position: 'absolute',
    backgroundColor: COLORS.SELECTION_ZONE_BG, 
    top: 0,
    borderTopLeftRadius: SELECTION_ZONE_BORDER_RADIUS,
    borderTopRightRadius: SELECTION_ZONE_BORDER_RADIUS,
    pointerEvents: 'none',
  },
  labelBackground: {
    position: 'absolute',
    zIndex: Z_INDEX.LABEL_BG,
  },
  referenceLabelsContainer: {
    position: 'absolute',
    zIndex: Z_INDEX.REFERENCE_LABELS,
  },
  referenceLabelContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    paddingRight: 4,
    height: 16, // Hauteur fixe pour le label
    justifyContent: 'center',
  },
  referenceLabel: {
    color: COLORS.REFERENCE_LABEL,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 2,
  },
  barContainer: {
    width: BAR_WIDTH,
    marginHorizontal: BAR_GAP / 2,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: BAR_ACTUAL_WIDTH,
    borderTopLeftRadius: BAR_BORDER_RADIUS,
    borderTopRightRadius: BAR_BORDER_RADIUS,
    zIndex: Z_INDEX.BARS,
  },
  dayLabel: {
    color: COLORS.LABEL_TEXT,
    fontSize: LABEL_FONT_SIZE,
    position: 'absolute',
    bottom: LABEL_BOTTOM_POSITION,
    textAlign: 'center',
  },
  selectedDayLabel: {
    color: COLORS.SELECTED_LABEL_TEXT,
    fontWeight: 'bold',
  },
  chartAreaContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  barTouchable: {
    height: '100%',
  },
});

