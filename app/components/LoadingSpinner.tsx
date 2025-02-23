import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const LoadingSpinner: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#2a4759" />
    </View>
  );
};

export default LoadingSpinner;
