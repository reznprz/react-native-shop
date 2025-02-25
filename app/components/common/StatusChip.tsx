import React from 'react';
import { View, Text } from 'react-native';

type StatusChipProps = {
  status: string;
};

export function StatusChip({ status }: StatusChipProps) {
  return (
    <View
      className={`px-2 py-1 rounded-xl border ${
        status === 'Available' ? 'bg-gray-100 border-green-400' : 'bg-gray-200 border-white'
      }`}
    >
      <Text
        className={`text-xs font-semibold ${status === 'Available' ? 'text-green-600' : 'text-black-600'}`}
      >
        {status}
      </Text>
    </View>
  );
}
