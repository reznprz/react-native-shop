import React, { createContext, useContext, ReactNode } from "react";
import { SubCategory, useFood } from "app/hooks/useFood";
import { Food, GetAllFoodsResponse } from "app/api/services/foodService";
import { ApiState } from "app/hooks/reducers/apiReducer"; // Adjust the import path as necessary

interface FoodContextType {
  menuState: ApiState<GetAllFoodsResponse["payload"]>; // Allows data to be Food[] | null
  refetch: () => Promise<void>;
  groupedFoods: Record<SubCategory, Food[]>;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

interface FoodProviderProps {
  children: ReactNode;
}

export const FoodProvider = ({ children }: FoodProviderProps) => {
  const food = useFood();
  return <FoodContext.Provider value={food}>{children}</FoodContext.Provider>;
};

export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error("useFoodContext must be used within a FoodProvider");
  }
  return context;
};
