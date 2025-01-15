// ErrorNotification.tsx
import React, { useEffect, useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current; // For mobile

  useEffect(() => {
    if (Platform.OS !== "web") {
      // Slide in animation for mobile
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to its original position
        duration: 500, // 0.5 seconds
        useNativeDriver: true, // Use native driver for better performance
      }).start();

      // Slide out when the component unmounts or message changes
      return () => {
        Animated.timing(slideAnim, {
          toValue: SCREEN_WIDTH, // Slide out to the right
          duration: 500,
          useNativeDriver: true,
        }).start();
      };
    }
  }, [slideAnim]);

  if (!message) return null;

  if (Platform.OS === "web") {
    return (
      <div className="absolute top-4 right-2 w-10/12 max-w-sm bg-deepTeal shadow-lg rounded-lg flex items-center border-l-6 border-softRose p-4 z-50 animate-slideIn">
        <span className="text-lightCream font-semibold flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-4"
          aria-label="Close error notification"
        >
          <Ionicons name="close-sharp" size={24} color="#ffffff" />
        </button>
      </div>
    );
  } else {
    return (
      <Animated.View
        className="absolute top-4 right-2 w-10/12 max-w-sm bg-deepTeal shadow-lg rounded-lg flex-row items-center border-l-6 border-softRose p-4 z-50"
        style={{
          transform: [{ translateX: slideAnim }],
        }}
      >
        <Text className="text-lightCream font-semibold flex-1">{message}</Text>
        <TouchableOpacity
          onPress={onClose}
          className="ml-4"
          accessibilityLabel="Close error notification"
        >
          <Ionicons name="close-sharp" size={24} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
    );
  }
};

export default ErrorNotification;
