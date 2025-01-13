import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  onClose,
}) => {
  if (!message) return null;

  return (
    <View className="absolute top-4 right-4 w-11/12 max-w-sm bg-white shadow-lg rounded-lg flex-row items-center border-l-4 border-red-500 p-4 z-50">
      <View className="flex-1">
        <Text className="text-primary-font-color font-semibold">{message}</Text>
      </View>
      <TouchableOpacity onPress={onClose} className="text-primary-font-color">
        {/* Replace with your icon component */}
        {/* <Ionicons name="" size={24} color="#000" /> */}
        <Text className="sr-only">Close notification</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorNotification;
