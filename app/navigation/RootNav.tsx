import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import CartScreen from "../screens/CartScreen";
import CustomHeader from "../components/headers/CustomHeader"; // Mobile Header
import { ScreenDisplayNames, ScreenNames } from "app/types/navigation";
const QrMenuItemsScreen = React.lazy(
  () => import("app/screens/QrMenuItemsScreen")
);

const Stack = createNativeStackNavigator();

export default function RootNav() {
  return (
    <Stack.Navigator>
      {/* Main Tab Navigation */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={(props) => ({
          header: () => <CustomHeader {...props} />,
        })}
      />

      <Stack.Screen
        name={ScreenNames.QR_MENU_ITEMS}
        component={QrMenuItemsScreen}
        options={{
          title: ScreenDisplayNames.QR_MENU_ITEMS,
          headerShown: false,
        }}
      />

      {/* Cart Screen (Retain default header) */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "CART",
          headerShown: true, // Show default header here
        }}
      />
    </Stack.Navigator>
  );
}
