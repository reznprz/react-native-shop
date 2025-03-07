import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AllFiltersModal } from '../modal/AllFiltersModal';
import FilterChip from '../common/FilterChip';
import { RestaurantTable } from 'app/api/services/tableService';

interface PrimaryHeaderFilterProps {
  filters: string[];
  tableInfo?: RestaurantTable[];
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
  tableInfo,
}: PrimaryHeaderFilterProps) {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showMoreDesktop, setShowMoreDesktop] = useState(false);

  const uniqueFilters = Array.from(new Set(['None', ...filters]));
  const MAX_DESKTOP_ROW = 8;
  const visibleDesktopFilters = showMoreDesktop
    ? uniqueFilters
    : uniqueFilters.slice(0, MAX_DESKTOP_ROW);

  const handleMobileToggle = () => {
    setShowBottomSheet((prev) => !prev);
  };

  const handleDesktopToggle = () => {
    setShowMoreDesktop((prev) => !prev);
  };

  const getTableStatus = useCallback(
    (tableName: string) => {
      return tableInfo?.find((table) => table.tableName === tableName)?.status;
    },
    [tableInfo],
  );

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
            chipStatus={getTableStatus(filterLable)}
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
          <Text className="text-lg font-semibold text-[#2a4759]">
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
              chipStatus={getTableStatus(filterLable)}
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
          <Text className="text-base font-semibold text-[#2a4759]">
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
        tableInfo={tableInfo}
      />
    </View>
  );
}
