import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';

interface DashedLineProps {
  color?: string;
  dashSize?: number;
  gapSize?: number;
  height?: number;
  style?: ViewStyle;
}

export const DashedLine = ({
  color = 'black',
  dashSize = 4,
  gapSize = 4,
  height = 2,
  style
}: DashedLineProps) => {
  return (
    <View style={[{ height }, style]}>
      <Svg height={height} width="100%">
        <Line
          x1="0"
          y1={height / 2}
          x2="100%"
          y2={height / 2}
          stroke={color}
          strokeWidth={height}
          strokeDasharray={`${dashSize},${gapSize}`}
        />
      </Svg>
    </View>
  );
}

export default DashedLine;