import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';

interface TopBarProps {
  onCategoryClick: () => void;
  onSwitchTableClick?: (seatName: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ onCategoryClick, onSwitchTableClick }) => {
  const [selected, setSelected] = useState<string>('Category');

  const buttons = [
    { label: 'Category', action: onCategoryClick },
    { label: 'Top Breakfast', action: () => {} },
    { label: 'Top Lunch', action: () => {} },
    { label: 'Top Drink', action: () => {} },
    { label: 'Add Food', action: () => {} },
    { label: 'Switch Table', action: () => onSwitchTableClick?.('switch') },
  ];

  const handlePress = (label: string, action: () => void) => {
    setSelected(label);
    action();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttonContainer}
      >
        {buttons.map((btn) => {
          const isSelected = selected === btn.label;
          return (
            <TouchableOpacity
              key={btn.label}
              style={[
                styles.button,
                isSelected && styles.buttonSelected,
                Platform.OS === 'web' && styles.webButton,
              ]}
              onPress={() => handlePress(btn.label, btn.action)}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
                {btn.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    zIndex: 100,
    elevation: 4,
    marginLeft: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  button: {
    marginRight: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#e1e6ea',
    borderRadius: 6,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  buttonSelected: {
    backgroundColor: '#2a4759',
  },
  buttonText: {
    color: '#2a4759',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonTextSelected: {
    color: '#ffffff',
  },
  webButton: {
    // Add cursor styling or platform-specific tweaks here
    // We can't add transitions due to type restrictions
  },
});
