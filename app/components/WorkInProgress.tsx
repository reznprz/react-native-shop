import React from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface WorkInProgressProps {
  title?: string;
  subtitle?: string;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap; // Use proper typing for icon names
}

const WorkInProgress: React.FC<WorkInProgressProps> = ({
  title = 'Work In Progress',
  subtitle = 'We’re working hard to bring you new features. Stay tuned!',
  iconName = 'tools',
}) => {
  return (
    <View className="flex-1 items-center justify-center">
      {/* Icon */}
      <MaterialCommunityIcons name={iconName} size={100} className="text-deepTeal" />

      {/* Title */}
      <Text className="text-2xl font-bold text-gray-700 mt-4">{title}</Text>

      {/* Subtitle */}
      <Text className="text-lg text-gray-500 mt-2 text-center px-6">{subtitle}</Text>
    </View>
  );
};

export default WorkInProgress;
