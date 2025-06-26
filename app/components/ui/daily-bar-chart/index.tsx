//? This component is the daily bar chart, for the differents details screens, like steps, calories, etc.
//? It's still in draft, but the idea is to have the possibility to scroll through the bars, and have a dynamic max value based on the visible bars.
//? It also has reference lines, and a buffer to avoid the bars being too close to the top of the chart.


import React, { useMemo, useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, LayoutChangeEvent } from 'react-native';
import DottedLine from '@app/components/ui/dotted-line';

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
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  
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
    // Use individual properties instead of the entire object for better dependency tracking
    visibleIndices.start, 
    visibleIndices.end
  ]);
  
  const PADDING_TOP = 20;
  const paddingBottom = 30;
  const chartHeight = height - PADDING_TOP - paddingBottom;
  
  const barWidth = 30;
  const barGap = 12;
  const contentWidth = data.length * (barWidth + barGap);
  
  // Track scrolling position without triggering re-render
  const handleScroll = useCallback((event: any) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
  }, []);
  
  // Calculate visible indices only at the end of scrolling
  const handleMomentumScrollEnd = useCallback(() => {
    const offsetX = scrollOffsetRef.current;
    const visibleWidth = viewportWidth;
    
    const barsPerScreen = Math.floor(visibleWidth / (barWidth + barGap));
    const startIndex = Math.max(0, Math.floor(offsetX / (barWidth + barGap)));
    const endIndex = Math.min(data.length - 1, startIndex + barsPerScreen);
    
    console.log(`Scroll ended - Visible indices: ${startIndex} to ${endIndex}`);
    
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
  
  return (
    <View style={[styles.container, { height }]} onLayout={handleLayout}>
      {/* Reference lines */}
      <View style={[styles.referenceLinesContainer, { top: PADDING_TOP, bottom: paddingBottom }]}>
        {referenceLines.map((line, index) => {
          const position = (line.value / dynamicMaxValue) * chartHeight;
          
          if (position > chartHeight) return null;
          
          return (
            <View 
              key={index} 
              style={[
                styles.referenceLineContainer, 
                { bottom: position }
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
            </View>
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
      >
        {data.map((item, index) => (
          <View key={index} style={[styles.barContainer, { paddingBottom }]}>
            <View 
              style={[
                styles.bar, 
                { 
                  height: Math.min((item.value / dynamicMaxValue) * chartHeight, chartHeight),
                  backgroundColor: item.color || '#3B5AFB'
                }
              ]} 
            />
            
            <Text style={styles.dayLabel}>{item.day}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
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
  }
});