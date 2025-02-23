import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';

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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      {categories.map((category, index) => (
        <Pressable
          key={index}
          onPress={() => scrollToCategory(category)}
          className={`px-4 py-2 whitespace-nowrap cursor-pointer border-b-2 ${
            selectedCategory === category
              ? 'bg-darkTan border-transparent'
              : 'border-transparent hover:border-sand active:border-darkTan'
          }`}
          accessibilityRole="button"
          accessibilityLabel={`Select ${category} category`}
        >
          <Text className={` ${selectedCategory === category ? 'text-white ' : 'text-deepTeal '}`}>
            {category}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8, // Equivalent to Tailwind's p-2
    marginBottom: 16, // Equivalent to Tailwind's mb-4
    borderBottomWidth: 1, // Equivalent to Tailwind's border-b
    borderBottomColor: '#E5E7EB', // Equivalent to Tailwind's border-gray-200
  },
});

export default CategoryBar;
