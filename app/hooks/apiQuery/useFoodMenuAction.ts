import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchFoodMenu, FoodMenuResponse } from 'app/api/services/foodService';
import { setFoodMenu, resetFoodMenu } from 'app/redux/foodMenuSlice';
import { ApiResponse } from 'app/api/handlers';

/**
 * Custom hook to manage food menu fetching and syncing
 * Redux state with React Query's cache.
 */
export function useFoodMenuActions() {
  const dispatch = useDispatch(); // Redux dispatcher
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
    isPending: isLoading, // Loading state
    isSuccess, // Success state
    isError, // Error state
    error, // Error object
  } = useMutation<ApiResponse<FoodMenuResponse>, Error, number>({
    mutationFn: fetchFoodMenu, // Actual API call
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

  // Return fetch functions and current status flags
  return {
    loadFoodMenu, // For initial load (cached if possible)
    refetchFoodMenu, // For manual refresh (always network)
    isLoading, // Indicates loading in progress
    isSuccess, // Indicates successful fetch
    isError, // Indicates error occurred
    error, // Error object if any
  };
}
