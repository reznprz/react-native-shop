import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import QrMenuScreen from "../screens/QrMenuScreen";
import OrdersScreen from "../screens/OrdersScreen";
import { TabRouteName, TabConfig, IconType } from "../types/navigation";
import TableScreen from "app/screens/TableScreen";

// Configuration for each tab
export const TAB_CONFIG: Record<TabRouteName, TabConfig> = {
  Home: {
    iconName: "home-outline",
    filledIcon: "home",
    title: "Home",
    tabBarShowLabel: true,
    iconType: IconType.Ionicons,
  },
  Menu: {
    iconName: "fast-food-outline",
    filledIcon: "fast-food",
    title: "Menu",
    tabBarShowLabel: true,
    iconType: IconType.Ionicons,
  },
  QrMenu: {
    iconName: "pizza-outline",
    filledIcon: "pizza-sharp",
    title: "QrMenu",
    tabBarShowLabel: true,
    iconType: IconType.Ionicons,
  },
  Table: {
    iconName: "chair-alt",
    filledIcon: "chair",
    title: "Table",
    tabBarShowLabel: true,
    iconType: IconType.MaterialIcons,
  },
  Orders: {
    iconName: "bag-check-outline",
    filledIcon: "bag-handle",
    title: "Orders",
    tabBarShowLabel: true,
    iconType: IconType.Ionicons,
  },
};

// Mapping of each tab to its corresponding screen component
export const TAB_SCREENS: Record<TabRouteName, React.ComponentType<any>> = {
  Home: HomeScreen,
  Menu: MenuScreen,
  QrMenu: QrMenuScreen,
  Table: TableScreen,
  Orders: OrdersScreen,
};

export enum SCREEN {
  CART = "Cart",
}
