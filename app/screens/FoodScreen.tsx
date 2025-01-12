import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

export default function FoodScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="flex-1 bg-white">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Food Items
        </Text>

        {/* Circle */}
        <View className="flex-1 items-center justify-center">
          <Svg height="100" width="100" viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke="green"
              strokeWidth="2.5"
              fill="yellow"
            />
          </Svg>
          <Text className="text-base text-gray-700 mt-2">
            This is a sample SVG shape (Circle).
          </Text>
        </View>

        {/* Rectangle */}
        <View className="flex-1 items-center justify-center mt-6">
          <Svg height="100" width="100" viewBox="0 0 100 100">
            <Rect
              x="10"
              y="10"
              width="80"
              height="80"
              stroke="purple"
              strokeWidth="2"
              fill="pink"
            />
          </Svg>
          <Text className="text-base text-gray-700 mt-2">
            This is a sample SVG shape (Rectangle).
          </Text>
        </View>

        <Text className="mt-6 text-gray-600">
          Use react-native-svg for displaying custom vector graphics or icons
          that aren't in the icon sets.
        </Text>
      </View>
    </SafeAreaView>
  );
}
