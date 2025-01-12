import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

type CustomHeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  iconName?: string;
};

export default function CustomHeader({
  title,
  showBackButton,
  onBackPress,
  iconName,
}: CustomHeaderProps) {
  return (
    <SafeAreaView>
      <View className="h-16 bg-mocha flex-row items-center px-4">
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} className="mr-4">
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
        {iconName && (
          <Ionicons
            className={iconName}
            size={24}
            color="white"
            style={{ marginRight: 8 }}
          />
        )}
        <Text className="text-white text-lg font-bold">{title}</Text>
      </View>
    </SafeAreaView>
  );
}
