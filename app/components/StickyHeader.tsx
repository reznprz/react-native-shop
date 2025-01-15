import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { isNotTabRouteName, TabRouteName } from "app/types/navigation";

interface StickyHeaderProps extends NativeStackHeaderProps {
  currentTabName?: TabRouteName;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  navigation,
  options,
  route,
  currentTabName,
}) => {
  /**
   * If we do have a currentTabName, we use it as the visible title.
   * Otherwise, fall back to the stack’s route name or explicit `options.title`.
   */
  const displayedTitle = currentTabName || options.title || route.name || "App";

  const { width } = useWindowDimensions();

  // Determine header height dynamically based on screen size
  const headerHeight = width <= 768 ? 100 : 80;
  const paddingTop = width <= 768 ? 50 : 8;

  return (
    <View
      style={{ height: headerHeight, paddingTop: paddingTop }}
      className="bg-deepTeal border-b border-gray-200 "
    >
      <View className="flex-row items-center m-4">
        {/**
         * Show back arrow only on non-Home tabs or non-bottom-tabs screens.
         */}
        {currentTabName && isNotTabRouteName(currentTabName) && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
        <Text
          className="text-xl font-bold text-white mx-auto"
          style={{ textAlign: "center", flex: 1 }}
        >
          {displayedTitle === "BottomTabs" ? "Home" : displayedTitle}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(StickyHeader);
