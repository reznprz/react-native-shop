import React from 'react';
import { View, Text } from 'react-native';
import CustomIcon from './CustomIcon';
import { IconType } from 'app/navigation/screenConfigs';

type StatusChipProps = {
  status: string;
  showIcon?: boolean;
  hideText?: boolean;
  margin?: string;
  applyBg?: boolean;
  customSize?: string;
  textSize?: string;
};

export function StatusChip({
  status,
  showIcon = true,
  hideText = false,
  margin = '',
  applyBg = true,
  textSize = '',
  customSize,
}: StatusChipProps) {
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
    created: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      icon: 'hourglass-half',
      iconColor: '#F59E0B',
      iconType: 'FontAwesome5',
      size: 'px-3 py-1 text-base',
    },
    canceled: {
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
    unpaid: {
      bg: 'bg-red-100',
      text: 'text-red-500',
      icon: 'close-circle-outline',
      iconColor: '#EF4444',
      iconType: 'Ionicons',
      size: 'px-1 py-0.5 text-sm',
    },
    paid: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      icon: 'checkmark-circle-outline',
      iconColor: '#10B981',
      iconType: 'Ionicons',
      size: 'px-1 py-0.5 text-sm',
    },
    tourist: {
      bg: 'bg-[#a0c4dc]',
      text: 'text-black-200',
      icon: 'earth-outline',
      iconColor: 'black',
      iconType: 'Ionicons',
      size: 'px-3 py-2 text-sm mb-6',
    },
    primary: {
      bg: 'bg-green-100',
      text: 'text-green-600 text-center',
      icon: 'checkmark-circle-outline',
      iconColor: '#10B981', // Emerald 500
      iconType: 'Ionicons',
      size: 'mt-1 px-1 py-0.5 text-sm',
    },
    active: {
      bg: 'bg-blue-100',
      text: 'text-blue-600 text-center',
      icon: 'flash-outline',
      iconColor: '#3B82F6', // Blue 500
      iconType: 'Ionicons',
      size: 'mt-1 px-1 py-0.5 text-sm',
    },
    inactive: {
      bg: 'bg-gray-100',
      text: 'text-gray-500 text-center',
      icon: 'pause-circle-outline',
      iconColor: '#9CA3AF', // Gray 400
      iconType: 'Ionicons',
      size: 'mt-1 px-1 py-0.5 text-sm',
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

  const normalizedStatus = (status && status.toLowerCase()) || '';
  const { bg, text, icon, iconColor, size, iconType } =
    statusStyles[normalizedStatus as keyof typeof statusStyles] || statusStyles.default;

  const bgClass = applyBg ? `${bg} rounded-3xl border border-gray-200` : '';

  const sizeClass = customSize ? `${customSize}` : `${size}`;

  return (
    <View className={`flex-row items-center ${margin} ${bgClass} ${sizeClass}`}>
      {showIcon && (
        <CustomIcon
          type={iconType as IconType}
          name={icon}
          size={14}
          iconStyle={`${text} pr-1`}
          color={iconColor}
        />
      )}
      {!hideText && <Text className={`font-semibold ${textSize} ${text}`}>{status}</Text>}
    </View>
  );
}
