import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getPaymentTypeIcon } from 'app/hooks/utils/getPaymentTypeIcon';

interface PaymentChipProps {
  paymentType: string;
  isSelected: boolean;
  onSelect: (category: string) => void;
}

const PaymentChip: React.FC<PaymentChipProps> = ({ paymentType, isSelected, onSelect }) => {
  return (
    <Pressable
      onPress={() => onSelect(paymentType)}
      className={`w-24 h-20 rounded-lg border border-gray-300 flex items-center justify-between p-2 ${
        isSelected ? 'bg-deepTeal' : 'bg-white'
      }`}
    >
      <Ionicons
        name={getPaymentTypeIcon(paymentType)}
        size={28}
        color={isSelected ? '#fff' : '#000'}
      />
      <Text className={`text-sm ${isSelected ? 'text-white' : 'text-black'}`}>{paymentType}</Text>
    </Pressable>
  );
};

export default PaymentChip;

const styles = StyleSheet.create({
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6', // Default gray background
    margin: 2,
  },
});
