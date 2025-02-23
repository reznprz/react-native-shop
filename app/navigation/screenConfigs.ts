import { createLazyScreen } from 'app/utils/lazyScreen';
import { IconType } from '../types/navigation';

const LazyHomeScreen = createLazyScreen(() => import('app/screens/HomeScreen'));
const LazyMenuScreen = createLazyScreen(() => import('app/screens/MenuScreen'));
const LazyQRScreen = createLazyScreen(() => import('app/screens/QrMenuScreen'));
const LazyTableScreen = createLazyScreen(() => import('app/screens/TableScreen'));
const LazyOrdersScreen = createLazyScreen(() => import('app/screens/OrdersScreen'));

/**
 * This array can be reused for both desktop (top tabs) and mobile (bottom tabs).
 */
export const tabScreenConfigs = [
  {
    name: 'Home',
    label: 'HOME',
    component: LazyHomeScreen,
    icon: 'home-outline',
    filledIcon: 'home',
    iconType: IconType.Ionicons,
  },
  {
    name: 'Menu',
    label: 'MENU',
    component: LazyMenuScreen,
    icon: 'fast-food-outline',
    filledIcon: 'fast-food',
    iconType: IconType.Ionicons,
  },
  {
    name: 'QRMenu',
    label: 'QRMENU',
    component: LazyQRScreen,
    icon: 'qr-code-outline',
    filledIcon: 'qr-code',
    iconType: IconType.Ionicons,
  },
  {
    name: 'Table',
    label: 'TABLE',
    component: LazyTableScreen,
    icon: 'chair-alt',
    filledIcon: 'chair',
    iconType: IconType.MaterialIcons,
  },
  {
    name: 'Orders',
    label: 'ORDERS',
    component: LazyOrdersScreen,
    icon: 'receipt-outline',
    filledIcon: 'receipt',
    iconType: IconType.Ionicons,
  },
];
