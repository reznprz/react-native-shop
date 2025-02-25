import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import React from 'react';
import { OrderDetails } from 'app/hooks/useOrder';
import OrderSummaryCard from './OrderSummaryCard';
import OrderItemSummary from './OrderItemSummary';

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
