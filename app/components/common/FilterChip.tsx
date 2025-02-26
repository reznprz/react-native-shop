import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFilterIcon } from 'app/hooks/utils/getFilterIcon';

interface FilterChipProps {
  label: string;
  filterName: string;
  isSelected: boolean;
  onSelect: (selectedLabel: string) => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ filterName, isSelected, onSelect, label }) => {
  return (
    <Pressable
      onPress={() => onSelect(label)}
      style={[styles.categoryChip, isSelected && { backgroundColor: '#2a4759' }]}
    >
      <View style={styles.iconTextRow}>
        <Ionicons
          name={getFilterIcon(filterName, label) as keyof typeof Ionicons.glyphMap}
          size={16}
          color={isSelected ? '#fff' : '#000'}
          style={{ marginRight: 4 }}
        />
        <Text style={[styles.categoryText, isSelected ? { color: '#fff' } : { color: '#000' }]}>
          {label}
        </Text>
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
  categoryText: {
    fontWeight: '600',
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
});
