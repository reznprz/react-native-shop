import { useReducer, useEffect, useCallback, useState } from "react";
import { fetchAllFoods, Food } from "../api/services/foodService";
import { ApiResponse } from "../api/handlers/index";
import { GetAllFoodsResponse } from "../api/services/foodService";
import { apiReducer, getInitialApiState } from "./reducers/apiReducer";

export enum SubCategory {
  MainCourses = "Main Courses",
  AppetizersAndSides = "Appetizers & Sides",
  Beverages = "Beverages",
  Desserts = "Desserts",
  SpecialtyItems = "Specialty Items",
  Breakfast = "Breakfast",
}

export const useFood = () => {
  const [state, dispatch] = useReducer(
    apiReducer<GetAllFoodsResponse["payload"]>,
    getInitialApiState<GetAllFoodsResponse["payload"]>()
  );

  const [groupedFoods, setGroupedFoods] = useState<Record<SubCategory, Food[]>>(
    {} as Record<SubCategory, Food[]>
  );

  const fetchFoods = useCallback(async () => {
    dispatch({ type: "FETCH_INIT" });

    try {
      const response: ApiResponse<GetAllFoodsResponse> = await fetchAllFoods();

      if (response.status === "success") {
        setGroupedFoods(groupFoodBySubCategory(response.data?.payload || []));
        dispatch({
          type: "FETCH_SUCCESS",
          payload: response.data?.payload || [],
        });
      } else {
        dispatch({ type: "FETCH_FAILURE", error: response.message });
      }
    } catch (error) {
      dispatch({
        type: "FETCH_FAILURE",
        error: "An unexpected error occurred",
      });
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  return {
    menuState: state, // ApiState<Food[]>
    refetch: fetchFoods,
    groupedFoods,
  };
};

function groupFoodBySubCategory(foods: Food[]): Record<SubCategory, Food[]> {
  return foods.reduce((acc, food) => {
    let subCategory: SubCategory;

    switch (food.categoryName) {
      case "PIZZA":
      case "CHOWMEIN":
      case "THUKPA":
      case "MOMO":
      case "CHOPSUEY":
      case "FRIED RICE":
      case "NEWARI KHAJA SET":
      case "NOODLES":
      case "Wrap":
        subCategory = SubCategory.MainCourses;
        break;

      case "SOUP":
      case "SNACKS":
      case "OUR SPECIAL":
      case "OUR SPECIAL DRINKS":
      case "SPECIAL WINGS":
      case "COMBO SPECIAL MENU":
        subCategory = SubCategory.AppetizersAndSides;
        break;

      case "TEA":
      case "COFFEE":
      case "ICED BREW":
      case "LEMONADE":
      case "LASSI":
      case "DRINKS":
      case "MOCKTAIL":
      case "BUBBLE TEA":
      case "FLAVORED LATTE":
      case "SHAKE":
      case "FRAPPE":
        subCategory = SubCategory.Beverages;
        break;

      case "ICE CREAM":
        subCategory = SubCategory.Desserts;
        break;

      case "HOOKAH":
      case "CIGARETTE":
        subCategory = SubCategory.SpecialtyItems;
        break;

      case "BREAKFAST":
      case "SHA-JHYA WAFFLES":
      case "SHA-JHYA BITES":
        subCategory = SubCategory.Breakfast;
        break;

      default:
        return acc; // Skip if no matching category is found
    }

    if (!acc[subCategory]) {
      acc[subCategory] = [];
    }

    acc[subCategory].push(food);
    return acc;
  }, {} as Record<SubCategory, Food[]>);
}
