import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type OrderMetricsSummaryCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  textColor?: string;
};

const OrderMetricsSummaryCard: React.FC<OrderMetricsSummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  bgColor,
  textColor = 'text-gray-700',
}) => {
  return (
    <View className="bg-white p-4 pr-6 rounded-lg shadow-sm border border-gray-200 w-1/4">
      {/* Title and Icon */}
      <View className="flex-row items-center mb-2">
        <View className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
          <FontAwesome5 name={icon} size={14} color={iconColor} />
        </View>
        <Text className={`font-semibold ml-2 ${textColor}`}>{title}</Text>
      </View>

      {/* Value */}
      <Text className="text-2xl font-bold">{value}</Text>

      {/* Subtitle */}
      <Text className="text-xs mt-1">{subtitle}</Text>
    </View>
  );
};

export default OrderMetricsSummaryCard;
