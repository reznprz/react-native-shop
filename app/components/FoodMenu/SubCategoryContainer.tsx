import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Food } from "app/api/services/foodService";

interface SubCategoryContainerProps {
  title: string;
  items: Food[];
}

const SubCategoryContainer: React.FC<SubCategoryContainerProps> = ({
  title,
  items,
}) => {
  return (
    <View className="bg-gray-200 mb-4 p-4 rounded-md">
      <TouchableOpacity>
        <Text className="text-black font-medium text-lg mb-2">{title}</Text>
      </TouchableOpacity>
      {items.map((item, index) => (
        <Text key={index} className="text-gray-700 text-sm">
          - {item.name}
        </Text>
      ))}
    </View>
  );
};

export default SubCategoryContainer;
