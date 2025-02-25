import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type SummaryCardProps = {
  icon: string;
  iconColor: string;
  title: string;
  value: number;
};

export function SummaryCard({ icon, iconColor, title, value }: SummaryCardProps) {
  return (
    <View className="bg-white rounded-lg shadow-md p-4 w-40 flex items-center">
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={iconColor} />
      <Text className="text-gray-600 mt-2">{title}</Text>
      <Text className="text-2xl font-bold mt-1">{value}</Text>
    </View>
  );
}
