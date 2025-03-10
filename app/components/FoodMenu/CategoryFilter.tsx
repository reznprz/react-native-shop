import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AllFiltersModal } from '../modal/AllFiltersModal';
import FilterChip from '../common/FilterChip';
import { RestaurantTable } from 'app/api/services/tableService';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import OverflowChip from '../common/OverflowChip';

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
  const { width } = useIsDesktop();

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showMoreDesktop, setShowMoreDesktop] = useState(false);
  const [overflowCount, setOverflowCount] = useState(0);
  const [visibleDisplayedFilters, setVisibleDisplayedFilters] = useState<string[]>([]);

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

  useEffect(() => {
    // The approximate width of each chip
    const chipWidth = 100;

    let extraSpacewidth = 520;
    if ('Tables' === filterName) {
      extraSpacewidth = 420;
    }

    // Subtract some space for margins, the Filter button, etc.
    const totalWidth = width - extraSpacewidth;
    const maxChips = Math.floor(totalWidth / chipWidth);

    if (filters.length > maxChips) {
      // Show (maxChips - 1) chips + OverflowChip
      setVisibleDisplayedFilters(showMoreDesktop ? filters : filters.slice(0, maxChips - 1));
      setOverflowCount(filters.length - (maxChips - 1));
    } else {
      // No overflow needed
      setVisibleDisplayedFilters(filters);
      setOverflowCount(0);
    }
  }, [filters, width, showMoreDesktop]);

  return isDesktop ? (
    <View className="pt-2">
      <View className="flex-row flex-wrap gap-1 pl-4 pr-4 pb-2">
        {visibleDisplayedFilters.map((filterLable) => (
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
        {overflowCount > 0 && !showMoreDesktop && (
          <OverflowChip
            count={overflowCount}
            onPress={() => {
              setShowMoreDesktop(true);
            }}
          />
        )}
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
          {filters.map((filterLable) => (
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
        filters={filters}
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
