import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type IconLabelProps = {
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  bgColor?: string;
  label: string;
  value?: string | number;
  textColor?: string;
  subLabel?: string;
};

const IconLabel: React.FC<IconLabelProps> = ({
  iconName = 'table',
  iconSize = 14,
  iconColor = '#3B82F6',
  bgColor = 'bg-blue-100',
  label,
  value,
  textColor = 'text-gray-700',
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
