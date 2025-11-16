import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import CustomIcon from './CustomIcon';
import { useTheme } from 'app/hooks/useTheme';

interface CheckableChipProps {
  style?: StyleProp<ViewStyle>;
  label: string;
  isChecked: boolean;
  onClick: (selectedLabel: string) => void;
}

const CheckableChip: React.FC<CheckableChipProps> = ({ style, isChecked, label, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => {
        onClick(label);
      }}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.filterChip,
        {
          backgroundColor: isChecked ? theme.secondary : theme.secondaryBg,
          borderColor: isChecked ? theme.secondary : theme.textSecondary,
          borderWidth: 1.5,
        },
        isPressed && styles.pressedChip,
        style,
        Platform.OS === 'web' && ({ transition: 'background-color 200ms, transform 150ms' } as any),
      ]}
    >
      <View style={styles.contentContainer}>
        {isChecked && (
          <CustomIcon type="MaterialIcons" name="check" size={18} color={theme.textPrimary} />
        )}
        <Text
          style={[
            styles.filterText,
            { color: isChecked ? theme.textPrimary : theme.textSecondary },
            isChecked && styles.checkedText,
          ]}
        >
          {label}
        </Text>
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
  pressedChip: {
    transform: [{ scale: 0.97 }],
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontWeight: '500',
    fontSize: 15,
  },
  checkedText: {
    fontWeight: '600',
  },
});
