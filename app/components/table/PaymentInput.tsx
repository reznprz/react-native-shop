import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getPaymentTypeIconforIcons } from 'app/hooks/utils/getPaymentTypeIconforIcons';

interface PaymentInputProps {
  paymentType: string;
  onInput: (price: number) => void;
}

const PaymentInput: React.FC<PaymentInputProps> = ({ paymentType, onInput }) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-gray-100 rounded-lg shadow-md mt-2">
      {/* Left section: icon + label */}
      <View className="flex-row items-center gap-3">
        <Ionicons name={getPaymentTypeIconforIcons(paymentType)} size={28} color={'#374151'} />
        <Text className="text-sm font-medium text-deepTeal">{paymentType}</Text>
      </View>

      {/* Right section: text input */}
      <TextInput
        placeholder="Enter amount"
        placeholderTextColor="#9ca3af" // Tailwind gray-400
        className="bg-white text-deepTeal border border-gray-400 rounded-md px-3 py-2 w-30 text-right"
        keyboardType="numeric"
      />
    </View>
  );
};

export default PaymentInput;
