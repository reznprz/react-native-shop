import React, { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseBottomSheetModal } from '../common/modal/BaseBottomSheetModal';
import FilterChip from '../common/FilterChip';
import { RestaurantTable } from 'app/api/services/tableService';

interface AllFiltersModalProps {
  title: string;
  tableInfo?: RestaurantTable[];
  visible: boolean;
  onClose: () => void;
  filters: string[];
  selectedFilter: string;
  onSelectFilter: (selectedFilter: string) => void;
}

export const AllFiltersModal: React.FC<AllFiltersModalProps> = ({
  visible,
  onClose,
  filters,
  selectedFilter,
  onSelectFilter,
  title,
  tableInfo,
}) => {
  const getTableStatus = useCallback(
    (tableName: string) => {
      return tableInfo?.find((table) => table.tableName === tableName)?.status;
    },
    [tableInfo],
  );
  return (
    <BaseBottomSheetModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.title}>{`All ${title}`}</Text>
        <Pressable onPress={onClose} style={styles.closeIcon}>
          <Ionicons name="close" size={24} color="#000" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.categoriesContainer}>
          {filters.map((filter) => (
            <FilterChip
              filterName={title}
              key={filter}
              label={filter}
              isSelected={filter === selectedFilter}
              onSelect={onSelectFilter}
              chipStatus={getTableStatus(filter)}
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
