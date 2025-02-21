import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AllCategoriesModal } from "../modal/AllCategoriesModal";

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  // Mobile bottom sheet
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // Desktop expand/collapse
  const [showMoreDesktop, setShowMoreDesktop] = useState(false);

  const { width } = Dimensions.get("window");
  const isDesktop = width >= 768;

  // Ensure "All" is always first; remove duplicates if needed
  const uniqueCategories = Array.from(new Set(["All", ...categories]));

  // Decide how many categories to show in one desktop row
  const MAX_DESKTOP_ROW = 6; // adjust as you wish (6, 8, etc.)
  const visibleDesktopCategories = showMoreDesktop
    ? uniqueCategories
    : uniqueCategories.slice(0, MAX_DESKTOP_ROW);

  // Toggle bottom sheet on mobile
  const handleMobileToggle = () => {
    setShowBottomSheet((prev) => !prev);
  };

  // Toggle expand/collapse on desktop
  const handleDesktopToggle = () => {
    setShowMoreDesktop((prev) => !prev);
  };

  if (isDesktop) {
    // =============== DESKTOP VIEW ===============
    return (
      <View style={{ padding: 16 }}>
        {/* Single or multi-line categories depending on showMoreDesktop */}
        <View style={styles.desktopCategoryRow}>
          {visibleDesktopCategories.map((cat, index) => (
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

        <Pressable
          onPress={handleDesktopToggle}
          style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
        >
          <Ionicons
            // Toggle icon up/down
            name={showMoreDesktop ? "chevron-up" : "chevron-down"}
            size={16}
            color="#2563eb"
            style={{ marginRight: 4 }}
          />
          <Text style={{ color: "#2563eb", fontWeight: "600" }}>
            {/* Toggle text */}
            {showMoreDesktop ? "Show Less Categories" : "View All Categories"}
          </Text>
        </Pressable>
      </View>
    );
  } else {
    // =============== MOBILE VIEW ===============
    return (
      <View style={{ padding: 16 }}>
        {/* Horizontal scroll for a few categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
        >
          {uniqueCategories.slice(0, 4).map((cat, index) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryChip,
                index === 0 ? { backgroundColor: "#000" } : null,
                { marginRight: 8 },
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
        </ScrollView>

        <Pressable
          onPress={handleMobileToggle}
          style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
        >
          <Ionicons
            name="chevron-down"
            size={16}
            color="#2563eb"
            style={{ marginRight: 4 }}
          />
          <Text style={{ color: "#2563eb", fontWeight: "600" }}>
            View All Categories
          </Text>
        </Pressable>

        {/* Bottom Sheet showing all categories on mobile */}
        <AllCategoriesModal
          visible={showBottomSheet}
          onClose={handleMobileToggle}
          categories={uniqueCategories}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  desktopCategoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB", // gray-200
    margin: 4,
  },
  categoryText: {
    fontWeight: "600",
  },
});
