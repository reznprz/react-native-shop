import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseBottomSheetModal } from '../common/modal/BaseBottomSheetModal';
import CategoryChip from '../common/CategoryChip';

interface AllCategoriesModalProps {
  visible: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const AllCategoriesModal: React.FC<AllCategoriesModalProps> = ({
  visible,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <BaseBottomSheetModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.title}>All Categories</Text>
        <Pressable onPress={onClose} style={styles.closeIcon}>
          <Ionicons name="close" size={24} color="#000" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              category={cat}
              isSelected={cat === selectedCategory}
              onSelect={onSelectCategory}
            />
          ))}
        </View>
      </ScrollView>
    </BaseBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeIcon: {
    padding: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
