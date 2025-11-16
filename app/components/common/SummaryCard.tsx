import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'app/hooks/useTheme';

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
  const theme = useTheme();

  return (
    <View
      className={`flex-row p-4 rounded-lg shadow-sm border border-gray-200 ${width} justify-between`}
      style={{ backgroundColor: theme.secondaryBg }}
    >
      <View className="flex-col">
        <Text style={{ color: theme.textTertiary }} className="text-lg">
          {title}
        </Text>

        <Text className="text-2xl font-bold pl-1" style={{ color: theme.textSecondary }}>
          रु {amount}
        </Text>
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
