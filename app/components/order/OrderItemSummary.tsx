import React from 'react';
import { View, Text } from 'react-native';
import PaymentChip from '../table/PaymentChip';
import IconLabel from '../common/IconLabel';
import { OrderDetails } from 'app/api/services/orderService';
import { StatusChip } from '../common/StatusChip';
import TableIcon from '../../../assets/table-filled.svg';
import CollapsibleInfo from '../common/CollapsibleInfo';

type OrderItemSummaryProps = {
  order: OrderDetails;
  containerStyle?: string;
};

const OrderItemSummary: React.FC<OrderItemSummaryProps> = ({ order, containerStyle = '' }) => {
  const paymentStatus = order.paymentStatus ? order.paymentStatus : 'UNPAID';

  const paidAmount = order.payments.reduce((sum, p) => sum + p.amount, 0);
  const unpaidAmount = order.totalAmount - paidAmount;

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
              <StatusChip status={paymentStatus} margin="ml-20" />
              {paymentStatus === 'UNPAID' && (
                <CollapsibleInfo
                  label={'Add Payment ?'}
                  iconType={'FontAwesome'}
                  iconName={'question-circle'}
                  iconSize={18}
                  iconColor={'#2a4759'}
                  containerStyle={'items-end mb-1 mt-1'}
                  textColor={'text-black font-bold text-sm underline'}
                  collapsibleContent={'Add Payment'}
                />
              )}
            </View>
          </View>

          {paidAmount > 0 && unpaidAmount > 0 && (
            <>
              <View className="flex-row justify-between rounded-md border border-gray-200 shadow-sm mb-2">
                {paidAmount > 0 && (
                  <IconLabel
                    label="Paid"
                    iconType="FontAwesome5"
                    iconName="check-circle"
                    iconSize={12}
                    iconColor="#10B981"
                    parentWidthHeight="w-6 h-6"
                    labelTextSize="text-sm pl-0.5"
                    subLabel={`: रु ${paidAmount.toString()}`}
                    bgColor={`bg-green-100`}
                    containerStyle={'p-2'}
                  />
                )}

                <IconLabel
                  label="Unpaid"
                  iconType="FontAwesome5"
                  iconName="clock"
                  iconSize={12}
                  iconColor="#EF4444"
                  parentWidthHeight="w-6 h-6"
                  labelTextSize="text-sm pl-2"
                  subLabel={`: रु ${unpaidAmount.toString()}`}
                  bgColor={`bg-red-100`}
                  containerStyle={'p-2'}
                />
              </View>
            </>
          )}

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
    </View>
  );
};

export default OrderItemSummary;
