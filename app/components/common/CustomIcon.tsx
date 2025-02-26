import React from 'react';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

// Define the possible icon sets
export const ICON_TYPES = {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
};

interface CustomIconProps {
  type: keyof typeof ICON_TYPES;
  name: string;
  size?: number;
  color?: string;
  iconStyle?: string;
}

// Reusable CustomIcon Component
const CustomIcon: React.FC<CustomIconProps> = ({
  type,
  name,
  size = 24,
  color = 'black',
  iconStyle = '',
}) => {
  const SelectedIcon = ICON_TYPES[type];

  return (
    <SelectedIcon
      name={name as keyof typeof SelectedIcon.glyphMap}
      size={size}
      color={color}
      className={`${iconStyle}`}
    />
  );
};

export default CustomIcon;
