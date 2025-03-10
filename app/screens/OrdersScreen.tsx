import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useOrder } from 'app/hooks/useOrder';
import OrderCard from 'app/components/order/OrderCard';
import OrderMetrics from 'app/components/OrderMetrics';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import OrderSummaryCard from 'app/components/order/OrderSummaryCard';
import { navigate } from 'app/navigation/navigationService';
import { ScreenNames } from 'app/types/navigation';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import ErrorMessagePopUp from 'app/components/common/ErrorMessagePopUp';
import EmptyState from 'app/components/common/EmptyState';
import { OrderDetails } from 'app/api/services/orderService';
import { FiltersBottomSheetModal } from 'app/components/filter/FiltersBottomSheetModal';
import OrderScreenHeader from 'app/components/common/OrderScreenHeader';
import { removedFilter } from 'app/components/filter/filter';

export default function OrdersScreen() {
  const {
    orders,
    totalAmount,
    paidAmount,
    unpaidAmount,
    totalOrders,
    orderStatuses,
    paymentStatuses,
    orderTypes,
    paymentMethods,
    orderScreenState,
    fetchOrders,
    handleApplyFilters,
  } = useOrder();
  const { isLargeScreen } = useIsDesktop();
  const [selectedDate, setSelectedDate] = useState('Today');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders({ date: selectedDate, orderStatuses: ['CREATED', 'COMPLETED'] });
  }, [selectedDate]);

  const handleOrderPress = (order: OrderDetails) => {
    navigate(ScreenNames.ORDER_DETAILS, { orderId: order.orderId.toString() });
  };

  return (
    <View className="flex-1 bg-gray-100 p-4 pb-0">
      <OrderScreenHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onFilterPress={() => setShowFilters(true)}
        orderStatuses={orderStatuses}
        paymentMethods={paymentMethods}
        orderTypes={orderTypes}
        paymentStatuses={paymentStatuses}
        onRemoveFilter={(removedFilterName) => {
          handleApplyFilters(
            removedFilter(removedFilterName, orderStatuses),
            removedFilter(removedFilterName, paymentStatuses),
            removedFilter(removedFilterName, orderTypes),
            removedFilter(removedFilterName, paymentMethods),
            selectedDate,
          );
        }}
        onOverflowPress={() => {
          setShowFilters(true);
        }}
      />

      {orderScreenState?.status === 'pending' ? (
        <FoodLoadingSpinner iconName="coffee" />
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          iconName="bag-personal"
          message="No Orders available"
          subMessage="Please select different Date or re-apply filter."
          iconSize={80}
        />
      ) : (
        /*  show the order metrics & order list */
        <>
          <OrderMetrics
            totalAmount={totalAmount}
            paidAmount={paidAmount}
            unpaidAmount={unpaidAmount}
            totalOrders={totalOrders}
            isLargeScreen={isLargeScreen}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className={`flex gap-2 ${isLargeScreen ? 'flex-row flex-wrap' : ''}`}>
              {orders.map((order) =>
                isLargeScreen ? (
                  <OrderCard key={order.orderId} order={order} />
                ) : (
                  <TouchableOpacity key={order.orderId} onPress={() => handleOrderPress(order)}>
                    <OrderSummaryCard order={order} />
                  </TouchableOpacity>
                ),
              )}
            </View>
          </ScrollView>
        </>
      )}

      <ErrorMessagePopUp
        errorMessage={orderScreenState?.error?.message || ''}
        onClose={() => orderScreenState?.reset?.()}
      />

      <FiltersBottomSheetModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        orderStatuses={orderStatuses}
        paymentStatuses={paymentStatuses}
        orderTypes={orderTypes}
        paymentMethods={paymentMethods}
        onApplyFilters={(...p) => handleApplyFilters(...p, selectedDate)}
      />
    </View>
  );
}
