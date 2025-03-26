import React from 'react';
import { View, Text } from 'react-native';
import { IconType } from 'app/navigation/screenConfigs';
import CustomIcon from './CustomIcon';

type IconLabelProps = {
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  bgColor?: string;
  label?: string;
  value?: string | number;
  textColor?: string;
  subLabel?: string;
  iconType?: IconType;
  containerStyle?: string;
  labelTextSize?: string;
  applyCircularIconBg?: boolean;
  parentWidthHeight?: string;
  rounded?: string;
};

const IconLabel: React.FC<IconLabelProps> = ({
  iconName = 'table',
  iconSize = 18,
  iconColor = '',
  bgColor = 'bg-paleSkyBlue',
  label,
  value,
  textColor = 'text-gray-700',
  subLabel,
  iconType = 'FontAwesome5',
  containerStyle = 'mb-2',
  labelTextSize = 'ml-2 text-xl',
  parentWidthHeight = 'w-10 h-10',
  rounded = 'rounded-full',
  applyCircularIconBg = true,
}) => {
  iconSize = label === 'STORE' ? 18 : iconSize;

  return (
    <View className={`flex-row items-center ${containerStyle}`}>
      {applyCircularIconBg ? (
        <View
          className={`${parentWidthHeight} ${bgColor}  ${rounded} flex items-center justify-center`}
        >
          <CustomIcon type={iconType} name={iconName} size={iconSize} color={iconColor} />
        </View>
      ) : (
        <CustomIcon type={iconType} name={iconName} size={iconSize} color={iconColor} />
      )}

      {label && (
        <Text
          className={`font-semibold ml-1 ${labelTextSize} ${textColor}`}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {label} {value}
          {subLabel && <Text className="font-semibold">{subLabel}</Text>}
        </Text>
      )}
    </View>
  );
};

export default IconLabel;
