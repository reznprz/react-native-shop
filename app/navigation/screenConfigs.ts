import { createLazyScreen } from 'app/utils/lazyScreen';
import { ICON_TYPES } from 'app/components/common/CustomIcon';

const LazyHomeScreen = createLazyScreen(() => import('app/screens/HomeScreen'));
const LazyMenuScreen = createLazyScreen(() => import('app/screens/MenuScreen'));
const LazyTableScreen = createLazyScreen(() => import('app/screens/TableScreen'));
const LazyOrdersScreen = createLazyScreen(() => import('app/screens/OrdersScreen'));
const LazyAccountScreen = createLazyScreen(() => import('app/screens/AccountScreen'));

export type IconType = keyof typeof ICON_TYPES;

interface TabScreenConfig {
  name: string;
  label: string;
  component: React.ComponentType<any>;
  icon: string;
  filledIcon: string;
  iconType: IconType;
}

export const tabScreenConfigs: TabScreenConfig[] = [
  {
    name: 'Home',
    label: 'HOME',
    component: LazyHomeScreen,
    icon: 'home-outline',
    filledIcon: 'home',
    iconType: 'Ionicons',
  },
  {
    name: 'Menu',
    label: 'MENU',
    component: LazyMenuScreen,
    icon: 'fast-food-outline',
    filledIcon: 'fast-food',
    iconType: 'Ionicons',
  },
  {
    name: 'Table',
    label: 'TABLE',
    component: LazyTableScreen,
    icon: 'TableIconOutline',
    filledIcon: 'TableIcon',
    iconType: 'TableIcon',
  },
  {
    name: 'Orders',
    label: 'ORDERS',
    component: LazyOrdersScreen,
    icon: 'list-alt',
    filledIcon: 'assignment',
    iconType: 'MaterialIcons',
  },
  {
    name: 'Account',
    label: 'ACCOUNT',
    component: LazyAccountScreen,
    icon: 'account-tie-outline',
    filledIcon: 'account-tie',
    iconType: 'MaterialCommunityIcons',
  },
];
