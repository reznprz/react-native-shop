import React from 'react'; // Import React explicitly
import { useOrder } from 'app/hooks/useOrder';
import OrderItemSummary from 'app/components/order/OrderItemSummary';
import OrderSummaryCard from 'app/components/order/OrderSummaryCard';

export default function OrderDetailsScreen() {
  const { orders } = useOrder();
  const order = orders.length > 0 ? orders[0] : null;

  return order ? (
    <>
      <OrderSummaryCard order={order} containerStyle="p-4 m-2" />
      <OrderItemSummary order={order} containerStyle="p-4 m-2" />
    </>
  ) : null;
}
