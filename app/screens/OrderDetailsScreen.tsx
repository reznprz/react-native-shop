import React, { useEffect } from 'react';
import { useOrder } from 'app/hooks/useOrder';
import OrderItemSummary from 'app/components/order/OrderItemSummary';
import OrderSummaryCard from 'app/components/order/OrderSummaryCard';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import ErrorMessagePopUp from 'app/components/common/ErrorMessagePopUp';
import EmptyState from 'app/components/common/EmptyState';

interface MenuScreenRouteParams {
  orderId?: string;
}
interface MenuScreenProps {
  route: {
    params: MenuScreenRouteParams;
  };
}

export default function OrderDetailsScreen({ route }: MenuScreenProps) {
  const { orderId } = route.params || {};
  const { order, orderDetailScreen, fetchOrderById } = useOrder();

  useEffect(() => {
    if (orderId) {
      fetchOrderById(Number(orderId));
    }
  }, [orderId]);

  if (!order) {
    return (
      <EmptyState
        iconName="bag-personal"
        message="No Orders available"
        subMessage="Please select different Date or re-apply filter."
        iconSize={80}
      />
    );
  }

  return (
    <>
      {orderDetailScreen?.status === 'pending' ? (
        <FoodLoadingSpinner iconName="hamburger" />
      ) : (
        <>
          <OrderSummaryCard order={order} containerStyle="p-4 m-2" />
          <OrderItemSummary order={order} containerStyle="p-4 m-2" />
        </>
      )}
      <ErrorMessagePopUp
        errorMessage={orderDetailScreen?.error?.message || ''}
        onClose={() => orderDetailScreen?.reset?.()}
      />
    </>
  );
}
