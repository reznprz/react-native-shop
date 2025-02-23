import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function SpinnerLoading() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#2a4759" />
    </View>
  );
}
