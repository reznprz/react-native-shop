import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { useTheme } from 'app/hooks/useTheme';

interface TopBarProps {
  activeTopBar: string;
  showSwitchTable: boolean;
  onTopBarClick: (selected: string) => void;
  onFoodClick: () => void;
  onCategoryClick: () => void;
  onTopBreakFastClick: () => void;
  onTopLunchClick: () => void;
  onTopDrinkClick: () => void;
  onSwitchTableClick?: () => void;
  onTableClick: () => void;
  onAddFoodClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  activeTopBar,
  showSwitchTable,
  onFoodClick,
  onCategoryClick,
  onSwitchTableClick,
  onTopBreakFastClick,
  onTopLunchClick,
  onTopDrinkClick,
  onTableClick,
  onTopBarClick,
  onAddFoodClick,
}) => {
  const theme = useTheme();

  // Define common buttons
  const buttons = [
    { label: 'Table', action: onTableClick },
    { label: 'Food', action: onFoodClick },
    { label: 'Category', action: onCategoryClick },
    { label: 'Top Breakfast', action: onTopBreakFastClick },
    { label: 'Top Lunch', action: onTopLunchClick },
    { label: 'Top Drink', action: onTopDrinkClick },
    { label: 'Add Food', action: onAddFoodClick },
  ];

  // Conditionally add 'Switch Table' button
  if (showSwitchTable) {
    buttons.push({ label: 'Switch Table', action: () => onSwitchTableClick?.() });
  }

  // Handle button press
  const handlePress = (label: string, action: () => void) => {
    onTopBarClick(label);
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
          const isSelected = activeTopBar === btn.label;
          return (
            <TouchableOpacity
              key={btn.label}
              style={[
                styles.button,
                isSelected && { backgroundColor: theme.buttonBg },
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
    // Add web-specific styling if needed
  },
});
