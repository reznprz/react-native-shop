import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type IconLabelProps = {
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  bgColor?: string; // Tailwind class for background color (e.g., "bg-blue-100")
  label: string; // e.g., "Seats:"
  value?: string | number;
  textColor?: string; // Tailwind class for text color (e.g., "text-gray-700")
  subLabel?: string;
};

const IconLabel: React.FC<IconLabelProps> = ({
  iconName = 'table', // Default icon name "table"
  iconSize = 14, // Default icon size 14
  iconColor = '#3B82F6', // Default icon color
  bgColor = 'bg-blue-100', // Default bg color class
  label, // Default label text
  value,
  textColor = 'text-gray-700', // Default text color class
  subLabel,
}) => {
  return (
    <View className="flex-row items-center mb-2">
      <View className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
        <FontAwesome5 name={iconName} size={iconSize} color={iconColor} />
      </View>
      <Text className={`font-semibold ml-2 ${textColor}`}>
        {label} {value}
        {subLabel && <Text className="font-semibold">{subLabel}</Text>}
      </Text>
    </View>
  );
};

export default IconLabel;
