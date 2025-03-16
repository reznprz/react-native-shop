import { OrderItem } from 'app/api/services/orderService';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const FALLBACK_IMAGE_URI = 'https://picsum.photos/300/200';

interface TableFoodItemCardProps {
  item: OrderItem;
  updateQuantity: (item: OrderItem, newQuantity: number) => void;
}

const TableFoodItemCard: React.FC<TableFoodItemCardProps> = ({ item, updateQuantity }) => {
  return (
    <>
      <View className="flex-row items-center justify-evenly p-2 bg-white">
        {/* Product Image */}
        <Image
          source={{ uri: item.imageUrl || FALLBACK_IMAGE_URI }}
          className="w-12 h-12 rounded-full"
        />

        {/* Product Details: Name & Price */}
        <View className="flex-1 px-2">
          <Text
            className="text-base font-semibold text-deepTeal"
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.productName}
          </Text>
          <Text className="text-sm text-gray-600">{`${item.unitPrice.toFixed(2)}`}</Text>
        </View>

        {/* Right Section: Quantity Control + Total Price */}
        <View className="flex-row items-center">
          {/* Segmented Quantity Control */}
          <View className="flex-row items-center pr-8">
            {/* Decrement */}
            <TouchableOpacity
              onPress={() => updateQuantity(item, item.quantity - 1)}
              className="items-center justify-center"
            >
              <Text className="text-m font-extrabold text-deepTeal px-2 py-1 border border-gray-300">
                {'-'}
              </Text>
            </TouchableOpacity>

            {/* Quantity Display */}
            <View className="items-center font-black justify-center px-2 py-1 border border-gray-300">
              <Text className="text-m text-deepTeal">{item.quantity}</Text>
            </View>

            {/* Increment */}
            <TouchableOpacity
              onPress={() => updateQuantity(item, item.quantity + 1)}
              className="items-center justify-center "
            >
              <Text className="text-m font-extrabold text-deepTeal px-2 py-1 border border-gray-300">
                {'+'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Total Price */}
          <Text className="font-semibold text-deepTeal">
            {`${(item.unitPrice * item.quantity).toFixed(2)}`}
          </Text>
        </View>
      </View>
      <View className="w-full h-px bg-gray-200 my-3" />
    </>
  );
};

export default TableFoodItemCard;
