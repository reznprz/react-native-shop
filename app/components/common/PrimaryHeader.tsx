import React from 'react';
import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import PrimaryHeaderFilter from '../FoodMenu/CategoryFilter';
import { RestaurantTable } from 'app/api/services/tableService';

interface PrimaryHeaderProps {
  title: string;
  onBackPress?: () => void;
  onSearch?: (text: string) => void;
  handleFilterClick: (filterName: string) => void;
  onFilterPress?: () => void;
  searchTerm: string;
  showBackPress?: boolean;
  filters?: string[];
  tableInfo?: RestaurantTable[];
  isDesktop?: boolean;
  selectedFilter: string;
}

export default function PrimaryHeader({
  title,
  onBackPress,
  onSearch,
  onFilterPress,
  searchTerm,
  showBackPress = false,
  isDesktop = false,
  filters = [],
  tableInfo,
  handleFilterClick,
  selectedFilter,
}: PrimaryHeaderProps) {
  return (
    <View className="border-b border-gray-200">
      {/* Top row: back arrow, title, search/filter icons */}
      <View className="flex-row items-center justify-between pl-4 pr-4 m-1">
        <View className="flex-row items-center">
          {showBackPress && (
            <Pressable onPress={onBackPress} className="mr-2">
              <Ionicons name="chevron-back" size={24} color="black" />
            </Pressable>
          )}
          <Text className="text-lg font-bold">{title}</Text>
        </View>

        {/* Hide search if onSearch callback is null or not pass in param */}
        {onSearch && (
          <View className="flex-row items-center">
            {isDesktop ? (
              // Desktop: full search input with larger padding and shadow
              <View className="flex-row items-center bg-white rounded-md shadow-md border border-gray-300 max-w-[400px] px-4 py-2">
                <Ionicons name="search" size={20} color="gray" />

                <TextInput
                  placeholder="Search"
                  placeholderTextColor="gray"
                  className="ml-2 mb-1 flex-1 text-base"
                  onChangeText={onSearch}
                  value={searchTerm}
                />
                {searchTerm && searchTerm.length > 0 && (
                  <TouchableOpacity onPress={() => onSearch('')}>
                    <Ionicons name="close-circle" size={20} color="gray" />
                  </TouchableOpacity>
                )}
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
                {searchTerm && searchTerm.length > 0 && (
                  <TouchableOpacity onPress={() => onSearch('')}>
                    <Ionicons name="close-circle" size={20} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Categories below if present */}
      {filters.length > 0 && (
        <View>
          <PrimaryHeaderFilter
            filters={filters}
            isDesktop={isDesktop}
            handleFilterClick={handleFilterClick}
            filterName={title}
            selectedFilter={selectedFilter}
            tableInfo={tableInfo}
          />
        </View>
      )}
    </View>
  );
}
