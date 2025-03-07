import React from 'react';
import { View, Text } from 'react-native';
import PaymentChip from '../table/PaymentChip';
import IconLabel from '../common/IconLabel';
import { OrderDetails } from 'app/api/services/orderService';
import { StatusChip } from '../common/StatusChip';

type OrderItemSummaryProps = {
  order: OrderDetails;
  containerStyle?: string;
};

const OrderItemSummary: React.FC<OrderItemSummaryProps> = ({ order, containerStyle = '' }) => {
  return (
    <View className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${containerStyle}`}>
      {/* Table Name & Status */}
      <View className="flex-row justify-between items-center mb-2">
        <IconLabel iconName="utensils" label={'Order Items'} containerStyle="justify-between" />
        <StatusChip status={order.paymentStatus} margin="ml-20" />
      </View>
      {order.orderItems.map((item) => (
        <View key={item.id} className="flex-row justify-between items-center py-1">
          <Text className="text-gray-700 text-lg" numberOfLines={2} ellipsizeMode="tail">
            {item.quantity}x {item.productName}
          </Text>
          <Text className="text-gray-700 font-semibold text-lg">${item.total.toFixed(2)}</Text>
        </View>
      ))}
      <View className="border-b border-gray-200 my-3" />
      {/* Payment Details */}
      <View className="flex-row justify-between items-center mb-2">
        <IconLabel
          iconName="credit-card"
          label={'Payment Details'}
          containerStyle="justify-between"
        />
      </View>
      {order.payments.map((payment, index) => (
        <PaymentChip key={index} paymentType={payment.paymentMethod} />
      ))}

      {/* Subtotal, Tax, Tip */}
      <View className="mt-2">
        <View className="flex-row justify-between py-1">
          <Text className="text-gray-600">{'Subtotal'}</Text>
          <Text className="text-gray-700 font-semibold text-lg">
            ${(order.subTotalAmount * 0.75).toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between py-1">
          <Text className="text-gray-600">{`Discount`}</Text>
          <Text className="text-gray-700 font-semibold">
            ${(order.discountAmount * 0.1).toFixed(2)}
          </Text>
        </View>
      </View>
      <View className="border-b border-gray-200 my-3" />
      {/* Total */}
      <View className="flex-row justify-between items-center mb-2">
        <IconLabel iconName="money-bill-wave" label={'Total'} containerStyle="justify-between" />
        <Text className="font-semibold text-lg">${order.totalAmount.toFixed(2)}</Text>
      </View>

      <IconLabel
        label={`${order.timeStamp.completedDate} ${order.timeStamp.completedTime}`}
        iconName="clock"
        containerStyle="mt-1 gap-1 pl-1"
        textColor="text-gray-500"
        labelTextSize="text-base"
        applyCircularIconBg={false}
        iconColor="blue-500"
      />
    </View>
  );
};

export default OrderItemSummary;
