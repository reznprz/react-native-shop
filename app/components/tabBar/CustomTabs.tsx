import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DesktopTabBar from "./DesktopTabBar";
import { tabScreenConfigs } from "app/navigation/screenConfigs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // Correct import
import { IconType } from "app/types/navigation";

const MaterialTopTabs = createMaterialTopTabNavigator();
const BottomTabs = createBottomTabNavigator();

export function DesktopTabs() {
  return (
    <MaterialTopTabs.Navigator
      tabBar={(props: any) => <DesktopTabBar {...props} />} // <--- custom tab bar
      screenOptions={{
        // If you want an indicator or some color, you can put it here
        tabBarIndicatorStyle: { backgroundColor: "transparent" },
        // We hide the built-in label because we show them as tooltips:
        tabBarLabelStyle: { display: "none" },
        // Possibly turn off scroll if you only have a few tabs:
        swipeEnabled: false,
      }}
    >
      {tabScreenConfigs.map((screen) => (
        <MaterialTopTabs.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </MaterialTopTabs.Navigator>
  );
}
