import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import CustomIcon from './CustomIcon';
import { RestaurantTheme } from 'app/theme/theme';

interface RemovalChipProps {
  theme: RestaurantTheme;
  label: string;
  onRemove: (label: string) => void;
}

/**
 * A chip that displays a label + close “X” icon.
 * When pressed, it calls `onRemove(label)`.
 */
const RemovalChip: React.FC<RemovalChipProps> = ({ theme, label, onRemove }) => {
  return (
    <Pressable
      onPress={() => onRemove(label)}
      style={[styles.removalChip, { backgroundColor: theme.buttonBg }]}
    >
      <Text style={[styles.removalChipText, { color: theme.textPrimary }]}>{label}</Text>
      <CustomIcon name="close" size={16} color={theme.secondaryBg} type="MaterialIcons" />
    </Pressable>
  );
};

export default RemovalChip;

const styles = StyleSheet.create({
  removalChip: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 6,
  },
});
