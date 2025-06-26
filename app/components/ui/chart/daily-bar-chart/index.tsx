//? This component is the daily bar chart, for the differents details screens, like steps, calories, etc.
//? It's still in draft, but the idea is to have the possibility to scroll through the bars, and have a dynamic max value based on the visible bars.
//? It also has reference lines, and a buffer to avoid the bars being too close to the top of the chart.

import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, LayoutChangeEvent, Animated, TouchableOpacity } from 'react-native';
import { DottedLine } from '@app/components/ui/chart/line';

// Global constants
const PADDING_TOP = 20;
const PADDING_BOTTOM = 30;
const RIGHT_PADDING_WIDTH = 30; // Width for label area
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
const POSITION_THRESHOLD = 10;
const SCROLL_THRESHOLD = 100;
const LEFT_EDGE_THRESHOLD = 3;

// Style constants
const BAR_ACTUAL_WIDTH = 10; //? While it's the width of the actual visible bar, not the hitbox
const BAR_BORDER_RADIUS = 5;
const LABEL_FONT_SIZE = 12;
const LABEL_BOTTOM_POSITION = 10;
const REFERENCE_LABEL_RIGHT = 10;
const REFERENCE_LABEL_OFFSET = -8;
const DOT_SIZE = 1;
const GAP_SIZE = 4;
const LINE_HEIGHT = 1;
const SELECTION_ZONE_BORDER_RADIUS = 8;
const Z_INDEX = {
  LABELS: 6,
  LABEL_BG: 5,
  BARS: 4,
  };
const COLORS = {
  SELECTED_BAR: '#5B7BFB',
  NORMAL_BAR: '#3B5AFB',
  LABEL_TEXT: '#888',
  SELECTED_LABEL_TEXT: '#fff',
  SELECTION_ZONE_BG: 'rgba(79, 79, 79, 0.55)',
  REFERENCE_LABEL: 'blue',
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
  const contentWidth = data.length * (BAR_WIDTH + BAR_GAP) + viewportWidth;
  
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
  
  // Track scrolling position without changing selection zone
  const handleScroll = useCallback((event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollOffsetRef.current = offsetX;
  }, []);
  
  // End of scroll - find bar closest to selection zone and center it
  const handleMomentumScrollEnd = useCallback((event?: any) => {
    if (isAdjustingRef.current || selectionZoneLeft === null) {
      return;
    }
    
    const offsetX = event ? event.nativeEvent.contentOffset.x : scrollOffsetRef.current;
    
    // Handle special case when at left edge
    if (offsetX <= 0) {
      
      // Set first bar as selected
      setSelectedBarIndex(0);
      
      // Update visible indices
      const barsPerScreen = Math.floor((viewportWidth - RIGHT_PADDING_WIDTH) / (BAR_WIDTH + BAR_GAP));
      setVisibleIndices({start: 0, end: Math.min(barsPerScreen - 1, data.length - 1)});
    }
    
    const defaultPosition = viewportWidth - RIGHT_PADDING_WIDTH - SELECTION_ZONE_WIDTH;
    const isAtDefaultPosition = Math.abs(selectionZoneLeft - defaultPosition) < POSITION_THRESHOLD;
    
    // Find the bar that should be centered in selection zone
    const selectionZoneCenter = selectionZoneLeft + SELECTION_ZONE_WIDTH / 2 - CENTERING_OFFSET;
    
    // Convert selection zone center to content position
    const targetContentPosition = selectionZoneCenter + offsetX;
    
    // Find closest bar index
    const closestBarIndex = Math.round(targetContentPosition / (BAR_WIDTH + BAR_GAP));
    const barIndex = Math.min(data.length - 1, Math.max(0, closestBarIndex));
    
    // Update selected bar index
    setSelectedBarIndex(barIndex);
    
    // Calculate perfect position for this bar
    const perfectBarContentPosition = barIndex * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
    
    // Calculate scroll needed to center bar in selection zone
    const perfectScrollPosition = perfectBarContentPosition - selectionZoneCenter;
    
    // Check scroll direction
    const isScrollingLeft = perfectScrollPosition < offsetX;
    const isScrollingRight = perfectScrollPosition > offsetX;
    
    // Detect if we're near left edge
    const isNearLeftEdge = barIndex < LEFT_EDGE_THRESHOLD;
    const isFirstBar = barIndex === 0;
    
    // Skip adjustment conditions
    const shouldSkipAdjustment = 
      (isNearLeftEdge && isScrollingRight) || // Block right bouncing near left edge
      (isAtDefaultPosition && isScrollingRight && offsetX < SCROLL_THRESHOLD && barIndex > 2 && barIndex < 4);
    
    
    // Only adjust if significant difference and not undesirable bounce
    if (Math.abs(offsetX - perfectScrollPosition) > ADJUSTMENT_SENSITIVITY && !shouldSkipAdjustment) {
      
      isAdjustingRef.current = true;
      
      requestAnimationFrame(() => {
        // Ensure scroll position is within bounds
        const maxScroll = contentWidth - viewportWidth;
        const boundedPosition = Math.min(maxScroll, Math.max(0, perfectScrollPosition));
        
        scrollViewRef.current?.scrollTo({x: boundedPosition, animated: true});
        
        setTimeout(() => {
          isAdjustingRef.current = false;
        }, ANIMATION_DURATION);
      });
    } else {
      // Update visible indices if no adjustment
      const barsPerScreen = Math.floor((viewportWidth - RIGHT_PADDING_WIDTH) / (BAR_WIDTH + BAR_GAP));
      const startIndex = Math.max(0, Math.floor(offsetX / (BAR_WIDTH + BAR_GAP)));
      const endIndex = Math.min(data.length - 1, startIndex + barsPerScreen);
      setVisibleIndices({start: startIndex, end: endIndex});
    }
  }, [data.length, selectionZoneLeft, viewportWidth, contentWidth]);
  
  // Handle bar press with consistent offset
  const handleBarPress = useCallback((index: number) => {
    if (isAdjustingRef.current) return;
    
    // Set the selected bar index
    setSelectedBarIndex(index);
    
    // Calculate the position of the bar in the content
    const barContentPosition = index * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2; // Center of bar
    
    // Calculate the current scroll offset
    const offsetX = scrollOffsetRef.current;
    
    // Convert to viewport/container position and center the zone on the bar
    const barViewportPosition = barContentPosition - offsetX;
    
    // Position the selection zone centered on the bar in the viewport
    setSelectionZoneLeft(barViewportPosition - SELECTION_ZONE_WIDTH / 2 + CENTERING_OFFSET); 
    
  }, []);
  
  useEffect(() => {
    if (viewportWidth > 0 && selectionZoneLeft === null) {

      const rightEdgePosition = viewportWidth - RIGHT_PADDING_WIDTH - SELECTION_ZONE_WIDTH;
      setSelectionZoneLeft(rightEdgePosition);
      
      // Also adjust the initial scroll position to show the rightmost bar
      // in the selection zone
      const targetIndex = data.length - 1;
      const barCenter = targetIndex * (BAR_WIDTH + BAR_GAP) + (BAR_WIDTH / 2);
      const selectionCenter = rightEdgePosition + SELECTION_ZONE_WIDTH / 2;
      const scrollToOffset = barCenter - selectionCenter;
      
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({x: Math.max(0, scrollToOffset), animated: false});
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
  
  // Scroll to the rightmost bar on initial render
  useEffect(() => {
    if (scrollViewRef.current && viewportWidth > 0) {
      // Calculate position to scroll to (rightmost bar minus half viewport)
      const targetIndex = data.length - 1;
      const scrollToOffset = Math.max(
        0, 
        targetIndex * (BAR_WIDTH + BAR_GAP) - (viewportWidth / 2) + (BAR_WIDTH / 2)
      );
      
      // Add small delay to ensure rendering is complete
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({x: scrollToOffset, animated: true});
        // Update selected bar index after scrolling
        setSelectedBarIndex(targetIndex);
      }, RENDER_DELAY);
    }
  }, [viewportWidth, data.length]);
  
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
                <DottedLine 
                  color={COLORS.NORMAL_BAR}
                  segmentSize={DOT_SIZE}
                  gapSize={GAP_SIZE}
                  height={LINE_HEIGHT}
                />
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
        
        {/* Reference line labels */}
        <View style={[styles.referenceLabelContainer, { top: 0, bottom: PADDING_BOTTOM, right: 0 }]}>
          {referenceLines.map((line, index) => {
            const animatedStyle = {
              bottom: animatedPositions[index]
            };
            
            return (
              <Animated.View 
                key={index} 
                style={[
                  styles.referenceLabelWrapper, 
                  animatedStyle
                ]}
              >
                <Text style={styles.referenceLabel}>
                  {line.label}
                </Text>
              </Animated.View>
            );
          })}
        </View>
        
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
    right: 0,
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
  referenceLabelContainer: {
    position: 'absolute',
    right: 0,
    width: RIGHT_PADDING_WIDTH,
    zIndex: Z_INDEX.LABELS,
  },
  referenceLabelWrapper: {
    position: 'absolute',
    right: REFERENCE_LABEL_RIGHT,
    transform: [{ translateY: REFERENCE_LABEL_OFFSET }],
  },
  referenceLabel: {
    color: COLORS.REFERENCE_LABEL,
    fontSize: LABEL_FONT_SIZE,
    fontWeight: '500',
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

