import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SubCategoryContainerProps {
  title: string;
  onSubCategoryClick: (subCategoryName: string) => void;
}

const SubCategoryContainer: React.FC<SubCategoryContainerProps> = ({
  title,
  onSubCategoryClick,
}) => {
  return (
    <View className="bg-gray-200 mb-4 p-4 rounded-md">
      <TouchableOpacity
        onPress={() => {
          onSubCategoryClick(title);
        }}
      >
        <Text className="text-black font-medium text-lg mb-2">{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubCategoryContainer;
