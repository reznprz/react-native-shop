import React from "react";
import { View, Text } from "react-native";
import QrFoodCard from "./QrFoodCard";
import { Food } from "app/api/services/foodService";

interface QrFoodListProps {
  categories: string[] | null;
  filteredFoods: Food[];
  onCategoryLayout: (category: string, event: any) => void;
  foodItem: Food; // Added this line
}

const QrFoodList: React.FC<QrFoodListProps> = ({
  categories,
  filteredFoods,
  onCategoryLayout,
}) => {
  return (
    <View>
      {categories?.map((category, index) => (
        <View
          key={index}
          onLayout={(event) => onCategoryLayout(category, event)}
          className="mb-6"
        >
          <Text className="text-xl font-bold mb-4 text-center text-deepTeal">
            {category}
          </Text>
          <View>
            {filteredFoods
              .filter((food) => food.categoryName === category)
              .map((food) => (
                <QrFoodCard key={food.id} food={food} />
              ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default QrFoodList;
