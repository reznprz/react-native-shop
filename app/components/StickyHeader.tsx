import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function StickyHeader({
  navigation,
  options,
  route,
  back,
}: NativeStackHeaderProps) {
  const title = options.title ?? route.name;

  return (
    <View className="bg-white border-b border-gray-200">
      <View className="flex-row items-center p-4">
        {back ? (
          <TouchableOpacity
            onPress={navigation.goBack}
            className="mr-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        ) : null}
        <Text className="text-lg font-bold">{title}</Text>
      </View>
    </View>
  );
}
