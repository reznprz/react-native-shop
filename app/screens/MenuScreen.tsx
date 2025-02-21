import React, { useEffect } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import FoodCard from "app/components/FoodMenu/FoodCard";
import { useFood } from "app/hooks/useFood";
import PrimaryHeader from "app/components/common/PrimaryHeader";

export default function MenuScreen() {
  const { width } = useWindowDimensions();
  const isTabletOrDesktop = width >= 768;
  const { foods, refetch, categories } = useFood();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <PrimaryHeader
        title="Categories"
        onBackPress={() => console.log("Go back")}
        onSearchPress={() => console.log("Search pressed")}
        onFilterPress={() => console.log("Filter pressed")}
        categories={categories}
      />

      {/* CATEGORIES */}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 8 }}
      >
        {/* FOOD CARDS GRID */}
        <View
          className={`flex-row flex-wrap ${
            isTabletOrDesktop ? "justify-center px-2" : "justify-center px-1"
          }`}
        >
          {foods?.map((food, idx) => (
            <FoodCard key={idx} food={food} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
