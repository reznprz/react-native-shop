import React from 'react';
import { View, Text, Image } from 'react-native';
import { StatusChip } from '../common/StatusChip';
import IconLabel from '../common/IconLabel';
import { OrderDetails } from 'app/api/services/orderService';
import CustomIcon from '../common/CustomIcon';

type OrderSummaryProps = {
  order: OrderDetails;
  containerStyle?: string;
};

const OrderSummaryCard: React.FC<OrderSummaryProps> = ({ order, containerStyle = '' }) => {
  return (
    <View
      className={`flex bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-2 ${containerStyle}`}
    >
      {/* Order ID & Status Row */}
      <View className="flex-row justify-between items-center">
        <IconLabel
          iconName="clipboard-list"
          label={`#ORD-${order.orderId}`}
          containerStyle="justify-between"
        />
        <StatusChip status={order.orderStatus} />
      </View>

      {/* Order Details */}
      <View className="flex-col justify-between m-2 mr-4">
        <View className="flex-row justify-between">
          <View className={`flex-row items-center mt-1 gap-1 pr-4`}>
            <CustomIcon type={'FontAwesome5'} name={'clock'} size={20} color={'gray'} />
            <View>
              <Text
                className={`font-semibold text-base text-gray-500 pl-2`}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {order.timeStamp.createdDate}
              </Text>
              <Text
                className={`font-semibold  text-base text-gray-500 pl-2`}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {order.timeStamp.createdTime}
              </Text>
            </View>
          </View>

          <IconLabel
            label={order.tableName}
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
            label={`${order.totalAmount.toFixed(2)}`}
            iconName="money-bill-wave"
            containerStyle="mt-1 gap-1"
            textColor="text-gray-500"
            labelTextSize="text-base"
            applyCircularIconBg={false}
            iconColor="gray"
          />
          <IconLabel
            label={order.orderType}
            iconName="concierge-bell"
            iconType="FontAwesome5"
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
