import Ionicons from "@expo/vector-icons/Ionicons";

export type TabRouteName = "Home" | "Menu" | "QrMenu" | "Cart" | "Orders";

export type TabConfig = {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  filledIcon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  tabBarShowLabel: boolean;
};

// Param list for BottomTabNavigator
export type TabParamList = {
  Home: undefined;
  Menu: undefined;
  QrMenu: undefined;
  Cart: undefined;
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
    "Cart",
    "Orders",
  ];
  return !validRoutes.includes(routeName as TabRouteName);
}
