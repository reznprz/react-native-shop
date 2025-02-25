import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type StatusChipProps = {
  status: string;
  showIcon?: boolean;
};

export function StatusChip({ status, showIcon = true }: StatusChipProps) {
  const statusStyles = {
    Completed: { bg: 'bg-green-100', text: 'text-green-600', icon: 'check-circle' },
    Pending: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: 'hourglass-half' },
    Cancelled: { bg: 'bg-red-100', text: 'text-red-600', icon: 'times-circle' },
    Default: { bg: 'bg-gray-200', text: 'text-gray-600', icon: 'question-circle' },
  };

  const { bg, text, icon } =
    statusStyles[status as keyof typeof statusStyles] || statusStyles.Default;

  return (
    <View className={`flex-row items-center px-3 py-1 rounded-xl border border-gray-200 ${bg}`}>
      {showIcon && <FontAwesome5 name={icon} size={12} className={`${text} mr-2`} />}
      <Text className={`text-xs font-semibold ${text}`}>{status}</Text>
    </View>
  );
}
