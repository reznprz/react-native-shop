import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const [showMore, setShowMore] = useState(false);

  // Decide how many categories to display when "Show More" is false
  const visibleCategories = showMore ? categories : categories.slice(0, 4);

  return (
    <View className="w-full px-4">
      <Text className="font-bold text-lg mb-2">Categories</Text>
      {/* Horizontal scroll for category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        {visibleCategories.map((cat, index) => (
          <Pressable
            key={cat}
            className={`flex-row items-center justify-center px-4 py-2 rounded-md mr-2 ${
              index === 0
                ? "bg-neutral-900" // The "All" button in your mock is black
                : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-sm ${
                index === 0 ? "text-white" : "text-black"
              } font-semibold`}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Show/Hide More Categories */}
      <Pressable
        onPress={() => setShowMore(!showMore)}
        className="mt-2 flex-row items-center"
      >
        <Text className="text-center text-blue-600 text-sm font-semibold">
          {showMore ? "Show Less Categories ▲" : "View All Categories ▼"}
        </Text>
      </Pressable>
    </View>
  );
}
