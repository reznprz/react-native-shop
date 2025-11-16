import React from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from 'app/hooks/useTheme';

interface WorkInProgressProps {
  title?: string;
  subtitle?: string;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
}

const WorkInProgress: React.FC<WorkInProgressProps> = ({
  title = 'Work In Progress',
  subtitle = 'We’re working hard to bring you new features. Stay tuned!',
  iconName = 'tools',
}) => {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-6">
      {/* Icon */}
      <MaterialCommunityIcons name={iconName} size={100} color={theme.secondary} />

      {/* Title */}
      <Text className="text-2xl font-bold mt-4" style={{ color: theme.textSecondary }}>
        {title}
      </Text>

      {/* Subtitle */}
      <Text className="text-lg mt-2 text-center" style={{ color: theme.textTertiary }}>
        {subtitle}
      </Text>
    </View>
  );
};

export default WorkInProgress;
