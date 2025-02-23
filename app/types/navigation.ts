import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export enum IconType {
  Ionicons = 'Ionicons',
  MaterialIcons = 'MaterialIcons',
}

type ScreenDetail = {
  screenName: string;
  screenDisplayName: string;
};

// Define an enum for screen names
export enum ScreenNames {
  CART = 'CartScreen',
  DEFAULT = 'APP',
  QR_MENU_ITEMS = 'QrMenuItemsScreen',
}

export enum ScreenDisplayNames {
  CART = 'Cart',
  DEFAULT = 'App',
  QR_MENU_ITEMS = 'Menu Items',
}

// Create a constant object for screen details
export const Screens: Record<ScreenNames, ScreenDetail> = {
  [ScreenNames.CART]: {
    screenName: ScreenNames.CART,
    screenDisplayName: ScreenDisplayNames.CART,
  },
  [ScreenNames.DEFAULT]: {
    screenName: ScreenNames.DEFAULT,
    screenDisplayName: ScreenDisplayNames.DEFAULT,
  },
  [ScreenNames.QR_MENU_ITEMS]: {
    screenName: ScreenNames.QR_MENU_ITEMS,
    screenDisplayName: ScreenDisplayNames.QR_MENU_ITEMS,
  },
};
