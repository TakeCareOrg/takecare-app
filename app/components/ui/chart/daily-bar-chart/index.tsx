//? This component is the daily bar chart, for the differents details screens, like steps, calories, etc.
//? It's still in draft, but the idea is to have the possibility to scroll through the bars, and have a dynamic max value based on the visible bars.
//? It also has reference lines, and a buffer to avoid the bars being too close to the top of the chart.

import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, LayoutChangeEvent, Animated } from 'react-native';
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
  const [visibleIndices, setVisibleIndices] = useState<{start: number, end: number}>({start: 0, end: Math.min(5, data.length - 1)});
  const [viewportWidth, setViewportWidth] = useState(0);
  const [selectedBarIndex, setSelectedBarIndex] = useState(data.length - 1); // Start with rightmost bar selected
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  
  // Create animated values for reference lines
  const animatedPositions = useRef<Animated.Value[]>(
    referenceLines.map(() => new Animated.Value(0))
  ).current;
  
  // Calculate maximum value based on visible bars only
  const dynamicMaxValue = useMemo(() => {
    if (providedMaxValue) {
      console.log("Using provided max value:", providedMaxValue);
      return providedMaxValue;
    }
    
    // Extract visible data
    const visibleData = data.slice(visibleIndices.start, visibleIndices.end + 1);
    
    // Find maximum value in visible data
    const highestValue = Math.max(...visibleData.map(item => item.value), 1);
    console.log(`Recalculating - Highest value in visible data: ${highestValue}`);
    
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
  const chartHeight = height - PADDING_TOP - paddingBottom;
  
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
  const contentWidth = data.length * (barWidth + barGap);
  
  // Track scrolling position without triggering re-render
  const handleScroll = useCallback((event: any) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
  }, []);
  
  // Calculate visible indices and determine which bar is in the selection zone
  const handleMomentumScrollEnd = useCallback((event?: any) => {
    const offsetX = event ? event.nativeEvent.contentOffset.x : scrollOffsetRef.current;
    const visibleWidth = viewportWidth;
    
    // Calculate the visible indices
    const barsPerScreen = Math.floor(visibleWidth / (barWidth + barGap));
    const startIndex = Math.max(0, Math.floor(offsetX / (barWidth + barGap)));
    const endIndex = Math.min(data.length - 1, startIndex + barsPerScreen);
    
    console.log(`Scroll ended - Visible indices: ${startIndex} to ${endIndex}`);
    
    // Define the selection zone position (80% of the screen width from the left)
    const selectionZoneX = offsetX + (visibleWidth * 0.8);
    
    // Find which bar is closest to the selection zone
    const barInSelectionZone = Math.min(
      data.length - 1,
      Math.round(selectionZoneX / (barWidth + barGap))
    );
    
    // Update the selected bar
    setSelectedBarIndex(barInSelectionZone);
    
    // Use callback to ensure update is processed correctly
    setVisibleIndices(prev => {
      if (prev.start === startIndex && prev.end === endIndex) {
        return prev; // Avoid unnecessary updates
      }
      return {start: startIndex, end: endIndex};
    });
  }, [viewportWidth, data.length, barWidth, barGap]);
  
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
      {/* Reference lines */}
      <View style={[styles.referenceLinesContainer, { top: PADDING_TOP, bottom: paddingBottom }]}>
        {referenceLines.map((line, index) => {
          // Use animated position for each line
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
              <Text style={styles.referenceLabel}>
                {line.label}
              </Text>
            </Animated.View>
          );
        })}
      </View>
      
      {/* Scrollable chart */}
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: contentWidth }}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollEndDrag={handleMomentumScrollEnd} // For slow scrolling without inertia
        scrollEventThrottle={16}
        snapToInterval={barWidth + barGap} // Snap to each bar
        decelerationRate="fast" // Fast deceleration for better snapping
      >
        {data.map((item, index) => {
          const isSelected = selectedBarIndex === index;
          
          return (
            <View key={index} style={[styles.barContainer, { paddingBottom }]}>
              {/* Selection indicator */}
              {isSelected && (
                <View style={styles.selectionIndicator} />
              )}
              
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
                isSelected && styles.selectedDayLabel
              ]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </ScrollView>
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
  referenceLabel: {
    position: 'absolute',
    right: 10,
    top: -10,
    color: '#3B5AFB',
    fontSize: 10,
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
  selectionIndicator: {
    position: 'absolute',
    width: 42,
    height: '100%',
    backgroundColor: 'rgba(59, 90, 251, 0.1)',
    borderRadius: 8,
    bottom: 0,
    zIndex: -1,
  },
});