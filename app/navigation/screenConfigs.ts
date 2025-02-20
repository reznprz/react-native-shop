import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import QrMenuScreen from "../screens/QrMenuScreen";
import TableScreen from "../screens/TableScreen";
import OrdersScreen from "../screens/OrdersScreen";
import { IconType } from "../types/navigation";

/**
 * This array can be reused for both desktop (top tabs) and mobile (bottom tabs).
 */
export const tabScreenConfigs = [
  {
    name: "Home",
    label: "HOME",
    component: HomeScreen,
    icon: "home-outline",
    filledIcon: "home",
    iconType: IconType.Ionicons,
  },
  {
    name: "Menu",
    label: "MENU",
    component: MenuScreen,
    icon: "fast-food-outline",
    filledIcon: "fast-food",
    iconType: IconType.Ionicons,
  },
  {
    name: "QRMenu",
    label: "QRMENU",
    component: QrMenuScreen,
    icon: "qr-code-outline",
    filledIcon: "qr-code",
    iconType: IconType.Ionicons,
  },
  {
    name: "Table",
    label: "TABLE",
    component: TableScreen,
    icon: "chair-alt",
    filledIcon: "chair",
    iconType: IconType.MaterialIcons,
  },
  {
    name: "Orders",
    label: "ORDERS",
    component: OrdersScreen,
    icon: "receipt-outline",
    filledIcon: "receipt",
    iconType: IconType.Ionicons,
  },
];
