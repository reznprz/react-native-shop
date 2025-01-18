import React, { useCallback, useEffect } from "react";
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { useNavigationState } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, StyleSheet } from "react-native";
import { TAB_CONFIG, TAB_SCREENS } from "./tabConfig";
import { IconType, TabParamList, TabRouteName } from "app/types/navigation";
import { useFood } from "app/hooks/useFood";
import { navigate } from "./navigationService";

const Tab = createBottomTabNavigator<TabParamList>();

interface BottomTabNavigatorProps {
  onTabChange: (tabName: TabRouteName) => void;
}

const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({
  onTabChange,
}) => {
  const { refetch } = useFood();

  const renderTabBarLabel = useCallback(
    (focused: boolean, title: string) => (
      <Text
        className={`text-xs text-center ${
          focused ? "text-deepTeal" : "text-[#aaa]"
        }`}
      >
        {title}
      </Text>
    ),
    []
  );

  const handleQrMenuPress = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      try {
        // await refetch();
        navigate("BottomTabs", { screen: "QrMenu" });
      } catch (error) {
        console.error("Failed to fetch foods:", error);
        // Optionally, display an alert or Toast here
      }
    },
    [refetch]
  );

  // Track active tab from navigation state
  const state = useNavigationState((navState) => navState);

  // Monitor active tab and notify parent
  useEffect(() => {
    if (state) {
      const parentRoute = state.routes[state.index]; // Get the currently active route
      if (parentRoute.state) {
        // Access the nested state of the BottomTabNavigator
        const nestedState = parentRoute.state as any;
        const currentTab = nestedState.routes[nestedState.index]
          ?.name as TabRouteName;
        console.log("currentTab", currentTab);
        onTabChange(currentTab);
      }
    }
  }, [state, onTabChange]);

  const getIconComponent = (type: string) => {
    switch (type) {
      case IconType.Ionicons:
        return Ionicons;
      case IconType.MaterialIcons:
        return MaterialIcons;
      default:
        return Ionicons;
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const routeName = route.name as TabRouteName;
        const { tabBarShowLabel, iconName, filledIcon, iconType } =
          TAB_CONFIG[routeName];
        return {
          lazy: true,
          tabBarShowLabel,
          tabBarIcon: ({ focused, color, size }) => {
            const IconComponent = getIconComponent(iconType);

            switch (iconType) {
              case IconType.MaterialIcons:
                return (
                  <MaterialIcons
                    name={
                      focused
                        ? (filledIcon as React.ComponentProps<
                            typeof MaterialIcons
                          >["name"])
                        : (iconName as React.ComponentProps<
                            typeof MaterialIcons
                          >["name"])
                    }
                    size={size}
                    color={focused ? "#2a4759" : color}
                  />
                );
              case IconType.Ionicons:
              default:
                return (
                  <Ionicons
                    name={
                      focused
                        ? (filledIcon as React.ComponentProps<
                            typeof Ionicons
                          >["name"])
                        : (iconName as React.ComponentProps<
                            typeof Ionicons
                          >["name"])
                    }
                    size={size}
                    color={focused ? "#2a4759" : color}
                  />
                );
            }
          },
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#2a4759",
          tabBarInactiveTintColor: "#aaa",
          headerShown: false,
        } as BottomTabNavigationOptions;
      }}
    >
      {Object.entries(TAB_CONFIG).map(([name, config]) => (
        <Tab.Screen
          key={name}
          name={name as TabRouteName}
          component={TAB_SCREENS[name as TabRouteName]}
          options={{
            tabBarLabel: config.tabBarShowLabel
              ? ({ focused }) => renderTabBarLabel(focused, config.title)
              : undefined,
          }}
          listeners={
            name === "QrMenu"
              ? {
                  tabPress: handleQrMenuPress,
                }
              : undefined
          }
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    paddingBottom: 5,
  },
});

export default React.memo(BottomTabNavigator);
