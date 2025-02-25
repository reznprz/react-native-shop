import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { OrderDetails } from 'app/hooks/useOrder';
import PaymentChip from '../table/PaymentChip';

type OrderItemSummaryProps = {
  order: OrderDetails;
};

const OrderItemSummary: React.FC<OrderItemSummaryProps> = ({ order }) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* Table Name & Status */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row justify-between items-center">
          <View className="w-8 h-8 rounded-full bg-paleSkyBlue flex items-center justify-center mr-3">
            <FontAwesome5 name="utensils" size={14} color="" />
          </View>
          <Text className="font-semibold text-sm">{'Order Items'}</Text>
        </View>
        <Text className="font-semibold text-sm">{'4'}</Text>
      </View>
      {order.items.map((item) => (
        <View key={item.id} className="flex-row justify-between items-center py-1">
          <Text className="text-gray-700">
            {item.quantity}x {item.name}
          </Text>
          <Text className="text-gray-700 font-semibold">${item.price.toFixed(2)}</Text>
        </View>
      ))}
      <View className="border-b border-gray-200 my-3" />
      {/* Payment Details */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row justify-between items-center">
          <View className="w-8 h-8 rounded-full bg-paleSkyBlue flex items-center justify-center mr-3">
            <FontAwesome5 name="credit-card" size={14} color="" />
          </View>
          <Text className="font-semibold text-md ">{'Payment Details'}</Text>
        </View>
      </View>
      <PaymentChip paymentType={order.paymentMethod} />
      {/* Subtotal, Tax, Tip */}
      <View className="mt-2">
        <View className="flex-row justify-between py-1">
          <Text className="text-gray-600">{'Subtotal'}</Text>
          <Text className="text-gray-700 font-semibold">${(order.total * 0.75).toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between py-1">
          <Text className="text-gray-600">{`Tax (10%)`}</Text>
          <Text className="text-gray-700 font-semibold">${(order.total * 0.1).toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between py-1">
          <Text className="text-gray-600">{'Tip'}</Text>
          <Text className="text-gray-700 font-semibold">${(order.total * 0.15).toFixed(2)}</Text>
        </View>
      </View>
      <View className="border-b border-gray-200 my-3" />
      {/* Total */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row justify-between items-center">
          <View className="w-8 h-8 rounded-full bg-paleSkyBlue flex items-center justify-center mr-3">
            <FontAwesome5 name="money-bill-wave" size={14} color="" />
          </View>
          <Text className="font-semibold text-sm">{'Total'}</Text>
        </View>
        <Text className="font-semibold text-sm">${order.total.toFixed(2)}</Text>
      </View>

      {/* <View className="flex-row mt-4">
        <TouchableOpacity className="flex-1 py-3 border border-blue-500 rounded-lg mr-2">
          <Text className="text-center text-blue-500 font-semibold">Print Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 py-3 bg-blue-500 rounded-lg">
          <Text className="text-center text-white font-semibold">Email Invoice</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default OrderItemSummary;
