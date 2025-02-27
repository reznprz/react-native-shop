import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OrderItem } from 'app/redux/cartSlice';
import PaymentChip from './PaymentChip';
import EmptyState from '../common/EmptyState';
import CustomButton from '../common/button/CustomButton';
import PaymentInput from './PaymentInput';
import IconLabel from '../common/IconLabel';

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
    <View className="p-4 flex-1 justify-between">
      {/* Heading */}
      <IconLabel iconName="cash-register" label={'Payment Details'} />
      {/* Order Summary Section */}
      {items && items.length > 0 ? (
        <View className="mb-4 bg-gray-100 p-4 rounded-lg mt-2">
          <IconLabel iconName="receipt" label="Order Summary" />
          {items.map((item, index) => (
            <View key={index} className="flex-row justify-between mb-1">
              <View className="flex-row px-2">
                <Text className="text-gray-700">{item.productName}</Text>
                <Text className="text-gray-700 pl-2">{`x${item.quantity.toFixed(2)}`}</Text>
              </View>
              <Text className="text-gray-700">{`$${(item.price * item.quantity).toFixed(2)}`}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Payment Methods */}
      <View className="bg-white mt-2">
        <IconLabel iconName="document-text-outline" label={'Payment Methods'} iconType="Ionicons" />

        {/* Payment Selection */}
        <View className="flex flex-row flex-wrap justify-center gap-2 mb-4">
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
      <View className="flex-row justify-between items-center mb-4 pt-4">
        {/* Discount Label */}
        <IconLabel
          iconName="pricetag-outline"
          label={'Discount'}
          containerStyle="justify-between"
          iconType="Ionicons"
        />

        {/* Discount Input Field */}
        <TextInput
          placeholder="Enter discount amount"
          keyboardType="numeric"
          className="bg-gray-100 text-gray-800 border border-gray-300 rounded-lg p-3 focus:border-deepTeal focus:ring focus:ring-deepTeal/30"
          onChangeText={(text) => setDiscount(parseFloat(text) || 0)}
        />
      </View>
      {/* Divider */}
      <View className="w-full h-px bg-gray-300 my-3" />
      {/* Subtotal, Discount, Total */}
      <View className="bg-white rounded-lg p-4 shadow-md">
        {/* Subtotal */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700 text-base">{'Subtotal'}</Text>
          <Text className="text-gray-700 text-base">{'41'}</Text>
        </View>

        {/* Discount */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700 text-base">{'Discount'}</Text>
          {/* Red for negative amount */}
          <Text className="text-red-500 text-base">-{'10'}</Text>
        </View>

        {/* Total */}
        <View className="flex-row justify-between">
          <Text className="font-bold text-lg text-gray-900">{'Total'}</Text>
          <Text className="font-bold text-lg text-gray-900">{'31'}</Text>
        </View>
      </View>
      {/* Complete Order Button */}
      <CustomButton
        title="Complete Order"
        onPress={() => {}}
        width="full"
        height="l"
        textSize="text-xl"
      />
    </View>
  );
};

export default PaymentDetails;
