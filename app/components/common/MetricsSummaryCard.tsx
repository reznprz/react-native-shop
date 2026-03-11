import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconLabel from './IconLabel';
import { IconType } from 'app/navigation/screenConfigs';
import { useTheme } from 'app/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

type MetricsSummaryCardProps = {
  icon: string;
  iconColor: string;
  title: string;
  value: string | number;
  bgColor: string;
  textColor?: string;
  subtitle?: string;
  iconType?: IconType;
  visible?: boolean;
};

export function MetricsSummaryCard({
  icon,
  iconColor,
  title,
  value,
  bgColor,
  textColor,
  subtitle,
  visible = true,
  iconType = 'Ionicons',
}: MetricsSummaryCardProps) {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(visible);

  return (
    <View
      className="p-4 pr-6 rounded-lg shadow-sm border border-gray-200 w-1/4"
      style={{ backgroundColor: theme.secondaryBg }}
    >
      <IconLabel
        label={title}
        iconType={iconType}
        iconName={icon}
        iconSize={16}
        iconColor={iconColor}
        bgColor={bgColor}
      />

      {visible ? (
        <Text
          className="text-2xl font-bold mt-1 ml-1"
          style={{ color: textColor || theme.textSecondary }}
        >
          {value}
        </Text>
      ) : (
        <>
          <View className="flex-row items-center mt-1 space-x-2">
            <Text className="text-2xl font-bold pl-1" style={{ color: theme.textSecondary }}>
              {isVisible ? `रु ${value}` : '****'}
            </Text>
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)} className="p-1">
              <Ionicons name={isVisible ? 'eye-off' : 'eye'} size={22} color={theme.buttonBg} />
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* Subtitle */}
      {subtitle && (
        <Text className="text-xs mt-1" style={{ color: theme.textSecondary }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
