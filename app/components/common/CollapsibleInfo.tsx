import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { IconType } from 'app/navigation/screenConfigs';
import CustomIcon from './CustomIcon';

type CollapsibleInfoProps = {
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  label: string;
  textColor?: string;
  iconType?: IconType;
  containerStyle?: string;
  labelTextSize?: string;
  collapsibleContent?: string;
};

const CollapsibleInfo: React.FC<CollapsibleInfoProps> = ({
  iconName = 'question-circle',
  iconSize = 18,
  iconColor = '#000',
  label,
  textColor = 'text-gray-700',
  iconType = 'FontAwesome5',
  containerStyle = 'mb-2',
  labelTextSize = 'text-base',
  collapsibleContent = '',
}) => {
  const [expanded, setExpanded] = useState(false);

  // Enable LayoutAnimation for Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View className={`flex-col ${containerStyle}`}>
      {/* Row containing the icon and label on the same line */}
      <TouchableOpacity
        onPress={toggleExpand}
        accessibilityRole="button"
        accessibilityLabel={`${label} toggle`}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <CustomIcon type={iconType} name={iconName} size={iconSize} color={iconColor} />

        {/* Label next to the icon */}
        <Text className={`font-semibold ${labelTextSize} ${textColor}`} numberOfLines={1}>
          {label}
        </Text>
      </TouchableOpacity>

      {/* Collapsible content below */}
      {expanded && collapsibleContent && (
        <View className="mt-2 bg-gray-50 p-3 rounded-md border border-deepTeal shadow-sm">
          <Text className="text-gray-700 text-sm leading-relaxed">{collapsibleContent}</Text>
        </View>
      )}
    </View>
  );
};

export default CollapsibleInfo;
