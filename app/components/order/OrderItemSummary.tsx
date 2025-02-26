import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { OrderDetails } from 'app/hooks/useOrder';
import PaymentChip from '../table/PaymentChip';
import IconLabel from '../common/IconLabel';

type OrderItemSummaryProps = {
  order: OrderDetails;
  containerStyle?: string;
};

const OrderItemSummary: React.FC<OrderItemSummaryProps> = ({ order, containerStyle = '' }) => {
  return (
    <View className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${containerStyle}`}>
      {/* Table Name & Status */}
      <View className="flex-row justify-between items-center mb-2">
        <IconLabel iconName="utensils" label={'Order Items'} containerStyle="justify-between" />
        <Text className="font-semibold text-sm">{'4'}</Text>
      </View>
      {order.items.map((item) => (
        <View key={item.id} className="flex-row justify-between items-center py-1">
          <Text className="text-gray-700 text-lg" numberOfLines={2} ellipsizeMode="tail">
            {item.quantity}x {item.name}
          </Text>
          <Text className="text-gray-700 font-semibold text-lg">${item.price.toFixed(2)}</Text>
        </View>
      ))}
      <View className="border-b border-gray-200 my-3" />
      {/* Payment Details */}
      <View className="flex-row justify-between items-center mb-2">
        <IconLabel
          iconName="credit-card"
          label={'Payment Details'}
          containerStyle="justify-between"
        />
      </View>
      <PaymentChip paymentType={order.paymentMethod} />
      {/* Subtotal, Tax, Tip */}
      <View className="mt-2">
        <View className="flex-row justify-between py-1">
          <Text className="text-gray-600">{'Subtotal'}</Text>
          <Text className="text-gray-700 font-semibold text-lg">
            ${(order.total * 0.75).toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between py-1">
          <Text className="text-gray-600">{`Discount`}</Text>
          <Text className="text-gray-700 font-semibold">${(order.total * 0.1).toFixed(2)}</Text>
        </View>
      </View>
      <View className="border-b border-gray-200 my-3" />
      {/* Total */}
      <View className="flex-row justify-between items-center mb-2">
        <IconLabel iconName="money-bill-wave" label={'Total'} containerStyle="justify-between" />
        <Text className="font-semibold text-lg">${order.total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default OrderItemSummary;
