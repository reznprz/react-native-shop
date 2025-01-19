import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type TabRouteName = "Home" | "Menu" | "QrMenu" | "Table" | "Orders";

export enum IconType {
  Ionicons = "Ionicons",
  MaterialIcons = "MaterialIcons",
}

export type TabConfig = {
  iconName:
    | React.ComponentProps<typeof Ionicons>["name"]
    | React.ComponentProps<typeof MaterialIcons>["name"];
  filledIcon:
    | React.ComponentProps<typeof Ionicons>["name"]
    | React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  tabBarShowLabel: boolean;
  iconType: IconType;
};

// Param list for BottomTabNavigator
export type TabParamList = {
  Home: undefined;
  Menu: undefined;
  QrMenu: undefined;
  Table: undefined;
  Orders: undefined;
};

// Param list for RootNavigator
export type StackParamList = {
  BottomTabs: undefined;
  MenuItemsDisplay: { subCategory: string };
};

/**
 * Function to check if a given string is not a valid TabRouteName.
 * @param routeName - The string to check.
 * @returns `true` if the string is not a TabRouteName, otherwise `false`.
 */
export function isNotTabRouteName(routeName: string): boolean {
  const validRoutes: TabRouteName[] = [
    "Home",
    "Menu",
    "QrMenu",
    "Table",
    "Orders",
  ];
  return !validRoutes.includes(routeName as TabRouteName);
}

type ScreenDetail = {
  screenName: string;
  screenDisplayName: string;
};

// Define an enum for screen names
export enum ScreenNames {
  CART = "CartScreen",
  DEFAULT = "APP",
  QR_MENU_ITEMS = "QrMenuItemsScreen",
}

export enum ScreenDisplayNames {
  CART = "Cart",
  DEFAULT = "App",
  QR_MENU_ITEMS = "Menu Items",
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
