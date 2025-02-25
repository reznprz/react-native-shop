import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { OrderItem } from 'app/redux/cartSlice';
import EmptyState from '../common/EmptyState';
import CartItem from './CartItem';
import IconLabel from '../common/IconLabel';

interface OrderSummaryProps {
  cartItems: OrderItem[];
  updateQuantity: (food: OrderItem, newQuantity: number) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, updateQuantity }) => {
  return (
    <View>
      {/* Order Header Info */}
      <View className="p-5 bg-white rounded-lg shadow-md flex-row items-center justify-between">
        {/* Left Section: Order Info */}
        <View className="gap-1">
          <IconLabel iconName="clipboard-list" label={'Order #12345'} />
          <IconLabel iconName="table" label={'Table:'} subLabel="T-15" />

          <Text className="text-gray-600">
            {'Customer:'} <Text className="font-semibold">{'Sarah Johnson'}</Text>
          </Text>
        </View>

        {/* Right Section: Date */}
        <Text className="text-gray-700 font-medium">{'📅 15 Jan 2025'}</Text>
      </View>
      <View className="w-full h-px bg-gray-200 my-3" /> {/* Divider */}
      {!cartItems || cartItems.length === 0 ? (
        <EmptyState
          iconName="food-off"
          message="No food items available"
          subMessage="Please check back later or add items to the cart."
          iconSize={80}
        />
      ) : (
        cartItems.map((item) => (
          <CartItem key={item.orderItemId} item={item} updateQuantity={updateQuantity} />
        ))
      )}
    </View>
  );
};

export default OrderSummary;
