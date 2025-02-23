import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { tabScreenConfigs } from 'app/navigation/screenConfigs';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { IconType } from 'app/types/navigation';

const MaterialTopTabs = createMaterialTopTabNavigator();

// --- 1) Mobile Tabs (Bottom) ---
const BottomTabs = createBottomTabNavigator();

export function MobileTabs() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => {
        const screen = tabScreenConfigs.find((s) => s.name === route.name);
        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelPosition: 'below-icon',
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: -2,
          },
          tabBarActiveTintColor: '#2a4759',
          tabBarInactiveTintColor: '#999',
          tabBarIcon: ({ focused, color, size }) => {
            if (!screen) return null;
            const iconName = focused ? screen.filledIcon : screen.icon;
            const IconComponent =
              screen.iconType === IconType.MaterialIcons ? MaterialIcons : Ionicons;

            return (
              <View style={{ alignItems: 'center' }}>
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -8,
                      width: 50,
                      height: 2,
                      backgroundColor: '#2a4759',
                    }}
                  />
                )}
                <IconComponent
                  name={iconName as keyof typeof IconComponent.glyphMap}
                  size={size}
                  color={focused ? '#2a4759' : color}
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

/** We hide the tab bar by returning `null` in `tabBar()`. */
// Desktop Tabs (Top)
export function DesktopTabs() {
  return (
    <MaterialTopTabs.Navigator
      // Hide the top tab bar:
      tabBar={() => null}
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: 'transparent' },
        tabBarLabelStyle: { display: 'none' },
        swipeEnabled: false,
      }}
    >
      {tabScreenConfigs.map((screen) => (
        <MaterialTopTabs.Screen key={screen.name} name={screen.name} component={screen.component} />
      ))}
    </MaterialTopTabs.Navigator>
  );
}
