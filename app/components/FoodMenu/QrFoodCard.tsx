import { Food } from "app/api/services/foodService";
import React from "react";
import { View, Text } from "react-native";

interface QrFoodCardProps {
  food: Food;
}

const QrFoodCard: React.FC<QrFoodCardProps> = ({ food }) => {
  let processedDescription = food.description || "";
  let processedName = food.name;

  // If foodName has parentheses, extract data within and append to description
  if (
    food.categoryName?.toLowerCase() === "ice cream" &&
    food.name.includes("(")
  ) {
    const nameParts = food.name.match(/(.*?)\((.*?)\)/);
    if (nameParts && nameParts.length > 2) {
      processedName = nameParts[1].trim();
      const additionalDescription = nameParts[2].trim();

      // Append to existing description
      if (processedDescription) {
        processedDescription += `\n${additionalDescription}`;
      } else {
        processedDescription = additionalDescription;
      }
    }
  }

  return (
    <View className="mb-4 px-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-base font-normal text-primary-text-color">
          {processedName}
        </Text>
        <Text className="text-sm font-medium text-primary-text-color">
          रु {food.price}
        </Text>
      </View>
      {processedDescription !== "" && (
        <Text className="text-black italic text-sm mt-1">
          {processedDescription}
        </Text>
      )}
    </View>
  );
};

export default QrFoodCard;
