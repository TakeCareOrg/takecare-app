import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';

interface DottedLineProps {
  color?: string;
  dotSize?: number;
  gapSize?: number;
  height?: number;
  style?: ViewStyle;
}

export const DottedLine = ({
  color = 'black',
  dotSize = 1,
  gapSize = 4,
  height = 2,
  style
}: DottedLineProps) => {
  return (
    <View style={[{ height }, style]}>
      <Svg height={height}>
        <Line
          x1="0"
          y1={height / 2}
          x2="100%"
          y2={height / 2}
          stroke={color}
          strokeWidth={height}
          strokeDasharray={`${dotSize},${gapSize}`}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export default DottedLine;