import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OrderItem } from 'app/redux/cartSlice';
import { Food } from 'app/api/services/foodService';

interface FoodCardProps {
  food: Food;
  isDesktop?: boolean;
  width?: number;
  updateCartItemForFood: (food: Food, newQuantity: number) => void;
}

const FALLBACK_IMAGE_URI = 'https://picsum.photos/300/200';

export default function FoodCard({
  food,
  isDesktop = false,
  width = 1025,
  updateCartItemForFood,
}: FoodCardProps) {
  const [quantity, setQuantity] = useState(0);

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      updateCartItemForFood(food, newQty);
    }
  };

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    updateCartItemForFood(food, newQty);
  };

  const img = food.img || FALLBACK_IMAGE_URI;

  return (
    <View className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
      {/* Top Content */}
      <View className="flex-1">
        {/* Product Image */}
        {img && (
          <View className="w-full bg-gray-100 rounded-xl">
            <Image
              source={{ uri: img }}
              style={{ width: '100%', aspectRatio: 14 / 9, borderRadius: 10 }}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Product Name - 2 lines max */}
        <Text numberOfLines={3} ellipsizeMode="tail" className="text-xl font-semibold mt-2 ml-2">
          {food.name}
        </Text>

        {/* Product Description - 2 lines max */}
        {food.description && (
          <Text numberOfLines={2} ellipsizeMode="tail" className="text-xs text-gray-500 mt-1">
            {food.description}
          </Text>
        )}
      </View>

      {/* Bottom Content: Price & Quantity Controller */}
      <View className="flex-row items-center justify-between mt-2 ml-2 mr-2 ">
        <Text className="font-bold text-base text-gray-600">${food.price.toFixed(2)}</Text>

        <View className="flex-row items-center px-2 py-1 rounded-full">
          {quantity > 0 && (
            <>
              <Pressable
                onPress={handleDecrement}
                className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
              >
                <Ionicons name="remove" size={20} color="black" />
              </Pressable>

              <Text className="text-xl font-semibold mx-2">{quantity}</Text>
            </>
          )}

          <Pressable
            onPress={handleIncrement}
            className="w-8 h-8 bg-[#2a4759] rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={20} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
