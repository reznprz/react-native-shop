import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { StatusChip } from '../common/StatusChip';
import IconLabel from '../common/IconLabel';
import { OrderDetails } from 'app/api/services/orderService';
import CustomIcon from '../common/CustomIcon';
import { getIconDetail } from 'app/utils/getIconDetail';
import Ionicons from '@expo/vector-icons/Ionicons';

type OrderSummaryProps = {
  order: OrderDetails;
  showTable?: boolean;
  containerStyle?: string;
};

const OrderSummaryCard: React.FC<OrderSummaryProps> = ({
  order,
  containerStyle = '',
  showTable = true,
}) => {
  const orderTypeIconDetail = getIconDetail(order.orderType);
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
        <StatusChip status={order.orderStatus} margin={showTable ? '' : 'ml-8 mr-8'} />
      </View>

      {/* Order Details */}
      <View className="flex-col justify-between m-2 mr-2">
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

          <View className="flex-row justify-between ">
            {showTable ? (
              <IconLabel
                label={order.tableName}
                iconName="table"
                iconType="TableIcon"
                containerStyle="mt-1 gap-1"
                textColor="text-gray-500"
                labelTextSize="text-lg"
                iconSize={22}
                applyCircularIconBg={false}
                iconColor="gray"
              />
            ) : (
              <>
                <StatusChip
                  status={order.paymentStatus}
                  customSize="px-2 text-base"
                  applyBg={false}
                />
                <View className="ml-4 mt-3">
                  <Pressable onPress={() => () => {}} className="mt-auto">
                    <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
        <View className="flex-row justify-between gap-4 mt-2">
          <IconLabel
            label={`${order.totalAmount.toFixed(2)}`}
            iconName="money-bill-wave"
            iconType="Rupee"
            iconSize={26}
            containerStyle="mt-1 gap-1"
            textColor="text-gray-500"
            labelTextSize="text-base"
            applyCircularIconBg={false}
            iconColor="black"
          />
          {order.orderMenuType && order.orderMenuType === 'TOURIST' && (
            <StatusChip status={order.orderMenuType} customSize={'px-2 py-1 p-2'} />
          )}
          <IconLabel
            label={order.orderType}
            iconName={orderTypeIconDetail.iconName}
            iconType={orderTypeIconDetail.iconType}
            iconSize={26}
            containerStyle={showTable ? 'mt-1 gap-1 ' : ` mr-8`}
            textColor="text-gray-500"
            labelTextSize="text-base text-bold"
            applyCircularIconBg={false}
            iconColor="brown"
          />
        </View>
      </View>
    </View>
  );
};

export default OrderSummaryCard;
