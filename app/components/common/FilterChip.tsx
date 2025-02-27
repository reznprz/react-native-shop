import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFilterIcon } from 'app/hooks/utils/getFilterIcon';
import { StatusChip } from './StatusChip';
import CustomIcon from './CustomIcon';

interface FilterChipProps {
  label: string;
  filterName: string;
  isSelected: boolean;
  onSelect: (selectedLabel: string) => void;
  chipStatus?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({
  filterName,
  isSelected,
  onSelect,
  label,
  chipStatus,
}) => {
  const { iconName, iconType } = getFilterIcon(filterName, label);

  return (
    <Pressable
      onPress={() => onSelect(label)}
      style={[styles.categoryChip, isSelected && { backgroundColor: '#2a4759' }]}
    >
      <View className="flex-row items-center gap-2">
        <CustomIcon
          type={iconType}
          name={iconName}
          size={20}
          color={isSelected ? '#fff' : '#000'}
        />

        <Text style={[styles.filterText, isSelected ? { color: '#fff' } : { color: '#000' }]}>
          {label}
        </Text>
        {chipStatus && chipStatus !== 'All' && <StatusChip status={chipStatus} hideText={true} />}
      </View>
    </Pressable>
  );
};

export default FilterChip;

const styles = StyleSheet.create({
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB', // Default gray background
    margin: 2,
  },
  filterText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
