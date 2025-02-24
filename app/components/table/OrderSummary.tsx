import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { OrderItem } from 'app/redux/cartSlice';
import EmptyState from '../common/EmptyState';
import CartItem from './CartItem';

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
          <Text className="text-xl font-bold text-[#2a4759]">Order #12345</Text>
          <Text className="text-gray-600">
            Table: <Text className="font-semibold">T-15</Text>
          </Text>
          <Text className="text-gray-600">
            Customer: <Text className="font-semibold">Sarah Johnson</Text>
          </Text>
        </View>

        {/* Right Section: Date */}
        <Text className="text-gray-700 font-medium">📅 15 Jan 2025</Text>
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
