import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from 'app/hooks/useTheme';

interface EmptyStateProps {
  iconName?: string;
  message: string;
  subMessage?: string;
  iconSize?: number;
  containerPadding?: number;
  messageFontSize?: number;
  subMessageFontSize?: number;
  onAddPress?: () => void;
  addButtonLabel?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'food-off',
  message,
  subMessage,
  iconSize = 90,
  containerPadding = 20,
  messageFontSize = 18,
  subMessageFontSize = 14,
  onAddPress,
  addButtonLabel = 'Add Item',
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { padding: containerPadding }]}>
      <MaterialCommunityIcons name={iconName as any} size={iconSize} color={theme.secondary} />
      <Text style={[styles.message, { fontSize: messageFontSize }]}>{message}</Text>
      {subMessage && (
        <Text style={[styles.subMessage, { fontSize: subMessageFontSize }]}>{subMessage}</Text>
      )}
      {onAddPress && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.secondary }]}
          onPress={onAddPress}
        >
          <MaterialCommunityIcons name="plus-circle" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>{addButtonLabel}</Text>
        </TouchableOpacity>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  addButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyState;
