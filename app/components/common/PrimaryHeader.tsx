import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import CategoryFilter from '../FoodMenu/CategoryFilter';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PrimaryHeaderProps {
  title: string;
  onBackPress?: () => void;
  onSearch?: (text: string) => void;
  handleCategoryClick: (categoryName: string) => void;
  onFilterPress?: () => void;
  showBackPress?: boolean;
  categories?: string[];
  isDesktop?: boolean;
}

export default function PrimaryHeader({
  title,
  onBackPress,
  onSearch,
  onFilterPress,
  showBackPress = false,
  isDesktop = false,
  categories = [],
  handleCategoryClick,
}: PrimaryHeaderProps) {
  return (
    <View className="border-b border-gray-200">
      {/* Top row: back arrow, title, search/filter icons */}
      <View className="flex-row items-center justify-between pl-4 pr-4 pt-2 m-1">
        <View className="flex-row items-center">
          {showBackPress && (
            <Pressable onPress={onBackPress} className="mr-2">
              <Ionicons name="chevron-back" size={24} color="black" />
            </Pressable>
          )}
          <Text className="text-lg font-bold">{title}</Text>
        </View>

        <View className="flex-row items-center">
          {isDesktop ? (
            // Desktop: full search input with larger padding and shadow
            <View className="flex-row items-center bg-white rounded-md shadow-md border border-gray-300 max-w-[400px] px-4 py-2">
              <Ionicons name="search" size={20} color="gray" />
              <TextInput
                placeholder="Search"
                placeholderTextColor="gray"
                className="ml-2 flex-1 text-base"
                onChangeText={onSearch}
              />
            </View>
          ) : (
            // Mobile: full search input with slightly leaner styling
            <View className="flex-row items-center bg-white rounded-full shadow-sm border border-gray-200 px-3 py-1 max-w-[200px] w-auto">
              <Ionicons name="search" size={20} color="gray" />
              <TextInput
                placeholder="Search"
                placeholderTextColor="gray"
                className="ml-2 flex-1 text-sm"
                onChangeText={onSearch}
              />
            </View>
          )}
        </View>
      </View>

      {/* Categories below if present */}
      {categories.length > 0 && (
        <View>
          <CategoryFilter
            categories={categories}
            isDesktop={isDesktop}
            handleCategoryClick={handleCategoryClick}
          />
        </View>
      )}
    </View>
  );
}
