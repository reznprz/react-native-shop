import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  addCategoriesApi,
  addFoodApi,
  Category,
  deleteCategoryApi,
  deleteFoodApi,
  fetchFoodMenuApi,
  Food,
  FoodMenuResponse,
  updateCategoriesApi,
  updateFoodApi,
} from 'app/api/services/foodService';
import { setFoodMenu, resetFoodMenu, setFoods, setCategories } from 'app/redux/foodMenuSlice';
import { ApiResponse } from 'app/api/handlers';

/**
 * Custom hook to manage food menu fetching and syncing
 * Redux state with React Query's cache.
 */
export function useFoodMenuActions() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); // React Query cache manager

  // Handles response from API, dispatching to Redux or throwing on failure
  const handleApiResponse = (res: ApiResponse<FoodMenuResponse>) => {
    if (res.status === 'success' && res.data) {
      dispatch(setFoodMenu(res.data)); // Store in Redux slice
      return res.data;
    }
    dispatch(resetFoodMenu()); // Reset on failure
    throw new Error(res.message || 'food-menu request failed');
  };

  // React Query mutation for fetching food menu
  const {
    mutateAsync: runFetch, // Async trigger function
    isPending: isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation<ApiResponse<FoodMenuResponse>, Error, number>({
    mutationFn: fetchFoodMenuApi, // Actual API call
    onSuccess: (res, restaurantId) => {
      handleApiResponse(res); // Update Redux
      queryClient.setQueryData(['foodMenu', restaurantId], res); // Cache API response
    },
  });

  // Fetches menu and updates both Redux and cache (used after login)
  const loadFoodMenu = useCallback(
    async (restaurantId: number) => runFetch(restaurantId),
    [runFetch],
  );

  // Forces a fresh fetch from the server (used in pull-to-refresh)
  const refetchFoodMenu = useCallback(
    async (restaurantId: number) => {
      queryClient.invalidateQueries({ queryKey: ['foodMenu', restaurantId] }); // Force refresh
      return runFetch(restaurantId); // Fetch new data
    },
    [runFetch, queryClient],
  );

  const addFoodMutation = useMutation<
    ApiResponse<Food[]>,
    Error,
    { restaurantId: number; categoryId: number; newFood: Food; file?: File }
  >({
    mutationFn: async ({ restaurantId, categoryId, newFood, file }) => {
      if (!restaurantId || categoryId === 0) {
        throw new Error('Missing restaurantId/category Id');
      }
      const response: ApiResponse<Food[]> = await addFoodApi(
        restaurantId,
        categoryId,
        newFood,
        file,
      );
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        dispatch(setFoods(response.data));
      }
    },
    onError: (err) => {
      console.warn('add food failed:', err);
    },
  });

  const updateFoodMutation = useMutation<
    ApiResponse<Food[]>,
    Error,
    { foodId: number; updatedFood: Food; file?: File }
  >({
    mutationFn: async ({ foodId, updatedFood, file }) => {
      if (!foodId || foodId === 0) {
        throw new Error('Missing foodId');
      }
      const response: ApiResponse<Food[]> = await updateFoodApi(foodId, updatedFood, file);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        dispatch(setFoods(response.data));
      }
    },
    onError: (err) => {
      console.warn('update food failed:', err);
    },
  });

  const deleteFoodMutation = useMutation<ApiResponse<Food[]>, Error, { foodId: number }>({
    mutationFn: async ({ foodId }) => {
      if (!foodId || foodId === 0) {
        throw new Error('Missing foodId');
      }
      const response: ApiResponse<Food[]> = await deleteFoodApi(foodId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        dispatch(setFoods(response.data));
      }
    },
    onError: (err) => {
      console.warn('delete food failed:', err);
    },
  });

  const addCategoryMutation = useMutation<
    ApiResponse<Category[]>,
    Error,
    { restaurantId: number; newCategory: Category }
  >({
    mutationFn: async ({ restaurantId, newCategory }) => {
      if (!newCategory || restaurantId === 0) {
        throw new Error('Missing restaurantId Id');
      }
      const response: ApiResponse<Category[]> = await addCategoriesApi(restaurantId, newCategory);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        dispatch(setCategories(response.data));
      }
    },
    onError: (err) => {
      console.warn('add category failed:', err);
    },
  });

  const updateCategoryMutation = useMutation<
    ApiResponse<Category[]>,
    Error,
    { updatedCategory: Category }
  >({
    mutationFn: async ({ updatedCategory }) => {
      if (!updatedCategory.id || updatedCategory.id === 0) {
        throw new Error('Missing categoryId');
      }
      const response: ApiResponse<Category[]> = await updateCategoriesApi(updatedCategory);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        dispatch(setCategories(response.data));
      }
    },
    onError: (err) => {
      console.warn('update food failed:', err);
    },
  });

  const deleteCategoryMutation = useMutation<
    ApiResponse<Category[]>,
    Error,
    { restaurantId: number; categoryId: number }
  >({
    mutationFn: async ({ restaurantId, categoryId }) => {
      if (!restaurantId || categoryId === 0) {
        throw new Error('Missing restaurantId/category Id');
      }
      const response: ApiResponse<Category[]> = await deleteCategoryApi(restaurantId, categoryId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        dispatch(setCategories(response.data));
      }
    },
    onError: (err) => {
      console.warn('delete category failed:', err);
    },
  });

  return {
    loadFoodMenu, // For initial load (cached if possible)
    refetchFoodMenu,
    isLoading,
    isSuccess,
    isError,
    error,

    //mutations
    addFoodMutation,
    updateFoodMutation,
    deleteFoodMutation,
    addCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
}
