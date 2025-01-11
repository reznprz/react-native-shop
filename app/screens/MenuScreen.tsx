import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import useFetch from "../hooks/useFetch";

export default function MenuScreen() {
  const { data, error, loading } = useFetch<{ items: string[] }>({
    url: "https://example.com/api/menu",
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold text-gray-800">Menu Items</Text>
      {data?.items.map((item, idx) => (
        <Text key={idx} className="mt-2 text-base text-gray-600">
          {item}
        </Text>
      ))}
    </View>
  );
}
