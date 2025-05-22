import React from 'react';
import { View, Text, Pressable } from 'react-native';
import CustomIcon from '../common/CustomIcon';
import { IconType } from 'app/navigation/screenConfigs';
import IconLabel from '../common/IconLabel';

interface SettingOptionProps {
  label: string;
  icon: string;
  iconType: IconType;
  onPress: () => void;
  bgColor?: string;
  iconColor?: string;
  className?: string;
}

const SettingOption: React.FC<SettingOptionProps> = ({
  label,
  icon,
  iconType,
  onPress,
  bgColor = '',
  iconColor = '',
  className = '',
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`bg-white rounded-2xl p-4 shadow-sm items-start ${className}`}
    >
      <View className={`w-10 h-10 bg-paleSkyBlue rounded-full flex items-center justify-center`}>
        <CustomIcon type={iconType} name={icon} size={20} color={iconColor} />
      </View>

      <Text className="text-xl font-base mt-1 ml-1">{label}</Text>
    </Pressable>
  );
};

export default SettingOption;
