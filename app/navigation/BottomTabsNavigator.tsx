import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "react-native";
import {
  bottomTabMetadata,
  BottomTabParamList,
  ScreenMetadata,
} from "./navigationTypes";

import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import OrderScreen from "../screens/OrderScreen";
import FoodScreen from "../screens/FoodScreen";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const screenOptions = ({
  route,
}: {
  route: { name: keyof BottomTabParamList };
}) => {
  const { showIcon, hoverEffect, iconName, title } =
    bottomTabMetadata[route.name];

  return {
    headerShown: false, // Headers are managed by StackNavigator
    tabBarIcon: ({
      color,
      size,
      focused,
    }: {
      color: string;
      size: number;
      focused: boolean;
    }) =>
      showIcon && (
        <Ionicons
          name={iconName}
          size={size}
          color={focused ? undefined : color} // Color from Tailwind for focus state
          style={{
            transform: [{ scale: focused ? 1.1 : 1 }],
            color: focused ? "#B08D68" : color, // 'text-mocha' corresponds to color "#B08D68"
          }}
        />
      ),
    tabBarLabel: ({ focused }: { focused: boolean }) => (
      <Text
        style={{
          fontSize: 10,
          textAlign: "center",
          fontFamily: "Roboto", // Assuming 'font-roboto' corresponds to 'Roboto'
          color: focused ? "#B08D68" : "#6B7280", // 'text-mocha' and 'text-gray-500'
        }}
      >
        {title}
      </Text>
    ),
    tabBarStyle: {
      paddingVertical: 5,
      backgroundColor: "white",
    },
  };
};

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Food" component={FoodScreen} />
    </Tab.Navigator>
  );
}
