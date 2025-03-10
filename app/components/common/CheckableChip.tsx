import React from 'react';
import { Pressable, Text, View, StyleSheet, Platform, ViewStyle, StyleProp } from 'react-native';
import CustomIcon from './CustomIcon';

interface CheckableChipProps {
  containerStyle?: string;
  label: string;
  isChecked: boolean;
  onClick: (selectedLabel: string) => void;
}

const CheckableChip: React.FC<CheckableChipProps> = ({
  containerStyle,
  isChecked,
  label,
  onClick,
}) => {
  return (
    <Pressable
      onPress={() => onClick(label)}
      style={({ pressed }): StyleProp<ViewStyle> => {
        const baseStyles: ViewStyle[] = [
          styles.filterChip,
          isChecked ? styles.checkedChip : styles.uncheckedChip,
          pressed ? styles.pressedChip : {},
        ];

        const webStyle =
          Platform.OS === 'web'
            ? ({ transition: 'background-color 200ms, transform 150ms' } as any)
            : {};

        // Flatten the array of styles so that it meets the expected type
        return StyleSheet.flatten([...baseStyles, webStyle]);
      }}
    >
      <View style={styles.contentContainer}>
        {isChecked && <CustomIcon type="MaterialIcons" name="check" size={18} color="#fff" />}
        <Text style={[styles.filterText, isChecked && styles.checkedText]}>{label}</Text>
      </View>
    </Pressable>
  );
};

export default CheckableChip;

const styles = StyleSheet.create({
  filterChip: {
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
  uncheckedChip: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  checkedChip: {
    backgroundColor: '#2A4759',
    borderWidth: 1.5,
  },
  pressedChip: {
    transform: [{ scale: 0.97 }], // Press feedback
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#000',
  },
  checkedText: {
    color: '#fff',
    fontWeight: '600',
  },
});
