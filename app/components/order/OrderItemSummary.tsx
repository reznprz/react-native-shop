import React, { useState } from 'react';
import { View, Text } from 'react-native';
import PaymentChip from '../table/PaymentChip';
import IconLabel from '../common/IconLabel';
import { OrderDetails } from 'app/api/services/orderService';
import { StatusChip } from '../common/StatusChip';
import CollapsibleInfo from '../common/CollapsibleInfo';
import CustomButton from '../common/button/CustomButton';

type OrderItemSummaryProps = {
  order: OrderDetails;
  containerStyle?: string;
  onMoreActionPress?: (order: OrderDetails) => void;
};

const OrderItemSummary: React.FC<OrderItemSummaryProps> = ({
  order,
  containerStyle = '',
  onMoreActionPress,
}) => {
  const [showMoreAction, setShowMoreAction] = useState(false);
  const paymentStatus = order.paymentStatus ? order.paymentStatus : 'UNPAID';
  const paidAmount = order?.payments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const unpaidAmount = order.totalAmount - paidAmount;

  const hideCollabsibleInfo = order.orderStatus === 'CANCELED';

  const toggleMoreAction = () => {
    setShowMoreAction(!showMoreAction);
  };

  return (
    <View className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${containerStyle}`}>
      <View className="flex-row justify-between items-center mb-2">
        <IconLabel iconName="utensils" label={'Order Items'} containerStyle="justify-between" />
      </View>
      {order.orderItems.map((item) => (
        <View key={item.id} className="flex-row justify-between items-center py-1">
          <Text className="text-gray-700 text-lg flex-1" numberOfLines={3} ellipsizeMode="tail">
            {`${item.quantity}x ${item.productName}`}
          </Text>
          <Text className="text-gray-700 font-semibold text-lg">{item.total.toFixed(2) || 0}</Text>
        </View>
      ))}

      {order.payments && order.payments.length > 0 && (
        <>
          <View className="border-b border-gray-200 my-3" />

          <View className="flex-row justify-between items-center mb-2">
            <IconLabel
              iconName="credit-card"
              label={'Payment Details'}
              labelTextSize="text-lg pl-2"
              containerStyle="justify-between"
            />
            <View className="flex-cols">
              <StatusChip status={paymentStatus} margin="ml-10" />
              {!hideCollabsibleInfo && paymentStatus === 'UNPAID' && onMoreActionPress && (
                <CollapsibleInfo
                  label={'Add Payment ?'}
                  iconType={'FontAwesome'}
                  iconName={'question-circle'}
                  iconSize={14}
                  iconColor={'#2a4759'}
                  containerStyle={'items-end mb-1 mt-1'}
                  textColor={'text-black font-bold text-sm underline'}
                  collapsibleContent={'Click more actions button!'}
                  collapsibleContentStyle="w-28"
                  onPress={toggleMoreAction}
                />
              )}
            </View>
          </View>

          {order.payments.map((payment, index) => (
            <PaymentChip key={index} paymentType={payment.paymentMethod} amount={payment.amount} />
          ))}
        </>
      )}

      <View className="mt-2">
        {order.subTotalAmount && (
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-600">{'Subtotal'}</Text>
            <Text className="text-gray-700 font-semibold text-lg">
              रु {order.subTotalAmount.toFixed(2)}
            </Text>
          </View>
        )}

        {order.discountAmount != null && (
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-600">Discount</Text>
            <Text className="text-gray-700 font-semibold">
              {' '}
              रु {order.discountAmount.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
      <View className="border-b border-gray-200 my-3" />
      <View className="flex-row justify-between items-center mb-2">
        <IconLabel iconName="money-bill-wave" label={'Total'} containerStyle="justify-between" />
        <Text className="font-semibold text-lg"> रु {order.totalAmount.toFixed(2)}</Text>
      </View>

      {order.timeStamp.completedDate && (
        <IconLabel
          label={`${order.timeStamp.completedDate} ${order.timeStamp.completedTime}`}
          iconName="clock"
          containerStyle="mt-1 gap-1 pl-1"
          textColor="text-gray-500"
          labelTextSize="text-base"
          applyCircularIconBg={false}
          iconColor="blue-500"
        />
      )}

      {onMoreActionPress && !hideCollabsibleInfo && (
        <CollapsibleInfo
          label={'More Actions ?'}
          iconType={'FontAwesome'}
          iconName={'question-circle'}
          iconSize={14}
          iconColor={'#2a4759'}
          containerStyle={'items-start mb-1 mt-2 ml-2'}
          textColor={'text-black font-bold text-sm underline'}
          collapsibleContent={
            'Click the "More Actions" button to add food, switch tables, print receipts and cancel Order!'
          }
          collapsibleContentStyle="w-36"
          onPress={toggleMoreAction}
        />
      )}

      {showMoreAction && onMoreActionPress && (
        <>
          <View className="border-b border-gray-200 my-3" />

          <CustomButton
            title={'More Actions'}
            onPress={() => {
              onMoreActionPress(order);
            }}
            textSize="text-xl"
            customButtonStyle="items-center justify-center rounded px-1 py-3 bg-[#2a4759]"
          />
        </>
      )}
    </View>
  );
};

export default OrderItemSummary;
