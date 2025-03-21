import { ApiResponse } from 'app/api/handlers';
import { navigate, navigationRef, push } from 'app/navigation/navigationService';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  DailySalesDetails,
  getDailySalesApi,
  getRestaurantOverviewApi,
  initialDailySalesDetails,
  initializeRestaurantOverview,
  RestaurantOverview,
} from 'app/api/services/restaurantOverviewService';
import { ScreenNames } from 'app/types/navigation';
import { CommonActions } from '@react-navigation/native';

export const useRestaurantOverview = () => {
  const [restaurantOverView, setRestaurantOverView] = useState<RestaurantOverview>(
    initializeRestaurantOverview,
  );

  const [dailySales, setDailysales] = useState<DailySalesDetails>(initialDailySalesDetails);

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

  const getDailySalesMutation = useMutation<
    ApiResponse<DailySalesDetails>,
    Error,
    { restaurantId: number; date: string }
  >({
    mutationFn: async ({ restaurantId, date }) => {
      const response: ApiResponse<DailySalesDetails> = await getDailySalesApi(restaurantId, date);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setDailysales(response.data || initialDailySalesDetails);
    },
    onError: (err) => {
      console.warn('find expense fetch failed:', err);
      setDailysales(initialDailySalesDetails);
    },
  });

  const fetchRestaurantOverView = useCallback(() => {
    getRestaurantOverviewMutation.mutate({ restaurantId: 1 });
  }, [getRestaurantOverviewMutation]);

  const fetchDailySales = useCallback(
    (date: string) => {
      getDailySalesMutation.mutate({ restaurantId: 1, date: date });
    },
    [getDailySalesMutation],
  );

  const handleViewAllPress = (label: string) => {
    switch (label) {
      case 'DailySales':
        push(ScreenNames.DAILYSALES);
        break;
      case 'Expenses':
        push(ScreenNames.EXPENSE);
        break;
      case 'TopProducts':
        console.log('Navigating to TopProducts');
        break;
      case 'Inventory':
        console.log('Navigating to Inventory');
        break;
      case 'RecentTrans':
        if (navigationRef.isReady()) {
          navigationRef.dispatch(
            CommonActions.navigate({
              name: 'MainTabs',
              params: { screen: 'Orders' },
            }),
          );
        }
        break;
      default:
        console.warn('Unknown option selected');
        break;
    }
  };

  return {
    restaurantOverView,
    dailySalesDetails: dailySales,
    restaurantOverViewState: getRestaurantOverviewMutation,
    dailySalesState: getDailySalesMutation,

    fetchDailySales,
    fetchRestaurantOverView,
    handleViewAllPress,
  };
};
