import {
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";

export type RootStackParamList = {
  MainTabs: undefined;
  Cart: undefined;
  QrMenuItemsScreen: { category: string };
  // ...other routes
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Variation of your RootStackParamList
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

// 3) Optionally expose more methods like goBack, push, reset, etc.
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
