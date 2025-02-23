import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AllCategoriesModal } from '../modal/AllCategoriesModal';
import CategoryChip from '../common/CategoryChip';

interface CategoryFilterProps {
  categories: string[];
  isDesktop?: boolean;
  handleCategoryClick: (categoryName: string) => void;
}

export default function CategoryFilter({
  categories,
  isDesktop = false,
  handleCategoryClick,
}: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showMoreDesktop, setShowMoreDesktop] = useState(false);

  const uniqueCategories = Array.from(new Set(['All', 'None', ...categories]));
  const MAX_DESKTOP_ROW = 6;
  const visibleDesktopCategories = showMoreDesktop
    ? uniqueCategories
    : uniqueCategories.slice(0, MAX_DESKTOP_ROW);

  const handleMobileToggle = () => {
    setShowBottomSheet((prev) => !prev);
  };

  const handleDesktopToggle = () => {
    setShowMoreDesktop((prev) => !prev);
  };

  return isDesktop ? (
    <View className="pt-2">
      <View className="flex-row flex-wrap gap-1 pl-4 pr-4 pb-2">
        {visibleDesktopCategories.map((cat) => (
          <CategoryChip
            key={cat}
            category={cat}
            isSelected={cat === selectedCategory}
            onSelect={(value) => {
              setSelectedCategory(value);
              handleCategoryClick(value);
              handleDesktopToggle();
            }}
          />
        ))}
      </View>

      <Pressable onPress={handleDesktopToggle} className="w-full">
        {/* Separator line */}
        <View className="w-full h-px bg-gray-200 " />
        <View className="flex-row items-center p-3 justify-center">
          <Ionicons
            name={showMoreDesktop ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#2a4759"
            style={{ marginRight: 4 }}
          />
          <Text className="text-sm font-semibold text-[#2a4759]">
            {showMoreDesktop ? 'Show Less Categories' : 'View All Categories'}
          </Text>
        </View>
      </Pressable>
    </View>
  ) : (
    <View>
      <View className="gap-1 pl-4 pr-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {uniqueCategories.slice(0, 4).map((cat) => (
            <CategoryChip
              key={cat}
              category={cat}
              isSelected={cat === selectedCategory}
              onSelect={(cat) => {
                handleCategoryClick(cat);
                setSelectedCategory(cat);
              }}
            />
          ))}
        </ScrollView>
      </View>

      <Pressable onPress={handleMobileToggle} className="w-full">
        {/* Separator line */}
        <View className="w-full h-px bg-gray-200 " />
        <View className="flex-row items-center p-3 justify-center">
          <Ionicons
            name={showMoreDesktop ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#2a4759"
            style={{ marginRight: 4 }}
          />
          <Text className="text-sm font-semibold text-[#2a4759]">
            {showMoreDesktop ? 'Show Less Categories' : 'View All Categories'}
          </Text>
        </View>
      </Pressable>

      <AllCategoriesModal
        visible={showBottomSheet}
        onClose={handleMobileToggle}
        categories={uniqueCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          handleCategoryClick(cat);
          setSelectedCategory(cat);
          setShowBottomSheet(false);
        }}
      />
    </View>
  );
}
