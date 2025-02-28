import React from 'react';
import { View, Text } from 'react-native';
import { OrderItem } from 'app/redux/cartSlice';
import EmptyState from '../common/EmptyState';
import IconLabel from '../common/IconLabel';
import TableItem from './TableItem';
import CustomButton from '../common/button/CustomButton';

interface OrderSummaryProps {
  cartItems: OrderItem[];
  updateQuantity: (food: OrderItem, newQuantity: number) => void;
  onSwitchTableClick?: (seatName: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  updateQuantity,
  onSwitchTableClick,
}) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-md">
      {/* Order Header Info */}
      <View className="bg-white rounded-lg shadow-md flex-row items-center justify-between">
        {/* Left Section: Order Info */}
        <View className="gap-1">
          <IconLabel iconName="clipboard-list" label={'Order #12345'} />
          <IconLabel iconName="table" label={'Table:'} subLabel={'T-15'} />

          <Text className="text-gray-600 pb-4">
            {'User:'} <Text className="font-semibold">{'Sarah Johnson'}</Text>
          </Text>
        </View>

        {/* Right Section: Date */}
        <View className="flex flex-col gap-16 items-center justify-between">
          {onSwitchTableClick && (
            <CustomButton
              title="Switch Table"
              onPress={() => {
                onSwitchTableClick('');
              }}
              iconName="swap-horizontal-outline"
              customButtonStyle="flex flex-row items-center justify-center rounded px-1 py-2 w-30 h-30 bg-deepTeal m-1"
              customTextStyle="text-md text-center text-white font-semibold"
            />
          )}

          <Text className="text-gray-700 font-medium pb-4">{'📅 15 Jan 2025'}</Text>
        </View>
      </View>
      {/* Divider */}
      <View className="w-full h-px bg-gray-200 my-3" />
      {!cartItems || cartItems.length === 0 ? (
        <EmptyState
          iconName="food-off"
          message="No food items available"
          subMessage="Please add items to the Customer table."
          iconSize={80}
        />
      ) : (
        cartItems.map((item) => (
          <TableItem key={item.orderItemId} item={item} updateQuantity={updateQuantity} />
        ))
      )}
    </View>
  );
};

export default OrderSummary;
