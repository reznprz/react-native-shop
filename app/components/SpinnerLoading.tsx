import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'app/hooks/useTheme';

export default function SpinnerLoading() {
  const theme = useTheme();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color={theme.secondary} />
    </View>
  );
}
