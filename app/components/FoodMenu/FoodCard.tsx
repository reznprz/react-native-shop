import { Food } from "app/api/services/foodService";
import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";

interface FoodCardProps {
  food: Food;
}

export default function FoodCard({ food }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <View className="w-[160px] bg-white rounded-md shadow-md m-2 p-3">
      {/* Image placeholder or actual image */}
      {food.img ? (
        <Image
          source={{ uri: food.img }}
          className="w-full h-24 rounded-md bg-gray-100"
        />
      ) : (
        <View className="w-full h-24 rounded-md bg-gray-200 items-center justify-center">
          <Text className="text-gray-500">Food Image</Text>
        </View>
      )}
      <Text className="text-base font-semibold mt-2">{food.name}</Text>
      <Text className="text-gray-500 text-sm">{food.description}</Text>

      {/* Price & Quantity controls */}
      <View className="flex-row items-center justify-between mt-3">
        <Text className="font-bold text-base">${food.price.toFixed(2)}</Text>

        {/* Decrement Button */}
        <Pressable
          onPress={handleDecrement}
          className="px-2 py-1 bg-gray-300 rounded-md mx-1"
        >
          <Text className="font-bold text-black">-</Text>
        </Pressable>

        {/* Quantity Display */}
        <Text className="px-2">{quantity}</Text>

        {/* Increment Button */}
        <Pressable
          onPress={handleIncrement}
          className="px-2 py-1 bg-gray-300 rounded-md mx-1"
        >
          <Text className="font-bold text-black">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
