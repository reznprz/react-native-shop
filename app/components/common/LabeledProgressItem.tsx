import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import ProgressBar from '../common/ProgressBar';

interface LabeledProgressItemProps {
  label: string;
  valueText: string;
  percentage: number;
  fillColor?: string;
  pbContainerStyle?: StyleProp<ViewStyle>;
}

const LabeledProgressItem: React.FC<LabeledProgressItemProps> = ({
  label,
  valueText,
  percentage,
  fillColor = '#10B981', // Default green
  pbContainerStyle,
}) => {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1" style={pbContainerStyle}>
        <Text className="text-gray-800">{label}</Text>
        <Text className="text-gray-800">{valueText}</Text>
      </View>
      <ProgressBar
        progress={percentage}
        fillColor={fillColor}
        height={8}
        containerStyle={pbContainerStyle}
      />
    </View>
  );
};

export default LabeledProgressItem;
