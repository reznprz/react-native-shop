import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";

const Tab = createBottomTabNavigator();

// Type-safe definition for tab icons
const TAB_ICONS = {
  Home: {
    iconName: "home-outline",
    filledIcon: "home",
    title: "Home",
  },
  Menu: {
    iconName: "menu-outline",
    filledIcon: "menu",
    title: "Menu",
  },
  Cart: {
    iconName: "cart-outline",
    filledIcon: "cart",
    title: "Cart",
  },
  Orders: {
    iconName: "fast-food-outline",
    filledIcon: "fast-food",
    title: "Orders",
  },
} as const;

type TabRouteName = keyof typeof TAB_ICONS;

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const routeName = route.name as TabRouteName; // Ensure type safety

        return {
          lazy: true,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            const { iconName, filledIcon } = TAB_ICONS[routeName];
            return (
              <Ionicons
                name={focused ? filledIcon : iconName}
                size={24}
                color={focused ? "#8b5e3c" : color}
              />
            );
          },
          tabBarStyle: {
            // Style tab bar if needed
          },
          tabBarActiveTintColor: "#8b5e3c",
          tabBarInactiveTintColor: "#aaa",
        };
      }}
    >
      {Object.entries(TAB_ICONS).map(([name, { title }]) => (
        <Tab.Screen
          key={name}
          name={name as TabRouteName}
          component={
            name === "Home"
              ? HomeScreen
              : name === "Menu"
              ? MenuScreen
              : name === "Cart"
              ? CartScreen
              : OrdersScreen
          }
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: 12,
                  color: focused ? "#8b5e3c" : "#aaa",
                }}
              >
                {title}
              </Text>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
