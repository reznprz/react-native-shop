import React from 'react';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
  FontAwesome,
} from '@expo/vector-icons';
import { Image as RNImage, ImageSourcePropType } from 'react-native';
import { IconType } from 'app/navigation/screenConfigs';
import TableIconAdapter from './svg/TableIconAdapter';
import TableIconOutlineAdapter from './svg/TableIconOutlineAdapter';
import TableItemsAdapter from './svg/TableItemsAdapter';
import RestaurantAdapter from './svg/RestaurantAdapter';
import CircularImage from '../common/CircularImage';
import RupeeAdapter from './svg/RupeeAdapter';

export const ICON_TYPES = {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
  FontAwesome,
  TableIcon: TableIconAdapter,
  TableIconOutline: TableIconOutlineAdapter,
  TableItems: TableItemsAdapter,
  Restaurant: RestaurantAdapter,
  Rupee: RupeeAdapter,
  Image: RNImage,
};

interface CustomIconProps {
  type: IconType;
  name: string;
  size?: number;
  color?: string;
  iconStyle?: string;
  // Optional props for the image case:
  imageTitle?: string;
  imagePaddingTop?: number;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  type,
  name,
  size = 24,
  color = 'black',
  iconStyle = '',
  imageTitle = '',
  imagePaddingTop = 0,
}) => {
  // Check if the icon type is "Image"
  if (type === 'Image') {
    const imageSource: ImageSourcePropType = { uri: name };
    return (
      <CircularImage
        title={imageTitle}
        paddingTop={imagePaddingTop}
        fallbackImageUri={imageSource}
        titleStyle={{}}
        logoStyle={{ width: size, height: size, borderRadius: 20 }}
      />
    );
  }

  // For other icon types, retrieve the corresponding component
  const SelectedIcon = ICON_TYPES[type];
  return (
    <SelectedIcon
      name={name as keyof typeof SelectedIcon.glyphMap}
      size={size}
      color={color}
      className={iconStyle}
    />
  );
};

export default CustomIcon;
