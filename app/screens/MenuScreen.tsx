import React, { useState } from "react";
import { ActivityIndicator, View, Text, Button } from "react-native";
import { useFoodContext } from "../context/FoodContext";
import QrFoodItem from "../components/FoodMenu/QrFoodItem";
import ResponsiveList from "app/components/common/ResponsiveList";
import SubCategoryContainer from "../components/FoodMenu/SubCategoryContainer";

export default function MenuScreen() {
  const { groupedFoods, menuState, refetch } = useFoodContext();
  const { data: foodList, loading, error } = menuState;
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  const handleSubCategoryClick = (subCategoryName: string) => {
    setSelectedSubCategory(subCategoryName);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center bg-white">
          <Text className="text-red-600 font-bold">{error}</Text>
          <Button title="Retry" onPress={refetch} />
        </View>
      );
    }

    if (!groupedFoods || Object.keys(groupedFoods).length === 0) {
      return (
        <View className="flex-1 justify-center items-center bg-white">
          <Text className="text-gray-500">No menu items available.</Text>
        </View>
      );
    }

    if (selectedSubCategory) {
      const filteredFoods = foodList?.filter((food) => {
        const normalizeString = (str: string) =>
          str?.toLowerCase().replace(/\s+/g, "").trim(); // Remove spaces and normalize

        const categoryNameTwo = normalizeString(food.categoryNameTwo!!);
        const selectedCategory = normalizeString(selectedSubCategory);

        console.log(`Filtering food item:`, food);
        console.log(`CategoryNameTwo (normalized):`, categoryNameTwo);
        console.log(`SelectedSubCategory (normalized):`, selectedCategory);

        const isMatch = categoryNameTwo === selectedCategory;
        console.log(`Is Match:`, isMatch);

        return isMatch;
      });
      return (
        <View className="flex-1 bg-gray-100 py-4 px-6">
          <Button title="Back" onPress={() => setSelectedSubCategory(null)} />
          <QrFoodItem
            subCategoryMap={
              new Map([[selectedSubCategory, filteredFoods || []]])
            }
          />
        </View>
      );
    }

    return (
      <View className="bg-white py-6 px-6 shadow-md">
        <Text className="text-center font-bold text-xl text-black mb-4">
          Sha-jhya
          <Text className="block text-lg text-gray-500"> Menu </Text>
        </Text>
        <ResponsiveList
          data={Object.keys(groupedFoods)}
          keyExtractor={(item) => item}
          renderItem={(item) => (
            <SubCategoryContainer
              title={item}
              onSubCategoryClick={handleSubCategoryClick}
            />
          )}
          scrollViewProps={{
            contentContainerStyle: { paddingBottom: 20 },
            showsVerticalScrollIndicator: false,
          }}
        />
      </View>
    );
  };

  return <View className="flex-1 justify-center">{renderContent()}</View>;
}
