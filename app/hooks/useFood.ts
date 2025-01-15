import { useReducer, useCallback, useState } from "react";
import { fetchAllFoods, Food } from "../api/services/foodService";
import { ApiResponse } from "../api/handlers/index";
import { GetAllFoodsResponse } from "../api/services/foodService";
import { apiReducer, getInitialApiState } from "./reducers/apiReducer";
import { groupFoodBySubCategory } from "./utils/groupFoodBySubCategory";

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

  const [allGroupedFoods, setAllGroupedFoods] = useState<
    Record<SubCategory, Food[]>
  >({} as Record<SubCategory, Food[]>);

  const fetchFoods = useCallback(async () => {
    dispatch({ type: "FETCH_INIT" });

    try {
      const response: ApiResponse<GetAllFoodsResponse> = await fetchAllFoods();

      if (response.status === "success") {
        const grouped = groupFoodBySubCategory(response.data?.payload || []);
        setAllGroupedFoods(grouped);
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

  const resetState = useCallback(async () => {
    dispatch({ type: "RESET" });
  }, [dispatch]);

  return {
    menuState: state,
    refetch: fetchFoods,
    allGroupedFoods,
    resetState,
  };
};
