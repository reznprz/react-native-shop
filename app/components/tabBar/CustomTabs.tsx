import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import CustomIcon from '../common/CustomIcon';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { IconType, tabScreenConfigs } from 'app/navigation/screenConfigs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const BottomTabs = createBottomTabNavigator();
const MaterialTopTabs = createMaterialTopTabNavigator();

export function MobileTabs() {
  const { deviceType } = useIsDesktop();

  const isTablet = deviceType === 'iPad' || 'Android Tablet';

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
            marginTop: 1,
          },
          tabBarActiveTintColor: '#2a4759',
          tabBarInactiveTintColor: '#999',

          // 1) Style the entire tab bar (center it + set a fixed width) only for iPad.
          tabBarStyle: isTablet
            ? {
                alignSelf: 'center',
                width: 445,
                marginVertical: 0,
                paddingVertical: 0,
              }
            : {},

          // 2) Style each tab item to remove extra spacing
          tabBarItemStyle: {
            marginHorizontal: 0,
            paddingHorizontal: 0,
          },

          tabBarIcon: ({ focused, color }) => {
            if (!screen) return null;
            const iconName = focused ? screen.filledIcon : screen.icon;
            let iconType;
            if (screen.label === 'TABLE') {
              iconType = focused ? screen.filledIcon : screen.icon;
            } else {
              iconType = screen.iconType;
            }

            return (
              <View style={styles.iconWrapper}>
                {focused && <View style={styles.focusIndicator} />}
                <CustomIcon
                  type={iconType as IconType}
                  name={iconName}
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

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
  },
  focusIndicator: {
    position: 'absolute',
    top: -8,
    width: 70,
    height: 4,
    backgroundColor: '#2a4759',
  },
});

/** We hide the tab bar by returning null in tabBar(). */
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
