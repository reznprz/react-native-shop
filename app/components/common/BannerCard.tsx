import React from 'react';
import { View, Text } from 'react-native';
import CustomIcon from './CustomIcon';
import { IconMetadata } from 'app/api/services/expenseService';
import { IconType } from 'app/navigation/screenConfigs';

type BannerCardProps = {
  primaryTitle: string;
  secondaryTitle?: string;
  iconDetails?: IconMetadata;
  primaryTitleTextColor: string;
  cardBackgroundColor?: string;
  cardStyle?: string;
};

const BannerCard: React.FC<BannerCardProps> = ({
  primaryTitle,
  secondaryTitle,
  iconDetails,
  primaryTitleTextColor,
  cardBackgroundColor = 'bg-emerald-50 border-emerald-200',
  cardStyle = 'p-4 mb-4 mt-4',
}) => {
  return (
    <View
      className={`flex-row items-start gap-3 rounded-xl shadow-sm border  ${cardBackgroundColor} ${
        cardStyle
      }`}
    >
      {iconDetails && (
        <CustomIcon
          type={iconDetails.iconType as IconType}
          name={iconDetails.iconName}
          size={20}
          color={iconDetails.filledColor}
          iconStyle="mt-2"
        />
      )}

      <View className="flex-1">
        <Text className={`text-sm font-medium ${primaryTitleTextColor}`}>{primaryTitle}</Text>
        {secondaryTitle && (
          <Text className="text-xs text-gray-600 mt-1">
            <Text className="font-medium text-gray-800">{secondaryTitle}</Text>
          </Text>
        )}
      </View>
    </View>
  );
};

export default BannerCard;
