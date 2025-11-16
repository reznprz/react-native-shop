import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import CustomIcon from '../common/CustomIcon';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { IconType, tabScreenConfigs } from 'app/navigation/screenConfigs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'app/hooks/useTheme';

const BottomTabs = createBottomTabNavigator();
const MaterialTopTabs = createMaterialTopTabNavigator();

export function MobileTabs() {
  const { deviceType } = useIsDesktop();
  const theme = useTheme();

  const isTablet = deviceType === 'iPad' || deviceType === 'Android Tablet';

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
          tabBarActiveTintColor: theme.secondary,
          tabBarInactiveTintColor: theme.mutedIcon,

          tabBarStyle: isTablet
            ? {
                alignSelf: 'center',
                width: 445,
                marginVertical: 0,
                paddingVertical: 0,
              }
            : {},

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
                {focused && (
                  <View style={[styles.focusIndicator, { backgroundColor: theme.secondary }]} />
                )}
                <CustomIcon
                  type={iconType as IconType}
                  name={iconName}
                  color={focused ? theme.secondary : color}
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
    borderRadius: 999,
  },
});

/** We hide the tab bar by returning null in tabBar(). */
export function DesktopTabs() {
  return (
    <MaterialTopTabs.Navigator
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
