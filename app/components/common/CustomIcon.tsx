import React from 'react';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
} from '@expo/vector-icons';
import { Image as RNImage, ImageSourcePropType } from 'react-native';
import { IconType } from 'app/navigation/screenConfigs';
import TableIconAdapter from './svg/TableIconAdapter';
import TableIconOutlineAdapter from './svg/TableIconOutlineAdapter';
import TableItemsAdapter from './svg/TableItemsAdapter';
import RestaurantAdapter from './svg/RestaurantAdapter';
import CircularImage from '../common/CircularImage';
import RupeeAdapter from './svg/RupeeAdapter';
import RegisterAdapter from './svg/RegisterAdapter';
import MomoAdapter from './svg/MomoAdapter';
import WingsAdapter from './svg/WingsAdapter';
import CigaretteAdapter from './svg/CigaretteAdapter';
import RiceAdapter from './svg/RiceAdapter';
import NoodlesAdapter from './svg/NoodlesAdapter';

export const ICON_TYPES = {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
  TableIcon: TableIconAdapter,
  TableIconOutline: TableIconOutlineAdapter,
  TableItems: TableItemsAdapter,
  Restaurant: RestaurantAdapter,
  Rupee: RupeeAdapter,
  Register: RegisterAdapter,
  Momo: MomoAdapter,
  Wings: WingsAdapter,
  Cigarette: CigaretteAdapter,
  Rice: RiceAdapter,
  Noodles: NoodlesAdapter,
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
  validate?: boolean;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  type,
  name,
  size = 24,
  color = 'black',
  iconStyle = '',
  imageTitle = '',
  validate = false,
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
  let SelectedIcon = ICON_TYPES[type];

  // Validate if the provided icon name exists in the icon's glyphMap.
  if (validate) {
    if (
      !SelectedIcon.glyphMap ||
      !Object.prototype.hasOwnProperty.call(SelectedIcon.glyphMap, name)
    ) {
      console.warn(
        `"${name}" is not a valid icon name for family "${type}". Falling back to default icon configuration.`,
      );
      // Fallback to default configuration.
      SelectedIcon = ICON_TYPES.Ionicons;
      name = 'restaurant';
    }
  }

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
