import React from 'react';
import { View, Text } from 'react-native';

interface BillingSummaryCardProps {
  subTotal?: number;
  discountAmount?: number;
  totalPrice?: number;
}

const BillingSummaryCard: React.FC<BillingSummaryCardProps> = ({
  subTotal = 0,
  discountAmount = 0,
  totalPrice = 0,
}) => {
  return (
    <View className="bg-white rounded-lg p-4">
      {/* Subtotal */}
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-700 text-base">Subtotal</Text>
        <Text className="text-gray-700 text-base">{subTotal.toFixed(2)}</Text>
      </View>

      {/* Discount */}
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-700 text-base">Discount</Text>
        <Text className="text-red-500 text-base">-{discountAmount.toFixed(2)}</Text>
      </View>

      {/* Total */}
      <View className="flex-row justify-between">
        <Text className="font-bold text-lg text-gray-900">Total</Text>
        <Text className="font-bold text-lg text-gray-900">{totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default BillingSummaryCard;
