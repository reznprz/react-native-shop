import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useOrder } from 'app/hooks/useOrder';
import OrderItemSummary from 'app/components/order/OrderItemSummary';
import OrderSummaryCard from 'app/components/order/OrderSummaryCard';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import ErrorMessagePopUp from 'app/components/common/ErrorMessagePopUp';
import EmptyState from 'app/components/common/EmptyState';
import MoreActionOrderDetail from 'app/components/orderDetail/MoreActionOrderDetail';
import TableListModal from 'app/components/modal/TableListModal';
import { useTables } from 'app/hooks/useTables';
import PaymentNotesInfo from 'app/components/orderDetail/PaymentNotesInfo';
import CollapsibleComponent from 'app/components/common/CollapsibleComponent';
import NotificationBar from 'app/components/common/NotificationBar';

interface MenuScreenRouteParams {
  orderId?: string;
  actionType?: string;
}

interface MenuScreenProps {
  route: {
    params: MenuScreenRouteParams;
  };
}

export default function OrderDetailsScreen({ route }: MenuScreenProps) {
  const { orderId, actionType } = route.params || {};
  const {
    order,
    orderDetailScreen,
    addPaymentState,
    canceledOrderState,
    switchTableState,
    switchPaymentState,
    fetchOrderById,
    handleAddPayments,
    handleCancelOrder,
    handleSwitchTable,
    handleSwitchPayment,
  } = useOrder();
  const { tables, handleGoToMenuPress } = useTables();

  const [showSpinner, setShowSpinner] = useState(true);
  const [showMoreActionOrderDetail, setShowMoreActionOrderDetail] = useState(false);
  const [showSwitchTableModal, setShowSwitchTableModal] = useState(false);
  const [successNotification, setSuccessNotificaton] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderById(Number(orderId));
    }
  }, [orderId]);

  useEffect(() => {
    if (!order) {
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [order]);

  useEffect(() => {
    if (actionType && actionType === 'More Action') {
      setShowMoreActionOrderDetail(true);
    } else {
      setShowMoreActionOrderDetail(false);
    }
  }, [actionType]);

  useEffect(() => {
    if (addPaymentState.status === 'success') {
      setShowMoreActionOrderDetail(false);
      setSuccessNotificaton('Payment Added!.');
      addPaymentState.reset?.();
    }
  }, [addPaymentState]);

  useEffect(() => {
    if (canceledOrderState.status === 'success') {
      setShowMoreActionOrderDetail(false);
      setSuccessNotificaton('Order Canceled!.');
      canceledOrderState.reset?.();
    }
  }, [canceledOrderState]);

  useEffect(() => {
    if (switchTableState.status === 'success') {
      setShowMoreActionOrderDetail(false);
      setSuccessNotificaton('Table Switch Successfully!.');
      switchTableState.reset?.();
    }
  }, [switchTableState]);

  useEffect(() => {
    if (switchPaymentState.status === 'success') {
      setShowMoreActionOrderDetail(false);
      setSuccessNotificaton('Payment Switch Successfully!.');
      switchPaymentState.reset?.();
    }
  }, [switchPaymentState]);

  if (!order) {
    return showSpinner ? (
      <FoodLoadingSpinner iconName="hamburger" />
    ) : (
      <EmptyState
        iconName="bag-personal"
        message="No Orders Available"
        subMessage="Please select a different date or re-apply the filter."
        iconSize={80}
      />
    );
  }

  return (
    <>
      {orderDetailScreen?.status === 'pending' ||
      switchTableState.status === 'loading' ||
      switchPaymentState.status === 'loading' ? (
        <View className="flex-1 bg-gray-100 p-4 pb-0">
          <FoodLoadingSpinner iconName="hamburger" />
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {showMoreActionOrderDetail ? (
              <MoreActionOrderDetail
                order={order}
                addPaymentState={addPaymentState}
                canceledOrderState={canceledOrderState}
                handleAddPayment={handleAddPayments}
                handleAddFoodItemsPress={handleGoToMenuPress}
                handleSiwtchTablePress={() => {
                  setShowSwitchTableModal(true);
                }}
                handleCancelOrderPress={() => {
                  handleCancelOrder(order.orderId);
                }}
                handleSwitchPayment={handleSwitchPayment}
              />
            ) : (
              <View className="space-y-4">
                <OrderSummaryCard
                  order={order}
                  containerStyle="p-4 rounded-xl bg-white shadow-md m-2"
                />
                <OrderItemSummary
                  order={order}
                  containerStyle="p-4 rounded-xl bg-white shadow-md m-2"
                />
                {order.groupedPaymentByNotesAndDate && (
                  <View className="p-4 rounded-xl bg-white shadow-md m-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <CollapsibleComponent
                      title={'Payment Notes'}
                      containerStyle={{}}
                      headerStyle={{ padding: 2 }}
                      childContentStyle={{ padding: 4 }}
                    >
                      <PaymentNotesInfo
                        groupedPaymentByNotesAndDate={order.groupedPaymentByNotesAndDate}
                      />
                    </CollapsibleComponent>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </>
      )}

      <TableListModal
        tables={tables.filter((table) => table.status.toLocaleLowerCase() === 'available')}
        visible={showSwitchTableModal}
        onClose={() => setShowSwitchTableModal(false)}
        onSelectTable={(selectedTable) => {
          setShowSwitchTableModal(false);
          handleSwitchTable(order.orderId, selectedTable);
        }}
      />

      <ErrorMessagePopUp
        errorMessage={orderDetailScreen?.error?.message || ''}
        onClose={() => orderDetailScreen?.reset?.()}
      />

      <NotificationBar message={successNotification} onClose={() => setSuccessNotificaton('')} />
    </>
  );
}
