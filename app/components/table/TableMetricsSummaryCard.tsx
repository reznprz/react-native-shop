import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type TableMetricsSummaryCardProps = {
  icon: string;
  iconColor: string;
  title: string;
  value: number;
  bgColor: string;
  textColor?: string;
};

export function TableMetricsSummaryCard({
  icon,
  iconColor,
  title,
  value,
  bgColor,
  textColor = 'text-gray-700',
}: TableMetricsSummaryCardProps) {
  return (
    <View className="bg-white p-4 pr-6 rounded-lg shadow-sm border border-gray-200 w-1/4">
      <View className="flex-row items-center mb-2">
        <View className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={14} color={iconColor} />
        </View>
        <Text className={`font-semibold ml-2 ${textColor}`}>{title}</Text>
      </View>
      <Text className="text-2xl font-bold mt-1">{value}</Text>
    </View>
  );
}
