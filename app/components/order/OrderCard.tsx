import { View } from 'react-native';

import React from 'react';
import OrderSummaryCard from './OrderSummaryCard';
import OrderItemSummary from './OrderItemSummary';
import { OrderDetails } from 'app/api/services/orderService';

type OrderCardProps = {
  order: OrderDetails;
  onMoreActionPress?: (order: OrderDetails) => void;
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onMoreActionPress }) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-md mb-2">
      <OrderSummaryCard order={order} />
      <OrderItemSummary order={order} onMoreActionPress={onMoreActionPress} />
    </View>
  );
};

export default OrderCard;
