import React, { ReactNode, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'app/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: ReactNode;
  iconBgColor?: string;
  width?: string;
  visible?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  icon,
  iconBgColor = '',
  width = 'w-1/3',
  visible = true,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(visible);

  return (
    <View
      className={`flex-row p-4 rounded-lg shadow-sm border border-gray-200 ${width} justify-between`}
      style={{ backgroundColor: theme.secondaryBg }}
    >
      <View className="flex-col">
        <Text style={{ color: theme.textTertiary }} className="text-lg">
          {title}
        </Text>

        {visible ? (
          <Text className="text-2xl font-bold pl-1" style={{ color: theme.textSecondary }}>
            रु {amount}
          </Text>
        ) : (
          <>
            <View className="flex-row items-center mt-1 space-x-2">
              <Text className="text-2xl font-bold pl-1" style={{ color: theme.textSecondary }}>
                {isVisible ? `रु ${amount}` : '****'}
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(!isVisible)} className="p-1">
                <Ionicons name={isVisible ? 'eye-off' : 'eye'} size={22} color={theme.buttonBg} />
              </TouchableOpacity>
            </View>
          </>
        )}
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
