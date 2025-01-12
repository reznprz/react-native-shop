import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface HeaderProps {
  subCategoryName: string;
  goBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ subCategoryName, goBack }) => {
  return (
    <View className="flex-row items-center justify-between mb-2 border-b border-gray-200 pt-4">
      <TouchableOpacity onPress={goBack} accessibilityLabel="Go back">
        <Text className="text-primary-font-color text-lg">← Back</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold">{subCategoryName}</Text>
      <View /> {/* Empty View to center the header */}
    </View>
  );
};

export default Header;
