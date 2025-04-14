import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

interface ProgressBarProps {
  progress: number;
  height?: number;
  fillColor?: string;
  backgroundColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  fillStyle?: StyleProp<ViewStyle>;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  fillColor = '#10B981',
  backgroundColor = '#E5E7EB', // default to light gray (e.g., Tailwind gray-200)
  containerStyle,
  fillStyle,
}) => {
  return (
    <View
      style={[
        { height, backgroundColor, borderRadius: height / 2, overflow: 'hidden' },
        containerStyle,
      ]}
    >
      <View
        style={[
          { width: `${progress}%`, height, backgroundColor: fillColor, borderRadius: height / 2 },
          fillStyle,
        ]}
      />
    </View>
  );
};

export default ProgressBar;
