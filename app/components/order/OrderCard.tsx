import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import React from 'react';
import OrderSummaryCard from './OrderSummaryCard';
import OrderItemSummary from './OrderItemSummary';
import { OrderDetails } from 'app/api/services/orderService';

type OrderCardProps = {
  order: OrderDetails;
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-md">
      <OrderSummaryCard order={order} />
      <OrderItemSummary order={order} />
    </View>
  );
};

export default OrderCard;
