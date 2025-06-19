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
import { useFocusEffect } from '@react-navigation/native';
import SubTab from 'app/components/common/SubTab';
import CancelReasonModal from 'app/components/modal/CancelReasonModal';
import UserProfileCard from 'app/components/common/UserProfileCard';
import BannerCard from 'app/components/common/BannerCard';

const tabs = ['Details', 'More Actions'];
type TabType = (typeof tabs)[number];

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
  const [activeTab, setActiveTab] = useState<TabType>(actionType ?? 'Details');
  const [showSwitchTableModal, setShowSwitchTableModal] = useState(false);
  const [successNotification, setSuccessNotificaton] = useState('');
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      setActiveTab(actionType === 'Details' ? 'Details' : 'More Actions');
    }, [actionType]),
  );

  useEffect(() => {
    if (addPaymentState.status === 'success') {
      setActiveTab('Details');
      setSuccessNotificaton('Payment Added!.');
      addPaymentState.reset?.();
    }
  }, [addPaymentState]);

  useEffect(() => {
    if (canceledOrderState.status === 'success') {
      setActiveTab('Details');
      setSuccessNotificaton('Order Canceled!.');
      canceledOrderState.reset?.();
    }
  }, [canceledOrderState]);

  useEffect(() => {
    if (switchTableState.status === 'success') {
      setActiveTab('Details');
      setSuccessNotificaton('Table Switch Successfully!.');
      switchTableState.reset?.();
    }
  }, [switchTableState]);

  useEffect(() => {
    if (switchPaymentState.status === 'success') {
      setActiveTab('Details');
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

  const renderOrderDetails = () => (
    <View className="space-y-4">
      <OrderSummaryCard order={order} containerStyle="p-4 rounded-xl bg-white  m-2" />
      <OrderItemSummary order={order} containerStyle="p-4 rounded-xl bg-white  m-2" />
      {order.groupedPaymentByNotesAndDate && (
        <View className="p-4 rounded-xl bg-white  m-2 border border-gray-200">
          <CollapsibleComponent
            title="Payment Notes"
            containerStyle={{}}
            headerStyle={{ padding: 2 }}
            childContentStyle={{ padding: 4 }}
          >
            <PaymentNotesInfo groupedPaymentByNotesAndDate={order.groupedPaymentByNotesAndDate} />
          </CollapsibleComponent>
        </View>
      )}
    </View>
  );

  const renderMoreActions = () => (
    <MoreActionOrderDetail
      order={order}
      addPaymentState={addPaymentState}
      canceledOrderState={canceledOrderState}
      handleAddPayment={handleAddPayments}
      handleAddFoodItemsPress={handleGoToMenuPress}
      handleSiwtchTablePress={() => {
        setShowSwitchTableModal(true);
      }}
      onCancelOrderPress={() => setShowCancelReasonModal(true)}
      handleSwitchPayment={handleSwitchPayment}
    />
  );

  return (
    <View className="h-full w-full bg-gray-100">
      {/* Tab selection */}
      <SubTab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {order.cancelReason && order.cancelReason.length > 0 && (
        <BannerCard
          primaryTitle={order.cancelReason}
          primaryTitleTextColor="text-red-700"
          cardBackgroundColor="bg-red-50 border-red-200 m-2"
          secondaryTitle="Order Canceled Reason"
          iconDetails={{
            iconType: 'Feather',
            iconName: 'x-circle',
            filledColor: '#DC2626', // Tailwind red-600
            bgColor: '',
          }}
        />
      )}

      <UserProfileCard
        name={order.userName}
        imageUri={order.userAvatarUrl}
        initials={order.userInitial}
        email={order.userLastName}
        containerStyle="p-4 rounded-xl bg-white  m-2"
      />

      {/* Main content area */}
      {orderDetailScreen?.status === 'pending' ||
      switchTableState.status === 'loading' ||
      switchPaymentState.status === 'loading' ? (
        <View className="flex-1 bg-gray-100 p-4 pb-0">
          <FoodLoadingSpinner iconName="hamburger" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === 'More Actions' ? renderMoreActions() : renderOrderDetails()}
        </ScrollView>
      )}

      {/* Modal for switching tables */}
      <TableListModal
        tables={tables.filter((table) => table.status.toLowerCase() === 'available')}
        visible={showSwitchTableModal}
        onClose={() => setShowSwitchTableModal(false)}
        onSelectTable={(selectedTable) => {
          setShowSwitchTableModal(false);
          handleSwitchTable(order.orderId, selectedTable);
        }}
      />

      {/* Error popup */}
      <ErrorMessagePopUp
        errorMessage={orderDetailScreen?.error?.message || ''}
        onClose={() => orderDetailScreen?.reset?.()}
      />

      {/* Success notification */}
      <NotificationBar message={successNotification} onClose={() => setSuccessNotificaton('')} />

      <CancelReasonModal
        visible={showCancelReasonModal}
        onRequestClose={() => setShowCancelReasonModal(false)}
        onConfirm={(reason) => {
          setShowCancelReasonModal(false);
          handleCancelOrder(order.orderId, reason);
        }}
      />
    </View>
  );
}
