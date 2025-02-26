import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AllFiltersModal } from '../modal/AllFiltersModal';
import FilterChip from '../common/FilterChip';

interface PrimaryHeaderFilterProps {
  filters: string[];
  isDesktop?: boolean;
  handleFilterClick: (selectedFilter: string) => void;
  filterName: string;
  selectedFilter: string;
}

export default function PrimaryHeaderFilter({
  filters,
  isDesktop = false,
  handleFilterClick,
  filterName,
  selectedFilter,
}: PrimaryHeaderFilterProps) {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showMoreDesktop, setShowMoreDesktop] = useState(false);

  const uniqueFilters = Array.from(new Set(['All', 'None', ...filters]));
  const MAX_DESKTOP_ROW = 9;
  const visibleDesktopFilters = showMoreDesktop
    ? uniqueFilters
    : uniqueFilters.slice(0, MAX_DESKTOP_ROW);

  const handleMobileToggle = () => {
    setShowBottomSheet((prev) => !prev);
  };

  const handleDesktopToggle = () => {
    setShowMoreDesktop((prev) => !prev);
  };

  return isDesktop ? (
    <View className="pt-2">
      <View className="flex-row flex-wrap gap-1 pl-4 pr-4 pb-2">
        {visibleDesktopFilters.map((filterLable) => (
          <FilterChip
            key={filterLable}
            filterName={filterName}
            label={filterLable}
            isSelected={filterLable === selectedFilter}
            onSelect={(value) => {
              handleFilterClick(value);
              setShowMoreDesktop(false);
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
            {showMoreDesktop ? `Show Less ${filterName}` : `View All ${filterName}`}
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
          {uniqueFilters.map((filterLable) => (
            <FilterChip
              key={filterLable}
              filterName={filterName}
              label={filterLable}
              isSelected={filterLable === selectedFilter}
              onSelect={(cat) => {
                handleFilterClick(cat);
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
            {showMoreDesktop ? `Show Less ${filterName}` : `View All ${filterName}`}
          </Text>
        </View>
      </Pressable>

      <AllFiltersModal
        title={filterName}
        visible={showBottomSheet}
        onClose={handleMobileToggle}
        filters={uniqueFilters}
        selectedFilter={selectedFilter}
        onSelectFilter={(selectedFilter) => {
          handleFilterClick(selectedFilter);
          setShowBottomSheet(false);
        }}
      />
    </View>
  );
}
