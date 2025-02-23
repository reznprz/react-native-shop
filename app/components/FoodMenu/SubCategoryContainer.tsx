import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

interface SubCategoryContainerProps {
  title: string;
  onSubCategoryClick: (subCategoryName: string) => void;
}

const SubCategoryContainer: React.FC<SubCategoryContainerProps> = ({
  title,
  onSubCategoryClick,
}) => {
  return (
    <View className="bg-darkTan mb-4 p-6 m-2">
      <Pressable
        onPress={() => {
          onSubCategoryClick(title);
        }}
      >
        <Text className="text-white font-medium">{title}</Text>
      </Pressable>
    </View>
  );
};

export default SubCategoryContainer;
