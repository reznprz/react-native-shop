import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function OrderScreen() {
  const [count, setCount] = useState(0);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="mb-4 text-lg font-semibold text-black">
        Items in Cart: {count}
      </Text>
      <TouchableOpacity
        onPress={() => setCount((prev) => prev + 1)}
        className="mb-2 rounded bg-green-600 px-6 py-2"
      >
        <Text className="text-white">Add Item</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setCount(0)}
        className="rounded bg-red-600 px-6 py-2"
      >
        <Text className="text-white">Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );
}
