import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string | null;
  scrollToCategory: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  scrollToCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => scrollToCategory(category)}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategory,
          ]}
        >
          <Text style={styles.categoryText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    display: "flex", // Ensure this is valid for React Native
    flexDirection: "row",
  },
  categoryButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  selectedCategory: {
    backgroundColor: "#ccc",
  },
  categoryText: {
    fontSize: 16,
  },
});

export default CategoryBar;
