import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import QrMenuScreen from "../screens/QrMenuScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import { TabRouteName, TabConfig } from "../types/navigation";

// Configuration for each tab
export const TAB_CONFIG: Record<TabRouteName, TabConfig> = {
  Home: {
    iconName: "home-outline",
    filledIcon: "home",
    title: "Home",
    tabBarShowLabel: true,
  },
  Menu: {
    iconName: "fast-food-outline",
    filledIcon: "fast-food",
    title: "Menu",
    tabBarShowLabel: true,
  },
  QrMenu: {
    iconName: "pizza-outline",
    filledIcon: "pizza-sharp",
    title: "QrMenu",
    tabBarShowLabel: true,
  },
  Cart: {
    iconName: "cart-outline",
    filledIcon: "cart",
    title: "Cart",
    tabBarShowLabel: true,
  },
  Orders: {
    iconName: "bag-check-outline",
    filledIcon: "bag-handle",
    title: "Orders",
    tabBarShowLabel: true,
  },
};

// Mapping of each tab to its corresponding screen component
export const TAB_SCREENS: Record<TabRouteName, React.ComponentType<any>> = {
  Home: HomeScreen,
  Menu: MenuScreen,
  QrMenu: QrMenuScreen,
  Cart: CartScreen,
  Orders: OrdersScreen,
};
