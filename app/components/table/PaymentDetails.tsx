import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OrderItem } from 'app/redux/cartSlice';
import PaymentChip from './PaymentChip';
import EmptyState from '../common/EmptyState';
import CustomButton from '../common/button/CustomButton';
import PaymentInput from './PaymentInput';

const paymentTypes = ['cash', 'e-sewa', 'fone-pay', 'credit'];

interface PaymentDetailsProps {
  orderItems: OrderItem[];
  setDiscount: (amount: number) => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ orderItems, setDiscount }) => {
  const items = orderItems || [];
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  // Toggle Payment Selection
  const handlePaymentSelection = (type: string) => {
    setSelectedPayments((prev) =>
      prev.includes(type) ? prev.filter((p) => p !== type) : [...prev, type],
    );
  };

  return (
    <View>
      {/* Heading */}
      <Text className="text-lg font-bold mb-4 text-deepTeal">Payment Details</Text>
      {/* Order Summary Section */}
      <View className="mb-4 bg-gray-100 p-4 rounded-lg">
        <Text className="text-lg font-semibold mb-2 text-deepTeal">Order Summary</Text>
        {!items || items.length === 0 ? (
          <EmptyState
            iconName="food-off"
            message="No food items available"
            subMessage="Please check back later or add items to the cart."
            iconSize={30}
          />
        ) : (
          items.map((item, index) => (
            <View key={index} className="flex-row justify-between mb-1">
              <View className="flex-row px-2">
                <Text className="text-gray-700">{`${item.productName}`}</Text>
                <Text className="text-gray-700 pl-2">{`x${item.quantity.toFixed(2)}`}</Text>
              </View>
              <Text className="text-gray-700">{`$${(item.price * item.quantity).toFixed(2)}`}</Text>
            </View>
          ))
        )}
      </View>
      {/* Payment Methods */}
      <View className="p-4 bg-white">
        <Text className="text-lg font-semibold mb-2 text-deepTeal">Payment Methods</Text>

        {/* Payment Selection */}
        <View className="flex flex-row flex-wrap justify-center gap-2">
          {paymentTypes.map((type, idx) => (
            <View key={idx} className="p-1">
              <PaymentChip
                paymentType={type}
                isSelected={selectedPayments.includes(type)}
                onSelect={() => handlePaymentSelection(type)}
              />
            </View>
          ))}
        </View>

        {/* Render Payment Inputs Dynamically for Selected Methods */}
        {selectedPayments.map((type, idx) => (
          <PaymentInput key={idx} paymentType={type} onInput={() => {}} />
        ))}
      </View>
      {/* Discount Input */}
      <View className="mb-4">
        {/* Discount Label */}
        <Text className="text-gray-700 text-base font-medium mb-2">Discount</Text>

        {/* Discount Input Field */}
        <TextInput
          placeholder="Enter discount amount"
          keyboardType="numeric"
          className="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg p-3 focus:border-[#2a4759] focus:ring focus:ring-[#2a4759]/30"
          onChangeText={(text) => setDiscount(parseFloat(text) || 0)}
        />
      </View>
      <View className="w-full h-px bg-gray-300 my-3" /> {/* Divider */}
      {/* Subtotal, Discount, Total */}
      <View className="bg-white rounded-lg p-4 shadow-md">
        {/* Subtotal */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700 text-base">Subtotal</Text>
          <Text className="text-gray-700 text-base">${41}</Text>
        </View>

        {/* Discount */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700 text-base">Discount</Text>
          <Text className="text-red-500 text-base">-${10}</Text> {/* Red for negative amount */}
        </View>

        {/* Total */}
        <View className="flex-row justify-between">
          <Text className="font-bold text-lg text-gray-900">Total</Text>
          <Text className="font-bold text-lg text-gray-900">${31}</Text>
        </View>
      </View>
      {/* Complete Order Button */}
      <CustomButton title="Complete Order" onPress={() => {}} width="full" />
    </View>
  );
};

export default PaymentDetails;
