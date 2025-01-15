import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface HeaderProps {
  subCategoryName: string;
  goBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ subCategoryName, goBack }) => {
  const { width } = useWindowDimensions();

  // Determine padding-top dynamically based on screen width
  const isMobile = width <= 768;
  const paddingClass = isMobile ? "pt-10" : "pt-4";

  return (
    <View className="flex-row items-center justify-between border-b bg-deepTeal p-6">
      <TouchableOpacity
        onPress={() => goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View className={`flex items-center ${paddingClass}`}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </View>
      </TouchableOpacity>
      <Text
        className={`text-xl font-bold text-white ${paddingClass} uppercase`}
      >
        {subCategoryName}
      </Text>
      <View />
    </View>
  );
};

export default Header;
