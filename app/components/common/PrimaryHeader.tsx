import React from "react";
import { View, Text, Pressable } from "react-native";
import CategoryFilter from "../FoodMenu/CategoryFilter";
import Ionicons from "@expo/vector-icons/Ionicons";

interface PrimaryHeaderProps {
  title: string;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  showBackPress?: boolean;
  categories?: string[];
}

export default function PrimaryHeader({
  title,
  onBackPress,
  onSearchPress,
  onFilterPress,
  showBackPress = false,
  categories = [],
}: PrimaryHeaderProps) {
  return (
    <View className="border-b border-gray-200 px-4 py-2">
      {/* Top row: back arrow, title, search/filter icons */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {showBackPress && (
            <Pressable onPress={onBackPress} className="mr-2">
              <Ionicons name="chevron-back" size={24} color="black" />
            </Pressable>
          )}
          <Text className="text-lg font-bold">{title}</Text>
        </View>

        <View className="flex-row items-center space-x-4">
          <Pressable onPress={onSearchPress}>
            <Ionicons name="search" size={20} color="black" />
          </Pressable>
          <Pressable onPress={onFilterPress}>
            <Ionicons name="filter" size={20} color="black" />
          </Pressable>
        </View>
      </View>

      {/* Categories below if present */}
      {categories.length > 0 && (
        <View className="mt-2">
          <CategoryFilter categories={categories} />
        </View>
      )}
    </View>
  );
}
