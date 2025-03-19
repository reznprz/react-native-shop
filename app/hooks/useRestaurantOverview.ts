import { ApiResponse } from 'app/api/handlers';

import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  getRestaurantOverviewApi,
  initializeRestaurantOverview,
  RestaurantOverview,
} from 'app/api/services/restaurantOverviewService';

export const useRestaurantOverview = () => {
  const [restaurantOverView, setRestaurantOverView] = useState<RestaurantOverview>(
    initializeRestaurantOverview,
  );

  const getRestaurantOverviewMutation = useMutation<
    ApiResponse<RestaurantOverview>,
    Error,
    { restaurantId: number }
  >({
    mutationFn: async ({ restaurantId }) => {
      const response: ApiResponse<RestaurantOverview> =
        await getRestaurantOverviewApi(restaurantId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setRestaurantOverView(response.data || initializeRestaurantOverview);
    },
    onError: (err) => {
      console.warn('find expense fetch failed:', err);
      setRestaurantOverView(initializeRestaurantOverview);
    },
  });

  const fetchRestaurantOverView = useCallback(() => {
    getRestaurantOverviewMutation.mutate({ restaurantId: 1 });
  }, [getRestaurantOverviewMutation]);

  return {
    restaurantOverView,
    restaurantOverViewState: getRestaurantOverviewMutation,

    fetchRestaurantOverView,
  };
};
