import React from 'react';
import { View, Text } from 'react-native';
import IconLabel from './IconLabel';
import { IconType } from 'app/navigation/screenConfigs';
import { useTheme } from 'app/hooks/useTheme';

type MetricsSummaryCardProps = {
  icon: string;
  iconColor: string;
  title: string;
  value: string | number;
  bgColor: string;
  textColor?: string;
  subtitle?: string;
  iconType?: IconType;
};

export function MetricsSummaryCard({
  icon,
  iconColor,
  title,
  value,
  bgColor,
  textColor,
  subtitle,
  iconType = 'Ionicons',
}: MetricsSummaryCardProps) {
  const theme = useTheme();

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
      <Text
        className="text-2xl font-bold mt-1 ml-1"
        style={{ color: textColor || theme.textSecondary }}
      >
        {value}
      </Text>
      {/* Subtitle */}
      {subtitle && (
        <Text className="text-xs mt-1" style={{ color: theme.textSecondary }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
