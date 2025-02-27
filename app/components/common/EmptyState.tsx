import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface EmptyStateProps {
  iconName?: string;
  message: string;
  subMessage?: string;
  iconSize?: number;
  containerPadding?: number;
  messageFontSize?: number;
  subMessageFontSize?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'food-off',
  message,
  subMessage,
  iconSize = 90,
  containerPadding = 20,
  messageFontSize = 18,
  subMessageFontSize = 14,
}) => {
  return (
    <View style={[styles.container, { padding: containerPadding }]}>
      <MaterialCommunityIcons name={iconName as any} size={iconSize} color="#2a4759" />
      <Text style={[styles.message, { fontSize: messageFontSize }]}>{message}</Text>
      {subMessage && (
        <Text style={[styles.subMessage, { fontSize: subMessageFontSize }]}>{subMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subMessage: {
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default EmptyState;
