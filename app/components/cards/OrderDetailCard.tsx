import { Button, Pressable, Text, View } from "react-native";

const OrderDetailCard = () => {
  return (
    <View>
      <View className="p-4 rounded-md shadow-md border-b border-b-gray-100">
        <View className="w-full flex-row items-center justify-between">
          <Text className="font-bold">#ORD-20250012</Text>
          <Text className="bg-gray-200 px-3 py-1 rounded-2xl">Pending</Text>
        </View>

        <Text>John Doe</Text>
        <Text>Table T-12</Text>

        <View className="mt-4">
          <Text>Created at: Jan 15, 2025 10:30 AM</Text>
          <Text>Completed at: Jan 15, 2025 10:30 AM</Text>
        </View>
      </View>

      <View className="p-4 border-b border-b-gray-100">
        <Text className="font-bold">Items</Text>
        <Text>Chicken Burger x2</Text>
        <Text>French Fries x2</Text>
      </View>

      <View className="p-4 rounded-md shadow-md">
        <View className="flex-row items-center justify-between">
          <Text>Payment Type</Text>
          <Pressable className="bg-gray-200 px-3 py-1 rounded-2xl">
            <Text>esewa</Text>
          </Pressable>
        </View>

        <View className="flex-row items-start justify-between">
          <Text>SubTotal</Text>
          <Text className="mr-2">$ 29.00</Text>
        </View>

        <View className="flex-row items-start justify-between">
          <Text>Discount</Text>
          <Text className="mr-2">- $ 2.00</Text>
        </View>

        <View className="flex-row items-start justify-between">
          <Text>Total</Text>
          <Text className="mr-2">- $ 27.00</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderDetailCard;
