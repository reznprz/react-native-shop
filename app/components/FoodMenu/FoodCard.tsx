import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Food } from "app/api/services/foodService";
// Example local placeholder image (optional):
// import PlaceholderImage from "assets/images/food-placeholder.png";

interface FoodCardProps {
  food: Food;
}

// A reusable fallback image, if you have one locally. Otherwise keep the text-based fallback.
const FALLBACK_IMAGE_URI =
  "https://www.google.com/search?sca_esv=a8f7548827ffe170&sxsrf=AHTn8zqnQkAuatNNKPEEssaGKIWvqMvK_g:1740178618157&q=burger&udm=2&fbs=ABzOT_CWdhQLP1FcmU5B0fn3xuWpA-dk4wpBWOGsoR7DG5zJBvRU_c8CYw0YyGBU6UN-VqoqPYaI3HSL1XTvQrW6xFSpSeT3tq5COowQW9RrFTcmNIH64yoC0QHshEbcpFfZd65axqf9sSP4XfEu4wWkIX_Csc_xxKASfoqlVD6SW-otevGmK9pMTlmoByEptPa7Y-eGKqIqDdsknaG1qO--HwwDqwh1mA&sa=X&ved=2ahUKEwiG6YXD7tWLAxWCt4QIHXPCMYUQtKgLegQIHhAB&biw=1080&bih=1798&dpr=1#vhid=2Z7HZBZkedBwTM&vssid=mosaic";

export default function FoodCard({ food }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { width } = useWindowDimensions();
  const isTabletOrDesktop = width >= 768;

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  return (
    <View
      className={`${
        isTabletOrDesktop ? "w-[180px] m-3 p-4" : "w-[160px] m-2 p-2"
      } bg-white rounded-xl shadow-sm border border-gray-200`}
    >
      {/* Product Image */}
      <View className="w-full h-24 rounded-xl bg-gray-100 items-center justify-center">
        <Image
          source={{ uri: food.img || FALLBACK_IMAGE_URI }}
          className="w-full h-24 rounded-xl"
          resizeMode="cover"
        />
      </View>

      {/* Product Name */}
      <Text className="text-sm font-semibold mt-2">{food.name}</Text>

      {/* Product Description (Optional) */}
      {food.description && (
        <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
          {food.description}
        </Text>
      )}

      {/* Price & Quantity Controller */}
      <View className="flex-row items-center justify-between mt-3">
        {/* Price */}
        <Text className="font-bold text-base">${food.price.toFixed(2)}</Text>

        {/* Quantity Controller */}
        <View className="flex-row items-center bg-gray-200 px-2 py-1 rounded-full">
          {/* Decrease Button */}
          <Pressable
            onPress={handleDecrement}
            className="w-4 h-4 bg-white rounded-full items-center justify-center"
          >
            <Ionicons name="remove" size={12} color="black" />
          </Pressable>

          {/* Quantity Display */}
          <Text className="text-sm font-semibold mx-2">{quantity}</Text>

          {/* Increase Button */}
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
