import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import CartScreen from "../screens/CartScreen";
import CustomHeader from "../components/headers/CustomHeader"; // Mobile Header

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
