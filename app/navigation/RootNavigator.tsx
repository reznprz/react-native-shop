import React, { useCallback, useMemo, useState } from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { TabRouteName } from "app/types/navigation";
import BottomTabNavigator from "./BottomTabNavigator";
const QrMenuItemsScreen = React.lazy(
  () => import("app/screens/QrMenuItemsScreen")
);
import StickyHeader from "../components/StickyHeader";

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
        name="QrMenuItemsScreen"
        component={QrMenuItemsScreen}
        options={{ title: "Menu Items", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default React.memo(RootNavigator);
