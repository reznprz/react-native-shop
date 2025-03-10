import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import CustomIcon from './CustomIcon';

interface RemovalChipProps {
  label: string;
  onRemove: (label: string) => void;
}

/**
 * A chip that displays a label + close “X” icon.
 * When pressed, it calls `onRemove(label)`.
 */
const RemovalChip: React.FC<RemovalChipProps> = ({ label, onRemove }) => {
  return (
    <Pressable onPress={() => onRemove(label)} style={styles.removalChip}>
      <Text style={styles.removalChipText}>{label}</Text>
      <CustomIcon name="close" size={16} color="#fff" type="MaterialIcons" />
    </Pressable>
  );
};

export default RemovalChip;

const styles = StyleSheet.create({
  removalChip: {
    flexDirection: 'row',
    alignItems: 'center',
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
  removalChipText: {
    color: '#fff',
    marginRight: 6,
  },
});
