import React from 'react';
import { View, Text } from 'react-native';
import IconLabel from '../common/IconLabel';

export interface FoodItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface PaymentDetailsFoodItemsSummaryProps {
  items: FoodItem[];
}

const PaymentDetailsFoodItemsSummary: React.FC<PaymentDetailsFoodItemsSummaryProps> = ({
  items,
}) => {
  return (
    <View className="mb-4 bg-gray-100 p-4 rounded-lg mt-2">
      <IconLabel iconName="receipt" label="Order Summary" />
      {items.map((item, index) => (
        <View key={index} className="flex-row justify-between mb-1">
          <View className="flex-row px-2 w-2/3">
            {/* Adjust width to prevent overflow */}
            <Text className="text-gray-700 flex-1" numberOfLines={2} ellipsizeMode="tail">
              {item.productName}
            </Text>
            <Text className="text-gray-700 pl-2">{`x${item.quantity.toFixed(2)}`}</Text>
          </View>
          <Text className="text-gray-700 w-1/3 text-right" numberOfLines={1} ellipsizeMode="tail">
            {`रु ${(item.unitPrice * item.quantity).toFixed(2)}`}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default PaymentDetailsFoodItemsSummary;
