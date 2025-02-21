import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFoods,
  resetState,
  setFilteredFoods,
  setLoading,
  setError,
  clearError,
  clearFilteredFoods,
} from "app/redux/foodSlice";
import { RootState, AppDispatch } from "app/redux/store";
import { SubCategory } from "app/redux/foodSlice";
import { usePageState } from "./reducers/usePageState";

export const useFood = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get food data from Redux store
  const { foods, groupedFoods, loading, error, filterData } = useSelector(
    (state: RootState) => state.foods
  );

  // Function to fetch foods
  const refetch = useCallback(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  // Function to filter foods by category
  const filterGroupedFoodsByCategory = useCallback(
    (selectedSubCategory: SubCategory) => {
      dispatch(setLoading());

      console.log("selectedSubCategory", selectedSubCategory);
      if (!foods) {
        dispatch(setError("Food list is not available")); // Set error in Redux
        return;
      }

      // Normalize strings for comparison
      const normalizeString = (str: string) =>
        str.toLowerCase().replace(/\s+/g, "").trim();

      const selectedCategory = normalizeString(selectedSubCategory);

      const filteredFoods = foods.filter((foodItem) => {
        const categoryNameTwo = normalizeString(foodItem.categoryNameTwo || "");
        const isMatch = categoryNameTwo === selectedCategory;

        return isMatch;
      });

      dispatch(
        setFilteredFoods({
          category: selectedSubCategory,
          foods: filteredFoods,
        })
      );

      dispatch(clearError());
    },
    [foods, dispatch, usePageState]
  );

  // Function to reset state
  const reset = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  return {
    foods,
    allGroupedFoods: groupedFoods,
    loading,
    error,
    refetch,
    reset,
    filterData,
    filterGroupedFoodsByCategory,
    clearFilteredFoods,
  };
};
