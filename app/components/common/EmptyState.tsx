import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface EmptyStateProps {
  iconName?: string;
  message: string;
  subMessage?: string;
  iconSize?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'food-off',
  message,
  subMessage,
  iconSize = 90,
}) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={iconName as any} size={iconSize} color="#aaa" />
      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default EmptyState;
