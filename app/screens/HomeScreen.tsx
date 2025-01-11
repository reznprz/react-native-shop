import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">Home Screen</Text>

      <TouchableOpacity
        className="mt-4 rounded bg-blue-600 px-4 py-2"
        onPress={() => console.log("Navigate or do something")}
      >
        <Text className="text-white">Click Me</Text>
      </TouchableOpacity>
    </View>
  );
}
