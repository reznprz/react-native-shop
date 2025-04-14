import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CircularInitialNameChipProps {
  initials: string;
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CircularInitialNameChip: React.FC<CircularInitialNameChipProps> = ({
  initials,
  size = 40,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.chip, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Text style={[styles.text, textStyle]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#2A4759',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default CircularInitialNameChip;
