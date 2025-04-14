import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FilterStatus } from '../filter/filter'; // or your correct path
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import RemovalChip from '../common/RemovalChip';
import OverflowChip from '../common/OverflowChip';

interface FilterHeaderProps {
  filters: FilterStatus[];
  onRemoveFilter: (label: string) => void;
  onOverflowPress: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  filters,
  onRemoveFilter,
  onOverflowPress,
}) => {
  const [displayedFilters, setDisplayedFilters] = useState<FilterStatus[]>([]);
  const [overflowCount, setOverflowCount] = useState(0);
  const { width } = useIsDesktop();

  useEffect(() => {
    // The approximate width of each chip
    const chipWidth = 100;
    // Subtract some space for margins, the Filter button, etc.
    const totalWidth = width - 180;
    const maxChips = Math.floor(totalWidth / chipWidth);

    if (filters.length > maxChips) {
      // Show (maxChips - 1) chips + OverflowChip
      setDisplayedFilters(filters.slice(0, maxChips - 1));
      setOverflowCount(filters.length - (maxChips - 1));
    } else {
      // No overflow needed
      setDisplayedFilters(filters);
      setOverflowCount(0);
    }
  }, [filters, width]);

  return (
    <View style={styles.container}>
      {displayedFilters.map((f) => (
        <RemovalChip key={f.name} label={f.name} onRemove={onRemoveFilter} />
      ))}
      {overflowCount > 0 && <OverflowChip count={overflowCount} onPress={onOverflowPress} />}
    </View>
  );
};

export default FilterHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
