import React, { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CategoryFilter from "app/components/FoodMenu/CategoryFilter";
import FoodCard from "app/components/FoodMenu/FoodCard";
import { useFood } from "app/hooks/useFood";

export default function MenuScreen() {
  const { width } = useWindowDimensions();
  const isTabletOrDesktop = width >= 768;
  const { foods, refetch } = useFood();

  const categories = [
    "All",
    "Burgers",
    "Pizza",
    "Pasta",
    "Chicken",
    "Seafood",
    "Desserts",
    "Drinks",
    "Salads",
    "Breakfast",
    "Spicy",
    "Vegan",
  ];

  useEffect(() => {
    refetch();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-200">
        <Pressable onPress={() => console.log("Go back")}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
        <Text className="text-lg font-bold">Order Menu</Text>
        <View className="flex-row items-center space-x-4">
          <Pressable onPress={() => console.log("Search pressed")}>
            <Ionicons name="search" size={20} color="black" />
          </Pressable>
          <Pressable onPress={() => console.log("Filter pressed")}>
            <Ionicons name="filter" size={20} color="black" />
          </Pressable>
        </View>
      </View>

      {/* CATEGORIES */}
      <CategoryFilter categories={categories} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 8 }}
      >
        {/* FOOD CARDS GRID */}
        <View
          className={`flex flex-row flex-wrap justify-center ${
            isTabletOrDesktop ? "px-10" : "px-4"
          }`}
        >
          {foods?.map((food, idx) => (
            <FoodCard food={food} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
