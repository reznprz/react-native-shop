import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FilterStatus } from './filter';

interface FiltersSectionProps {
  containerStyle?: object;
  title: string;
  filters: FilterStatus[];
  context: (filter: FilterStatus) => ReactNode; // Pass context as a function
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  containerStyle,
  title,
  filters,
  context,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.filterText}>{title}</Text>

      <View style={styles.chipsContainer}>
        {filters.map((filter, index) => (
          <View key={index}>{context(filter)}</View>
        ))}
      </View>
    </View>
  );
};

export default FiltersSection;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  filterText: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
});
