import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { getFilterIcon } from 'app/hooks/utils/getFilterIcon';
import { StatusChip } from './StatusChip';
import CustomIcon from './CustomIcon';
import { useTheme } from 'app/hooks/useTheme';

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
  const theme = useTheme();

  const { iconName, iconType } = getFilterIcon(filterName, label);

  return (
    <Pressable
      onPress={() => onSelect(label)}
      style={[styles.categoryChip, isSelected && { backgroundColor: theme.buttonBg }]}
    >
      <View className="flex-row items-center gap-2">
        <CustomIcon
          type={iconType}
          name={iconName}
          size={24}
          color={isSelected ? theme.textPrimary : theme.textSecondary}
        />

        <Text
          style={[
            styles.filterText,
            isSelected ? { color: theme.textPrimary } : { color: theme.textSecondary },
          ]}
        >
          {label}
        </Text>
        {chipStatus && chipStatus !== 'All' && (
          <StatusChip status={chipStatus} hideText={true} applyBg={false} />
        )}
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
