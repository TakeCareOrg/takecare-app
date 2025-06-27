import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  BAR_WIDTH,
  BAR_GAP,
  BAR_ACTUAL_WIDTH,
  BAR_BORDER_RADIUS,
  LABEL_FONT_SIZE,
  LABEL_BOTTOM_POSITION,
  PADDING_BOTTOM,
  Z_INDEX,
  COLORS,
} from './constants';

export interface BarDataItem {
  day: string;
  value: number;
  color?: string; 
}

interface ProgressBarsProps {
  data: BarDataItem[];
  selectedBarIndex: number;
  dynamicMaxValue: number;
  chartHeight: number;
  contentWidth: number;
  scrollViewRef: React.RefObject<ScrollView | null>;
  onScroll: (event: any) => void;
  onMomentumScrollEnd: (event?: any) => void;
  onBarPress: (index: number) => void;
}

export const ProgressBars: React.FC<ProgressBarsProps> = ({
  data,
  selectedBarIndex,
  dynamicMaxValue,
  chartHeight,
  contentWidth,
  scrollViewRef,
  onScroll,
  onMomentumScrollEnd,
  onBarPress,
}) => {
  return (
    <ScrollView 
      ref={scrollViewRef}
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ width: contentWidth }}
      onScroll={onScroll}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onScrollEndDrag={onMomentumScrollEnd}
      scrollEventThrottle={16}
      snapToInterval={BAR_WIDTH + BAR_GAP}
      decelerationRate="fast"
      bounces={false}
      overScrollMode="never"
    >
      {data.map((item, index) => {
        const isSelected = selectedBarIndex === index;
        
        return (
          <TouchableOpacity 
            key={index} 
            activeOpacity={0.7}
            style={styles.barTouchable}
            onPress={() => onBarPress(index)}
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
  );
};

const styles = StyleSheet.create({
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
  barTouchable: {
    height: '100%',
  },
});
