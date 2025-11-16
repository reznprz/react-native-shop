import type { RootState, AppDispatch } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { ApiResponse } from 'app/api/handlers';
import {
  getRestaurantApi,
  getSubscriptionPlansApi,
  PlanSummary,
  RestaurantData,
  updateRestaurantApi,
} from 'app/api/services/restaurantService';
import { setRestaurantImgUrl } from 'app/redux/authSlice';
import { useState } from 'react';
import { useDeleteContactMutation, useUpsertContactMutation } from './apiQuery/useContactMutations';
import { setThemeVariant } from 'app/redux/themeSlice';

export const useRestaurant = () => {
  const dispatch: AppDispatch = useDispatch();

  const storedAuthData = useSelector((state: RootState) => state.auth.authData);
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<Record<string, PlanSummary> | null>(
    null,
  );
  const upsertContactMutation = useUpsertContactMutation((response) =>
    setRestaurantData(response.data!),
  );
  const deleteContactMutation = useDeleteContactMutation((response) =>
    setRestaurantData(response.data!),
  );

  const getRestaurantMutation = useMutation<
    ApiResponse<RestaurantData>,
    Error,
    { restaurantId: number }
  >({
    mutationFn: async ({ restaurantId }) => {
      if (!restaurantId || restaurantId === 0) {
        throw new Error('Missing restaurantId Id');
      }
      const response: ApiResponse<RestaurantData> = await getRestaurantApi(restaurantId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        setRestaurantData(response.data);
      }
    },
    onError: (err) => {
      console.warn('fetch table failed:', err);
    },
  });

  const getSubscriptionPlansMutation = useMutation<ApiResponse<Record<string, PlanSummary>>, Error>(
    {
      mutationFn: async () => {
        const response: ApiResponse<Record<string, PlanSummary>> = await getSubscriptionPlansApi();
        if (response.status !== 'success') {
          throw new Error(response.message);
        }
        return response;
      },
      onSuccess: (response) => {
        if (response.status === 'success' && response.data) {
          setSubscriptionPlans(response.data);
        }
      },
      onError: (err) => {
        console.warn('fetch table failed:', err);
      },
    },
  );

  const updateRestaurantMutation = useMutation<
    ApiResponse<RestaurantData>,
    Error,
    { restaurantId: number; updatedRestaurant: RestaurantData; file?: File }
  >({
    mutationFn: async ({ restaurantId, updatedRestaurant, file }) => {
      if (!restaurantId || restaurantId === 0) {
        throw new Error('Missing restaurantId');
      }
      const response: ApiResponse<RestaurantData> = await updateRestaurantApi(
        restaurantId,
        updatedRestaurant,
        file,
      );
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        setRestaurantData(response.data);
        dispatch(setThemeVariant(response.data.themeVariant));

        if (response.data.imageUrl) {
          dispatch(setRestaurantImgUrl(response.data.imageUrl));
        }
      }
    },
    onError: (err) => {
      console.warn('update table failed:', err);
    },
  });

  return {
    storedAuthData,
    restaurantData,

    //mutation
    getRestaurantMutation,
    updateRestaurantMutation,
    // contact operations
    upsertContactMutation,
    deleteContactMutation,

    //subscriptions plans
    subscriptionPlans,
    getSubscriptionPlansMutation,
  };
};
