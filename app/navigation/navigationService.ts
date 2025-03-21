import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabsParamList = {
  Menu: { selectedTab?: string };
  TableScreen: { tableId?: string };
  Orders: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  Cart: undefined;
  QrMenuItemsScreen: { category: string };
  OrderDetails: { orderId: string; actionType?: string };
  Food: undefined;
  Expense: undefined;
  DailySales: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

type RouteName = keyof RootStackParamList;

export function navigate<Name extends RouteName>(
  ...args: RootStackParamList[Name] extends undefined
    ? [name: Name] // If route doesn't need params
    : [name: Name, params: RootStackParamList[Name]] // If route needs params
) {
  const [routeName, routeParams] = args;
  if (navigationRef.isReady()) {
    navigationRef.navigate(routeName, routeParams as any);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function push(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}
