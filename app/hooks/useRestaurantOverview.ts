import { ApiResponse } from 'app/api/handlers';
import { navigate, navigationRef, push } from 'app/navigation/navigationService';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  DailySalesDetails,
  DailySalesTransaction,
  getDailySalesApi,
  getRestaurantOverviewApi,
  initialDailySalesDetails,
  initializeRestaurantOverview,
  RestaurantOverview,
  updateDailySalesApi,
} from 'app/api/services/restaurantOverviewService';
import { ScreenNames } from 'app/types/navigation';
import { CommonActions } from '@react-navigation/native';
import type { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { DateRangeSelection } from 'app/components/date/utils';

export const useRestaurantOverview = () => {
  const [restaurantOverView, setRestaurantOverView] = useState<RestaurantOverview>(
    initializeRestaurantOverview,
  );

  const [dailySales, setDailysales] = useState<DailySalesDetails>(initialDailySalesDetails);

  const storedAuthData = useSelector((state: RootState) => state.auth.authData);

  const { restaurantId: storeRestaurantId = 0 } = storedAuthData || {};

  const getRestaurantOverviewMutation = useMutation<
    ApiResponse<RestaurantOverview>,
    Error,
    { restaurantId: number }
  >({
    mutationFn: async ({ restaurantId }) => {
      if (!restaurantId || restaurantId === 0) {
        throw new Error('RestaurantId is not valid');
      }
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
      console.warn('RestaurantOverview failed:', err);
      setRestaurantOverView(initializeRestaurantOverview);
    },
  });

  const getDailySalesMutation = useMutation<
    ApiResponse<DailySalesDetails>,
    Error,
    { restaurantId: number; date: DateRangeSelection }
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

  const updateDailySalesMutation = useMutation<
    ApiResponse<DailySalesDetails>,
    Error,
    { restaurantId: number; paylaod: DailySalesTransaction }
  >({
    mutationFn: async ({ restaurantId, paylaod }) => {
      const response: ApiResponse<DailySalesDetails> = await updateDailySalesApi(
        restaurantId,
        paylaod,
      );
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setDailysales(response.data || initialDailySalesDetails);
    },
    onError: (err) => {
      console.warn('update daily sales fetch failed:', err);
      setDailysales(initialDailySalesDetails);
    },
  });

  const fetchRestaurantOverView = useCallback(() => {
    getRestaurantOverviewMutation.mutate({ restaurantId: storeRestaurantId });
  }, [getRestaurantOverviewMutation]);

  const fetchDailySales = useCallback(
    (date: DateRangeSelection) => {
      getDailySalesMutation.mutate({ restaurantId: storeRestaurantId, date: date });
    },
    [getDailySalesMutation],
  );

  const handleUpdateOpeningCash = useCallback(
    (amount: number) => {
      const dailySalesTransaction: DailySalesTransaction = {
        id: dailySales.dailySalesTransaction.id,
        openingCash: amount,
        expenses: dailySales.dailySalesTransaction.expenses,
        totalSales: dailySales.dailySalesTransaction.totalSales,
        cash: dailySales.dailySalesTransaction.cash,
        closingCash: dailySales.dailySalesTransaction.closingCash,
        unPaid: dailySales.dailySalesTransaction.unPaid,
        qr: dailySales.dailySalesTransaction.qr,
        date: dailySales.dailySalesTransaction.date,
      };
      updateDailySalesMutation.mutate({
        restaurantId: storeRestaurantId,
        paylaod: dailySalesTransaction,
      });
    },
    [updateDailySalesMutation],
  );

  const handleViewAllPress = (label: string) => {
    switch (label) {
      case 'DailySales':
        navigate(ScreenNames.DAILYSALES, {
          selectedTab: 'Todays',
        });
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

  const handleAddPress = (label: string) => {
    switch (label) {
      case 'DailySales':
        push(ScreenNames.DAILYSALES, { selectedTab: 'Todays' });
        break;
      case 'Expenses':
        push(ScreenNames.EXPENSE);
        break;
      case 'Menu':
        if (navigationRef.isReady()) {
          navigationRef.dispatch(
            CommonActions.navigate({
              name: 'MainTabs',
              params: { screen: 'MENU' },
            }),
          );
        }
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
    updateDailySalesState: updateDailySalesMutation,

    fetchDailySales,
    fetchRestaurantOverView,
    handleViewAllPress,
    handleAddPress,
    handleUpdateOpeningCash,
  };
};
