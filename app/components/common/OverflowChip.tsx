import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface OverflowChipProps {
  count: number;
  onPress: () => void;
}

const OverflowChip: React.FC<OverflowChipProps> = ({ count, onPress }) => {
  return (
    <Pressable style={styles.overflowChip} onPress={onPress}>
      <Text style={styles.overflowChipText}>{`+${count} More`}</Text>
    </Pressable>
  );
};

export default OverflowChip;

const styles = StyleSheet.create({
  overflowChip: {
    backgroundColor: '#2A4759',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    margin: 4,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  overflowChipText: {
    color: '#fff',
    fontWeight: '600',
  },
});
