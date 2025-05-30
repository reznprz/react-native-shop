import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { OrderDetails } from 'app/api/services/orderService';
import OrderSummaryCard from '../order/OrderSummaryCard';
import AddPaymentCard from '../order/AddPaymentCard';
import MoreActions from '../order/MoreAction';
import { ButtonState } from '../common/button/LoadingButton';
import { PaymentInfo } from 'app/hooks/useTables';
import CollapsibleComponent from '../common/CollapsibleComponent';
import PaymentNotesInfo from './PaymentNotesInfo';
import SwitchPaymentMethodSelector from './SwitchPaymentMethodSelector';

type MoreActionOrderDetailProps = {
  order: OrderDetails;
  containerStyle?: string;
  addPaymentState: ButtonState;
  canceledOrderState: ButtonState;
  handleAddPayment: (orderId: number, payments: PaymentInfo[]) => void;
  handleSiwtchTablePress: () => void;
  handleAddFoodItemsPress: (selectedTableName: string) => void;
  onCancelOrderPress: () => void;
  handleSwitchPayment: (orderId: number, paymentId: number, selectedPaymentType: string) => void;
};

const MoreActionOrderDetail: React.FC<MoreActionOrderDetailProps> = ({
  order,
  containerStyle = '',
  addPaymentState,
  canceledOrderState,
  handleAddPayment,
  handleSiwtchTablePress,
  handleAddFoodItemsPress,
  onCancelOrderPress,
  handleSwitchPayment,
}) => {
  const [showAddPaymentCollapsible, setShowAddPaymentCollapsible] = useState(true);

  useEffect(() => {
    const paidAmount =
      order.payments
        ?.filter((p) => p.paymentMethod !== 'CREDIT')
        .reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0;
    const unpaidAmount = order.totalAmount - paidAmount;
    if (unpaidAmount === 0 || order.orderStatus === 'CREATED') {
      setShowAddPaymentCollapsible(false);
    }
  }, [order, showAddPaymentCollapsible]);

  const hasCreditPayment = order.payments?.some((p) => p.paymentMethod === 'CREDIT') ?? false;

  return (
    <>
      <View className="space-y-4">
        <OrderSummaryCard order={order} containerStyle="p-4 rounded-xl bg-white  m-2" />
        <View className="p-2 m-1">
          <CollapsibleComponent title="Order Items" iconName="utensils" iconType="FontAwesome5">
            <View className="flex-col justify-between items-center mb-2">
              {order.orderItems.map((item) => (
                <View key={item.id} className="flex-row justify-between items-center py-1">
                  <Text
                    className="text-gray-700 text-xl flex-1"
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {`${item.quantity}x ${item.productName}`}
                  </Text>
                  <Text className="text-gray-700 font-semibold text-xl">
                    रु {item.total.toFixed(2) || 0}
                  </Text>
                </View>
              ))}
            </View>
          </CollapsibleComponent>
        </View>

        {order.payments && order.payments.length > 0 && order.groupedPaymentByNotesAndDate && (
          <View className="p-2 m-1">
            <CollapsibleComponent
              title={'Payment Notes'}
              show={true}
              iconName="credit-card"
              iconType="FontAwesome5"
            >
              <PaymentNotesInfo groupedPaymentByNotesAndDate={order.groupedPaymentByNotesAndDate} />
            </CollapsibleComponent>
          </View>
        )}

        {order.orderStatus === 'COMPLETED' && !hasCreditPayment && (
          <View className="p-2 m-1">
            <CollapsibleComponent
              title={'Switch Payment'}
              show={true}
              iconName="credit-card"
              iconType="FontAwesome5"
            >
              <SwitchPaymentMethodSelector
                paidPaymentTypes={order.payments}
                onSelectPaymentType={(selectedPaymentType, paymentId) => {
                  handleSwitchPayment(order.orderId, paymentId, selectedPaymentType);
                }}
              />
            </CollapsibleComponent>
          </View>
        )}

        {showAddPaymentCollapsible && (
          <AddPaymentCard
            order={order}
            containerStyle="p-2 m-2"
            handleAddPayment={handleAddPayment}
            addPaymentState={addPaymentState}
          />
        )}

        <MoreActions
          showAddFoodButton={order.orderStatus === 'CREATED'}
          showCancelOrderButton={order.orderStatus === 'COMPLETED'}
          canceledOrderState={canceledOrderState}
          onSwitchTable={handleSiwtchTablePress}
          onAddFoodItems={() => {
            handleAddFoodItemsPress(order.tableName);
          }}
          onCancelOrder={onCancelOrderPress}
        />
      </View>
    </>
  );
};

export default MoreActionOrderDetail;
