import React from 'react';
import { View, Text } from 'react-native';
import CustomIcon from './CustomIcon';
import { IconType } from 'app/navigation/screenConfigs';

type StatusChipProps = {
  status: string;
  showIcon?: boolean;
  hideText?: boolean;
};

export function StatusChip({ status, showIcon = true, hideText = false }: StatusChipProps) {
  const statusStyles = {
    completed: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      icon: 'check-circle',
      iconColor: '#10B981',
      iconType: 'FontAwesome5',
      size: 'px-3 py-1 text-base',
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      icon: 'hourglass-half',
      iconColor: '#F59E0B',
      iconType: 'FontAwesome5',
      size: 'px-3 py-1 text-base',
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      icon: 'times-circle',
      iconColor: '#EF4444',
      iconType: 'FontAwesome5',
      size: 'px-3 py-1 text-base',
    },
    available: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      icon: 'checkmark-circle-outline',
      iconColor: '#10B981',
      iconType: 'Ionicons',
      size: 'px-1 py-0.5 text-sm',
    },
    occupied: {
      bg: 'bg-red-100',
      text: 'text-red-500',
      icon: 'close-circle-outline',
      iconColor: '#EF4444',
      iconType: 'Ionicons',
      size: 'px-1 py-0.5 text-sm',
    },
    default: {
      bg: 'bg-gray-200',
      text: 'text-gray-600',
      icon: 'question-circle',
      iconColor: '#6B7280',
      iconType: 'FontAwesome5',
      size: 'px-3 py-1 text-base',
    },
  };

  // Convert status to lowercase for case-insensitive matching
  const normalizedStatus = status.toLowerCase();
  const { bg, text, icon, iconColor, size, iconType } =
    statusStyles[normalizedStatus as keyof typeof statusStyles] || statusStyles.default;

  return (
    <View className={`flex-row items-center rounded-3xl border border-gray-200 ${bg} ${size}`}>
      {showIcon && (
        <CustomIcon
          type={iconType as IconType}
          name={icon}
          size={14}
          iconStyle={`${text} pr-1`}
          color={iconColor}
        />
      )}
      {!hideText && <Text className={`font-semibold ${text}`}>{status}</Text>}
    </View>
  );
}
