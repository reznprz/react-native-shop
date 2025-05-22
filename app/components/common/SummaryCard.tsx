import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: ReactNode;
  iconBgColor?: string;
  width?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  icon,
  iconBgColor = '',
  width = 'w-1/3',
}) => {
  return (
    <View
      className={`flex-row bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${width} justify-between`}
    >
      <View className="flex-col ">
        <Text className="text-lg text-gray-500">{title}</Text>
        <Text className="text-2xl font-bold text-gray-800 pl-1">रु {amount}</Text>
        {/* Icon Container */}
      </View>
      <View
        className={`w-10 h-10 mt-2 items-center justify-center shadow-sm rounded-md ml-2 mr-2 ${iconBgColor}`}
      >
        {icon}
      </View>
    </View>
  );
};

export default SummaryCard;
