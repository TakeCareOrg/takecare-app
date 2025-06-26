//? This component is the daily bar chart, for the differents details screens, like steps, calories, etc.
//? It's still in draft, but the idea is to have the possibility to scroll through the bars, and have a dynamic max value based on the visible bars.
//? It also has reference lines, and a buffer to avoid the bars being too close to the top of the chart.

import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, LayoutChangeEvent, Animated, TouchableOpacity } from 'react-native';
import DottedLine from '@app/components/ui/chart/dotted-line';

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
  referenceLines = [{ value: 20, label: '20%' }, { value: 30, label: '30%' }],
  buffer = 20,
  height = 150,
}: DailyBarChartProps) => {
  // Existing state
  const [visibleIndices, setVisibleIndices] = useState<{start: number, end: number}>({start: 0, end: Math.min(5, data.length - 1)});
  const [viewportWidth, setViewportWidth] = useState(0);
  const [selectedBarIndex, setSelectedBarIndex] = useState(data.length - 1);
  const [selectionZoneLeft, setSelectionZoneLeft] = useState<number | null>(null);
  
  // Add flag to prevent infinite scroll loops
  const isAdjustingRef = useRef(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  
  // Create animated values for reference lines
  const animatedPositions = useRef<Animated.Value[]>(
    referenceLines.map(() => new Animated.Value(0))
  ).current;
  
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
  
  const PADDING_TOP = 20;
  const paddingBottom = 30;
  const rightPaddingWidth = 60; // Width for label area
  const chartHeight = height - PADDING_TOP - paddingBottom;
  const CENTERING_OFFSET = 5;
  
  // Animate reference lines when dynamicMaxValue changes
  useEffect(() => {
    const animations = referenceLines.map((line, index) => {
      const position = (line.value / dynamicMaxValue) * chartHeight;
      return Animated.timing(animatedPositions[index], {
        toValue: position > chartHeight ? chartHeight : position, // Cap at chart height
        duration: 300,
        useNativeDriver: false,
      });
    });
    
    Animated.parallel(animations).start();
  }, [dynamicMaxValue, chartHeight, referenceLines, animatedPositions]);
  
  const barWidth = 30;
  const barGap = 12;
  // Add extra space for complete scrolling
  const contentWidth = data.length * (barWidth + barGap) + viewportWidth;
  
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
      const barsPerScreen = Math.floor((viewportWidth - rightPaddingWidth) / (barWidth + barGap));
      setVisibleIndices({start: 0, end: Math.min(barsPerScreen - 1, data.length - 1)});
    }
    
    const defaultPosition = viewportWidth - rightPaddingWidth - (barWidth + 12);
    const isAtDefaultPosition = Math.abs(selectionZoneLeft - defaultPosition) < 10;
    
    // Find the bar that should be centered in selection zone
    const selectionZoneCenter = selectionZoneLeft + (barWidth + 12) / 2 - CENTERING_OFFSET;
    
    // Convert selection zone center to content position
    const targetContentPosition = selectionZoneCenter + offsetX;
    
    // Find closest bar index
    const closestBarIndex = Math.round(targetContentPosition / (barWidth + barGap));
    const barIndex = Math.min(data.length - 1, Math.max(0, closestBarIndex));
    
    // Update selected bar index
    setSelectedBarIndex(barIndex);
    
    // Calculate perfect position for this bar
    const perfectBarContentPosition = barIndex * (barWidth + barGap) + barWidth / 2;
    
    // Calculate scroll needed to center bar in selection zone
    const perfectScrollPosition = perfectBarContentPosition - selectionZoneCenter;
    
    // Check scroll direction
    const isScrollingLeft = perfectScrollPosition < offsetX;
    const isScrollingRight = perfectScrollPosition > offsetX;
    
    // Detect if we're near left edge
    const isNearLeftEdge = barIndex < 3;
    const isFirstBar = barIndex === 0;
    
    // Skip adjustment conditions
    const shouldSkipAdjustment = 
      (isNearLeftEdge && isScrollingRight) || // Block right bouncing near left edge
      (isAtDefaultPosition && isScrollingRight && offsetX < 100 && barIndex > 2 && barIndex < 4);
    
    
    // Only adjust if significant difference and not undesirable bounce
    if (Math.abs(offsetX - perfectScrollPosition) > 3 && !shouldSkipAdjustment) {
      
      isAdjustingRef.current = true;
      
      requestAnimationFrame(() => {
        // Ensure scroll position is within bounds
        const maxScroll = contentWidth - viewportWidth;
        const boundedPosition = Math.min(maxScroll, Math.max(0, perfectScrollPosition));
        
        scrollViewRef.current?.scrollTo({x: boundedPosition, animated: true});
        
        setTimeout(() => {
          isAdjustingRef.current = false;
        }, 300);
      });
    } else {
      // Update visible indices if no adjustment
      const barsPerScreen = Math.floor((viewportWidth - rightPaddingWidth) / (barWidth + barGap));
      const startIndex = Math.max(0, Math.floor(offsetX / (barWidth + barGap)));
      const endIndex = Math.min(data.length - 1, startIndex + barsPerScreen);
      setVisibleIndices({start: startIndex, end: endIndex});
    }
  }, [data.length, barWidth, barGap, selectionZoneLeft, viewportWidth, rightPaddingWidth, contentWidth]);
  
  // Handle bar press with consistent offset
  const handleBarPress = useCallback((index: number) => {
    if (isAdjustingRef.current) return;
    
    // Set the selected bar index
    setSelectedBarIndex(index);
    
    // Calculate the position of the bar in the content
    const barContentPosition = index * (barWidth + barGap) + barWidth / 2; // Center of bar
    
    // Calculate the current scroll offset
    const offsetX = scrollOffsetRef.current;
    
    // Convert to viewport/container position and center the zone on the bar
    const barViewportPosition = barContentPosition - offsetX;
    
    // Position the selection zone centered on the bar in the viewport
    setSelectionZoneLeft(barViewportPosition - (barWidth + 12) / 2 + CENTERING_OFFSET); 
    
  }, [barWidth, barGap]);
  
  useEffect(() => {
    if (viewportWidth > 0 && selectionZoneLeft === null) {

      const rightEdgePosition = viewportWidth - rightPaddingWidth - (barWidth + 12);
      setSelectionZoneLeft(rightEdgePosition);
      
      // Also adjust the initial scroll position to show the rightmost bar
      // in the selection zone
      const targetIndex = data.length - 1;
      const barCenter = targetIndex * (barWidth + barGap) + (barWidth / 2);
      const selectionCenter = rightEdgePosition + (barWidth + 12) / 2;
      const scrollToOffset = barCenter - selectionCenter;
      
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({x: Math.max(0, scrollToOffset), animated: false});
        setSelectedBarIndex(targetIndex);
      }, 100);
    }
  }, [viewportWidth, rightPaddingWidth, barWidth, barGap, data.length, selectionZoneLeft]);
  
  // Calculate viewport width and initialize visible indices
  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setViewportWidth(width);
    
    // Initialize visible indices once we know the width
    if (width > 0) {
      const barsPerScreen = Math.floor(width / (barWidth + barGap));
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
        targetIndex * (barWidth + barGap) - (viewportWidth / 2) + (barWidth / 2)
      );
      
      // Add small delay to ensure rendering is complete
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({x: scrollToOffset, animated: true});
        // Update selected bar index after scrolling
        setSelectedBarIndex(targetIndex);
      }, 100);
    }
  }, [viewportWidth, data.length, barWidth, barGap]);
  
  return (
    <View style={[styles.container, { height }]} onLayout={handleLayout}>
      <View style={[styles.chartAreaContainer, { 
        paddingRight: rightPaddingWidth,
        height: height - PADDING_TOP
      }]}>
        {/* Reference lines that stop before the padding area */}
        <View style={[styles.referenceLinesContainer, { top: 0, bottom: paddingBottom }]}>
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
                  color="#3B5AFB" 
                  dotSize={1} 
                  gapSize={4} 
                  height={1} 
                />
              </Animated.View>
            );
          })}
        </View>
        
        {/* Label panel background with solid background */}
        <View style={[styles.labelBackground, {
          width: rightPaddingWidth,
          top: 0,
          bottom: paddingBottom,
          right: 0,
        }]} />
        
        {/* Reference line labels */}
        <View style={[styles.referenceLabelContainer, { top: 0, bottom: paddingBottom, right: 0 }]}>
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
                  {'> ' + line.label}
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
          snapToInterval={barWidth + barGap}
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
                <View style={[styles.barContainer, { paddingBottom }]}>
                  {/* Bar */}
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: Math.min((item.value / dynamicMaxValue) * chartHeight, chartHeight),
                        backgroundColor: item.color || (isSelected ? '#5B7BFB' : '#3B5AFB')
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
                left: selectionZoneLeft, // Dynamic position based on selected bar
                height: height - PADDING_TOP - paddingBottom,
                width: barWidth + 12,
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
    paddingTop: 20,
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
    backgroundColor: 'rgba(91, 123, 251, 0.15)', 
    top: 0,
    zIndex: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(91, 123, 251, 0.25)',
    pointerEvents: 'none', // Ensure touches pass through to bars underneath
  },
  labelBackground: {
    position: 'absolute',
    zIndex: 5,
  },
  referenceLabelContainer: {
    position: 'absolute',
    right: 0,
    width: 60, // Width for the label area
    zIndex: 6,
  },
  referenceLabelWrapper: {
    position: 'absolute',
    right: 10,
    transform: [{ translateY: -8 }], // Adjust based on the text size
  },
  referenceLabel: {
    color: 'blue',
    fontSize: 12,
    fontWeight: '500',
  },
  barContainer: {
    width: 30,
    marginHorizontal: 6,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  dayLabel: {
    color: '#888',
    fontSize: 12,
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
  },
  selectedDayLabel: {
    color: '#fff',
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

