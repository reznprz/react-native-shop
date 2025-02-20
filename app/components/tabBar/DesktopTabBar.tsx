import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
// or TopTabBarProps if you're customizing a MaterialTopTabNavigator

import { tabScreenConfigs } from "app/navigation/screenConfigs";
import { IconType } from "app/types/navigation";

interface DesktopTabBarProps extends BottomTabBarProps {
  // If using top tabs, you'd do MaterialTopTabBarProps
}

/**
 * A custom top tab bar for DESKTOP:
 * - Icons only
 * - On hover, show label
 * - Icons centered horizontally
 */
export default function DesktopTabBar({
  state,
  descriptors,
  navigation,
}: DesktopTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        // Find screen config from our tabScreenConfigs array
        const screenConfig = tabScreenConfigs.find(
          (s) => s.name === route.name
        );
        if (!screenConfig) return null;

        const IconComponent =
          screenConfig.iconType === IconType.MaterialIcons
            ? MaterialIcons
            : Ionicons;
        const iconName = isFocused
          ? screenConfig.filledIcon
          : screenConfig.icon;

        // For hover tooltip, we'll keep local state
        const [hovered, setHovered] = useState(false);

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            style={styles.tabButton}
            onPress={onPress}
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
          >
            <IconComponent
              name={iconName as any}
              size={28}
              color={isFocused ? "#2a4759" : "#999"}
            />
            {/* Tooltip on hover */}
            {hovered && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{screenConfig.label}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tabButton: {
    marginHorizontal: 16,
    padding: 8,
    position: "relative",
  },
  tooltip: {
    position: "absolute",
    bottom: -35,
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
  },
});
