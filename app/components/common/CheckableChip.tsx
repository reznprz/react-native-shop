import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import CustomIcon from './CustomIcon';

interface CheckableChipProps {
  style?: StyleProp<ViewStyle>;
  label: string;
  isChecked: boolean;
  onClick: (selectedLabel: string) => void;
}

const CheckableChip: React.FC<CheckableChipProps> = ({ style, isChecked, label, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={() => {
        onClick(label);
      }}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.filterChip,
        isChecked ? styles.checkedChip : styles.uncheckedChip,
        isPressed && styles.pressedChip,
        style,
        Platform.OS === 'web' && ({ transition: 'background-color 200ms, transform 150ms' } as any),
      ]}
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
    transform: [{ scale: 0.97 }],
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 6,
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
