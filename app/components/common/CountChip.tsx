import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CountChipProps {
  count: number;
  style?: ViewStyle;
}

const CountChip: React.FC<CountChipProps> = ({ count, style }) => {
  if (!count || count <= 0) return null;

  return (
    <View style={[styles.countChip, style]}>
      <Text style={styles.countText}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  countChip: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CountChip;
