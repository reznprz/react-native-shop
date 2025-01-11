import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import OrderScreen from "../screens/OrderScreen";
import FoodScreen from "../screens/FoodScreen";

// If you use TypeScript, you can define the param list for routes
export type BottomTabParamList = {
  Home: undefined;
  Menu: undefined;
  Order: undefined;
  Food: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = "";
          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Menu":
              iconName = "menu-outline";
              break;
            case "Order":
              iconName = "cart-outline";
              break;
            case "Food":
              iconName = "fast-food-outline";
              break;
          }
          return <Ionicons className={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Food" component={FoodScreen} />
    </Tab.Navigator>
  );
}
