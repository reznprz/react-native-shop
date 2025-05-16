import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabsParamList = {
  Menu: { selectedTab?: string };
  TableScreen: { tableId?: string };
  Orders: { selectedTab?: string };
  Home: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  Cart: undefined;
  OrderDetails: { orderId: string; actionType?: string };
  FoodManager: undefined;
  Expense: undefined;
  DailySales: undefined;
  Inventory: undefined;
  SalesAnalytics: undefined;
  Login: undefined;
  TableManager: undefined;
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
  console.log('Pushing to navigation stack:', name, params);
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}
