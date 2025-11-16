import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StatusChip } from '../common/StatusChip';
import IconLabel from '../common/IconLabel';
import { OrderDetails } from 'app/api/services/orderService';
import CustomIcon from '../common/CustomIcon';
import { getIconDetail } from 'app/utils/getIconDetail';
import Ionicons from '@expo/vector-icons/Ionicons';
import BannerCard from '../common/BannerCard';
import { useTheme } from 'app/hooks/useTheme';

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
  const theme = useTheme();

  const orderTypeIconDetail = getIconDetail(order.orderType);
  return (
    <View
      className={`flex  p-3 rounded-lg  border border-gray-200 mb-2 ${containerStyle}`}
      style={{ backgroundColor: theme.secondaryBg }}
    >
      {order.cancelReason && order.cancelReason.length > 0 && (
        <BannerCard
          primaryTitle={order.cancelReason}
          primaryTitleTextColor="text-red-700"
          cardBackgroundColor="bg-red-50 border-red-200"
          secondaryTitle="Order Canceled Reason"
          iconDetails={{
            iconType: 'Feather',
            iconName: 'x-circle',
            filledColor: '#DC2626', // Tailwind red-600
            bgColor: '',
          }}
          cardStyle="p-2 mb-4"
        />
      )}

      {/* Order ID & Status Row */}
      <View className="flex-row justify-between items-center">
        <IconLabel
          iconName="clipboard-list"
          label={`#ORD-${order.orderId}`}
          containerStyle="justify-between"
          labelTextSize="ml-2 text-lg"
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
            <CustomIcon
              type={'Ionicons'}
              name={'earth-outline'}
              size={18}
              color={'blue-300'}
              iconStyle="mt-2"
            />
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
