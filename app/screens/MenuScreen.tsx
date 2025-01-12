// app/screens/MenuScreen.tsx

import React from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  Button,
  ScrollView,
  Platform,
} from "react-native";
import { useFoodContext } from "../context/FoodContext";
import SubCategoryContainer from "../components/FoodMenu/SubCategoryContainer";
import { SubCategory } from "app/hooks/useFood";

export default function MenuScreen() {
  const { groupedFoods, menuState, refetch } = useFoodContext();

  const { loading, error } = menuState;

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

  // Cast Object.keys to SubCategory[]
  const groupedFoodKeys = Object.keys(groupedFoods) as SubCategory[];

  return (
    <View className="flex-1 bg-gray-100 py-10 px-4">
      <View className="bg-white rounded-md py-6 shadow-md px-6">
        <Text className="text-center font-bold text-xl text-black mb-4">
          Sha-jhya
          <Text className="block text-lg text-gray-500"> Menu </Text>
        </Text>
        {Platform.OS === "web" ? (
          // Alternative for web if FlatList causes issues
          <ScrollView>
            {groupedFoodKeys.map((item) => (
              <SubCategoryContainer
                key={item}
                title={item}
                items={groupedFoods[item]}
              />
            ))}
          </ScrollView>
        ) : (
          <FlatList
            data={groupedFoodKeys}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <SubCategoryContainer title={item} items={groupedFoods[item]} />
            )}
          />
        )}
      </View>
    </View>
  );
}
