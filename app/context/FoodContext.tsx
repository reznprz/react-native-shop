import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { SubCategory, useFood } from "app/hooks/useFood";
import { Food, GetAllFoodsResponse } from "app/api/services/foodService";
import { ApiState } from "app/hooks/reducers/apiReducer";
import { usePageState } from "app/hooks/reducers/usePageState";
import { PageState } from "app/types/PageState";

// Define the shape of the context
interface FoodContextType {
  menuState: ApiState<GetAllFoodsResponse["payload"]>;
  qrItemScreenState: PageState;
  refetch: () => Promise<void>;
  groupedFoodsByCategory: Record<string, Food[]>;
  allGroupedFoods: Record<string, Food[]>;
  filterGroupeFoodsByCategory: (selectedSubCategory: SubCategory) => void;
  qrItemScreenError?: any;
  clearQrItemScreenError: () => void;
  resetQrItemScreenState: () => void;
  resetState: () => Promise<void>;
}

// Create the context with an undefined default value
const FoodContext = createContext<FoodContextType | undefined>(undefined);

// Define the props for the provider
interface FoodProviderProps {
  children: ReactNode;
}

// The provider component
export const FoodProvider = ({ children }: FoodProviderProps) => {
  const {
    state: qrItemScreenState,
    setLoading,
    setSuccess,
    setFailure,
    error: qrItemScreenError,
    clearError: clearQrItemScreenError,
    resetPageState: resetQrItemScreenState,
  } = usePageState();

  const food = useFood();
  const { data: foodList } = food.menuState;

  const initialGroupedFoods: Record<string, Food[]> = {};

  const [groupedFoodsByCategory, setGroupedFoodsByCategory] =
    useState<Record<string, Food[]>>(initialGroupedFoods);

  // filter the foodList from selected Category And redirect to the QrFoodList
  const filterGroupeFoodsByCategory = useCallback(
    (selectedSubCategory: SubCategory) => {
      setLoading();
      setGroupedFoodsByCategory(initialGroupedFoods);

      console.log("selectedSubCategory", selectedSubCategory);
      if (!foodList) {
        setFailure("Food list is not available");
        return;
      }

      // Normalize strings for comparison
      const normalizeString = (str: string) =>
        str.toLowerCase().replace(/\s+/g, "").trim();

      const selectedCategory = normalizeString(selectedSubCategory);

      const filteredFoods = foodList.filter((foodItem) => {
        const categoryNameTwo = normalizeString(foodItem.categoryNameTwo || "");
        const isMatch = categoryNameTwo === selectedCategory;

        return isMatch;
      });

      setGroupedFoodsByCategory((prev) => ({
        ...prev,
        [selectedSubCategory]: filteredFoods,
      }));

      // set state to Success
      setSuccess();
    },
    [foodList, setGroupedFoodsByCategory, usePageState]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      menuState: food.menuState,
      refetch: async () => {
        try {
          await food.refetch();
        } catch (error) {
          // do nothing
        }
      },
      allGroupedFoods: food.allGroupedFoods,
      filterGroupeFoodsByCategory,
      groupedFoodsByCategory,
      qrItemScreenState,
      qrItemScreenError,
      clearQrItemScreenError,
      resetQrItemScreenState,
      resetState: food.resetState,
    }),
    [
      food.menuState,
      food.refetch,
      food.allGroupedFoods,
      filterGroupeFoodsByCategory,
      groupedFoodsByCategory,
      qrItemScreenState,
      qrItemScreenError,
      clearQrItemScreenError,
      resetQrItemScreenState,
      food.resetState,
    ]
  );

  return (
    <FoodContext.Provider value={contextValue}>{children}</FoodContext.Provider>
  );
};

// Custom hook to use the FoodContext
export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error("useFoodContext must be used within a FoodProvider");
  }
  return context;
};
