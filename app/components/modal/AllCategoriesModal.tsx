import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BaseBottomSheetModal } from "../common/modal/BaseBottomSheetModal";

interface AllCategoriesModalProps {
  visible: boolean;
  onClose: () => void;
  categories: string[];
}

export const AllCategoriesModal: React.FC<AllCategoriesModalProps> = ({
  visible,
  onClose,
  categories,
}) => {
  return (
    <BaseBottomSheetModal visible={visible} onClose={onClose}>
      {/* Header row with close icon */}
      <View style={styles.header}>
        <Text style={styles.title}>All Categories</Text>
        <Pressable onPress={onClose} style={styles.closeIcon}>
          <Ionicons name="close" size={24} color="#000" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.categoriesContainer}>
          {categories.map((cat, index) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryChip,
                index === 0 ? { backgroundColor: "#000" } : null,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  index === 0 ? { color: "#fff" } : { color: "#000" },
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </BaseBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  closeIcon: {
    padding: 4,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryChip: {
    margin: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB", // gray-200
  },
  categoryText: {
    fontWeight: "600",
  },
});
