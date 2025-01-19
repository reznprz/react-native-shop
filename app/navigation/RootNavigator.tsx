import React, { useCallback, useMemo, useState } from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import {
  ScreenDisplayNames,
  ScreenNames,
  TabRouteName,
} from "app/types/navigation";
import BottomTabNavigator from "./BottomTabNavigator";

import StickyHeader from "../components/StickyHeader";

const QrMenuItemsScreen = React.lazy(
  () => import("app/screens/QrMenuItemsScreen")
);
const CartScreen = React.lazy(() => import("app/screens/CartScreen"));

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
  const [currentTabName, setCurrentTabName] = useState<
    TabRouteName | undefined
  >(undefined);

  const handleTabChange = useCallback((tabName: TabRouteName) => {
    setCurrentTabName(tabName);
  }, []);

  /**
   * Provide a custom header that knows the active tab name.
   * We'll override the title with `currentTabName` inside StickyHeader.
   */
  const screenOptions: NativeStackNavigationOptions = useMemo(
    () => ({
      header: (props) => (
        <StickyHeader {...props} currentTabName={currentTabName} />
      ),
    }),
    [currentTabName]
  );

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/**
       * Hide the default header title here, and let StickyHeader handle it
       * so we don’t see “BottomTabs” in the header.
       */}
      <Stack.Screen
        name="BottomTabs"
        options={{ headerShown: true, title: "" }}
      >
        {(props) => (
          <BottomTabNavigator {...props} onTabChange={handleTabChange} />
        )}
      </Stack.Screen>

      <Stack.Screen
        name={ScreenNames.QR_MENU_ITEMS}
        component={QrMenuItemsScreen}
        options={{
          title: ScreenDisplayNames.QR_MENU_ITEMS,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={ScreenNames.CART}
        component={CartScreen}
        options={{
          title: ScreenDisplayNames.CART,
          headerShown: true,
          navigationBarHidden: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default React.memo(RootNavigator);
