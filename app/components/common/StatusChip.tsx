import React from 'react';
import { View, Text } from 'react-native';
import CustomIcon from './CustomIcon';

type StatusChipProps = {
  status: string;
  showIcon?: boolean;
};

export function StatusChip({ status, showIcon = true }: StatusChipProps) {
  const statusStyles = {
    completed: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      icon: 'check-circle',
      iconColor: '#10B981',
      size: 'px-3 py-1 text-base',
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      icon: 'hourglass-half',
      iconColor: '#F59E0B',
      size: 'px-3 py-1 text-base',
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      icon: 'times-circle',
      iconColor: '#EF4444',
      size: 'px-3 py-1 text-base',
    },
    available: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      icon: 'check',
      iconColor: '#3B82F6',
      size: 'px-2 py-0.5 text-sm',
    },
    occupied: {
      bg: 'bg-gray-300',
      text: 'text-gray-700',
      icon: 'times',
      iconColor: '#4B5563',
      size: 'px-2 py-0.5 text-sm',
    },
    default: {
      bg: 'bg-gray-200',
      text: 'text-gray-600',
      icon: 'question-circle',
      iconColor: '#6B7280',
      size: 'px-3 py-1 text-base',
    },
  };

  // Convert status to lowercase for case-insensitive matching
  const normalizedStatus = status.toLowerCase();
  const { bg, text, icon, iconColor, size } =
    statusStyles[normalizedStatus as keyof typeof statusStyles] || statusStyles.default;

  return (
    <View className={`flex-row items-center rounded-3xl border border-gray-200 ${bg} ${size}`}>
      {showIcon && (
        <CustomIcon
          type={'FontAwesome5'}
          name={icon}
          size={14}
          iconStyle={`${text} pr-1`}
          color={iconColor}
        />
      )}
      <Text className={`font-semibold ${text}`}>{status}</Text>
    </View>
  );
}
