import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Food } from 'app/api/services/foodService';

interface FoodCardProps {
  food: Food;
  isDesktop?: boolean;
  width?: number;
}

const FALLBACK_IMAGE_URI = 'https://picsum.photos/300/200';

export default function FoodCard({ food, isDesktop = false, width = 1025 }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  return (
    <View className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
      {/* Top Content */}
      <View className="flex-1">
        {/* Product Image */}
        <View className="w-full h-24 rounded-xl bg-gray-100 items-center justify-center">
          <Image
            source={{ uri: food.img || FALLBACK_IMAGE_URI }}
            className="w-full h-24 rounded-xl"
            resizeMode="cover"
          />
        </View>

        {/* Product Name - 2 lines max */}
        <Text numberOfLines={3} ellipsizeMode="tail" className="text-sm font-semibold mt-2">
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
      <View className="flex-row items-center justify-between mt-2">
        <Text className="font-bold text-base">${food.price.toFixed(2)}</Text>

        <View className="flex-row items-center bg-gray-200 px-2 py-1 rounded-full">
          <Pressable
            onPress={handleDecrement}
            className="w-4 h-4 bg-white rounded-full items-center justify-center"
          >
            <Ionicons name="remove" size={12} color="black" />
          </Pressable>
          <Text className="text-sm font-semibold mx-2">{quantity}</Text>
          <Pressable
            onPress={handleIncrement}
            className="w-4 h-4 bg-white rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={12} color="black" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
