import React from "react";
import { useWindowDimensions, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { tabScreenConfigs } from "./screenConfigs";
import { IconType } from "../types/navigation";

// --- 1) Mobile Tabs (Bottom) ---
const BottomTabs = createBottomTabNavigator();

function MobileTabs() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => {
        const screen = tabScreenConfigs.find((s) => s.name === route.name);
        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelPosition: "below-icon",
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: -2,
          },
          tabBarActiveTintColor: "#2a4759",
          tabBarInactiveTintColor: "#999",
          tabBarIcon: ({ focused, color, size }) => {
            if (!screen) return null;
            const iconName = focused ? screen.filledIcon : screen.icon;
            const IconComponent =
              screen.iconType === IconType.MaterialIcons
                ? MaterialIcons
                : Ionicons;

            return (
              <View style={{ alignItems: "center" }}>
                {focused && (
                  <View
                    style={{
                      position: "absolute",
                      top: -8,
                      width: 50,
                      height: 2,
                      backgroundColor: "#2a4759",
                    }}
                  />
                )}
                <IconComponent
                  name={iconName as keyof typeof IconComponent.glyphMap}
                  size={size}
                  color={focused ? "#2a4759" : color}
                />
              </View>
            );
          },
        };
      }}
    >
      {tabScreenConfigs.map((screen) => (
        <BottomTabs.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{ tabBarLabel: screen.label }}
        />
      ))}
    </BottomTabs.Navigator>
  );
}

// --- 2) Desktop Tabs (Top) ---
const MaterialTopTabs = createMaterialTopTabNavigator();

/** We hide the tab bar by returning `null` in `tabBar()`. */
function DesktopTabs() {
  return (
    <MaterialTopTabs.Navigator
      // Hide the top tab bar:
      tabBar={() => null}
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: "transparent" },
        tabBarLabelStyle: { display: "none" },
        swipeEnabled: false, // disable swipe if desired
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

export default function MainTabs() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return isDesktop ? <DesktopTabs /> : <MobileTabs />;
}

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    paddingBottom: 5,
  },
});
