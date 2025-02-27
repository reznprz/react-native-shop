import React from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { OrderDetails } from 'app/hooks/useOrder';
import { StatusChip } from '../common/StatusChip';
import IconLabel from '../common/IconLabel';

type OrderSummaryProps = {
  order: OrderDetails;
  containerStyle?: string;
};

const OrderSummaryCard: React.FC<OrderSummaryProps> = ({ order, containerStyle = '' }) => {
  return (
    <View
      className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-2 ${containerStyle}`}
    >
      {/* Order ID & Status Row */}
      <View className="flex-row justify-between items-center">
        <IconLabel
          iconName="clipboard-list"
          label={`#ORD-${order.id}`}
          containerStyle="justify-between"
        />
        <StatusChip status={order.status} />
      </View>

      {/* Order Details */}
      <View className="flex-col justify-between m-2 mr-4">
        <View className="flex-row justify-between">
          <IconLabel
            label={`${order.date} ${order.time}`}
            iconName="clock"
            containerStyle="mt-1 gap-1"
            textColor="text-gray-500"
            labelTextSize="text-base"
            applyCircularIconBg={false}
            iconColor="gray"
          />

          <IconLabel
            label={order.table}
            iconName="table"
            containerStyle="mt-1 gap-1"
            textColor="text-gray-500"
            labelTextSize="text-base"
            applyCircularIconBg={false}
            iconColor="gray"
          />
        </View>
        <View className="flex-row justify-between">
          <IconLabel
            label={`${order.total.toFixed(2)}`}
            iconName="money-bill-wave"
            containerStyle="mt-1 gap-1"
            textColor="text-gray-500"
            labelTextSize="text-base"
            applyCircularIconBg={false}
            iconColor="gray"
          />
          <IconLabel
            label={order.status}
            iconName="utensils"
            containerStyle="mt-1 gap-1"
            textColor="text-gray-500"
            labelTextSize="text-base"
            applyCircularIconBg={false}
            iconColor="gray"
          />
        </View>
      </View>
    </View>
  );
};

export default OrderSummaryCard;
