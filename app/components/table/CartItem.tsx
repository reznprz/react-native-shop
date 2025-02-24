import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { OrderItem } from 'app/redux/cartSlice';

const FALLBACK_IMAGE_URI = 'https://picsum.photos/300/200';

interface CartItemProps {
  item: OrderItem;
  updateQuantity: (item: OrderItem, newQuantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity }) => {
  return (
    <>
      <View className="flex-row items-center justify-evenly mb-4 p-4 bg-white">
        {/* Product Image */}
        <Image
          source={{ uri: item.imageUrl || FALLBACK_IMAGE_URI }}
          className="w-12 h-12 rounded-full"
        />

        {/* Product Details: Name & Price */}
        <View className="flex-1 px-2">
          <Text className="text-base font-semibold text-deepTeal" numberOfLines={1}>
            {item.productName}
          </Text>
          <Text className="text-sm text-gray-600">${item.price.toFixed(2)}</Text>
        </View>

        {/* Right Section: Quantity Control + Total Price */}
        <View className="flex-row items-center">
          {/* Segmented Quantity Control */}
          <View className="flex-row items-center mr-3">
            {/* Decrement */}
            <TouchableOpacity
              onPress={() => updateQuantity(item, item.quantity - 1)}
              className="items-center justify-center"
            >
              <Text className="text-lg text-deepTeal px-4 py-1 border border-gray-300">-</Text>
            </TouchableOpacity>

            {/* Quantity Display */}
            <View className="items-center justify-center px-4 py-1 border border-gray-300">
              <Text className="text-lg text-deepTeal">{item.quantity}</Text>
            </View>

            {/* Increment */}
            <TouchableOpacity
              onPress={() => updateQuantity(item, item.quantity + 1)}
              className="items-center justify-center "
            >
              <Text className="text-lg text-deepTeal px-4 py-1 border border-gray-300">+</Text>
            </TouchableOpacity>
          </View>

          {/* Total Price */}
          <Text className="font-semibold text-deepTeal">
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
      <View className="w-full h-px bg-gray-200 my-3" /> {/* Divider */}
    </>
  );
};

export default CartItem;
