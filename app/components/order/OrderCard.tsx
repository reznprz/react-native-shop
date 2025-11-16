import { View } from 'react-native';

import React from 'react';
import OrderSummaryCard from './OrderSummaryCard';
import OrderItemSummary from './OrderItemSummary';
import { OrderDetails } from 'app/api/services/orderService';
import { useTheme } from 'app/hooks/useTheme';

type OrderCardProps = {
  order: OrderDetails;
  onMoreActionPress?: (order: OrderDetails) => void;
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onMoreActionPress }) => {
  const theme = useTheme();

  return (
    <View className=" p-4 rounded-lg mb-2" style={{ backgroundColor: theme.secondaryBg }}>
      <OrderSummaryCard order={order} />
      <OrderItemSummary order={order} onMoreActionPress={onMoreActionPress} />
    </View>
  );
};

export default OrderCard;
