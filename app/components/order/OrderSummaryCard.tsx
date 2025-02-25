import React from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { OrderDetails } from 'app/hooks/useOrder';
import { StatusChip } from '../common/StatusChip';

type OrderSummaryProps = {
  order: OrderDetails;
};

const OrderSummaryCard: React.FC<OrderSummaryProps> = ({ order }) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-2">
      {/* Order ID & Status Row */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row justify-between items-center">
          <View className="w-8 h-8 rounded-full bg-paleSkyBlue flex items-center justify-center mr-3">
            <FontAwesome5 name="clipboard-list" size={14} color="" />
          </View>
          <Text className="font-semibold text-sm">{`#ORD-${order.id}`}</Text>
        </View>
        <StatusChip status={order.status} />
      </View>

      {/* Order Details */}
      <View className="flex-col justify-between m-2 mr-4">
        <View className="flex-row justify-between">
          <View className="flex-row items-center mt-1 gap-1">
            <FontAwesome5 name="clock" size={12} color="gray" />
            <Text className="text-gray-500 text-sm ml-1">
              {order.date} • {order.time}
            </Text>
          </View>
          <View className="flex-row items-center mt-1 gap-1">
            <FontAwesome5 name="table" size={12} color="gray" />
            <Text className="text-gray-500 text-sm">{order.table}</Text>
          </View>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-row items-center mt-1 gap-1">
            <FontAwesome5 name="money-bill-wave" size={12} color="gray" />
            <Text className="font-semibold text-sm">${order.total.toFixed(2)}</Text>
          </View>
          <View className="flex-row items-center mt-1 gap-1">
            <FontAwesome5 name="utensils" size={12} color="gray" />
            <Text className="text-gray-500 text-sm">{order.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderSummaryCard;
