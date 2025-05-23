// src/app/api/useContactMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse } from 'app/api/handlers';
import type {
  ContactRequestDto,
  ContactType,
  RestaurantData,
} from 'app/api/services/restaurantService';
import { upsertContactApi, deleteContactApi } from 'app/api/services/restaurantService';

/**
 * Hook to add or update a contact (email or phone), sync cache, and invoke optional callback on success.
 */
export function useUpsertContactMutation(
  onSuccessCallback?: (response: ApiResponse<RestaurantData>) => void,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RestaurantData>,
    Error,
    { restaurantId: number; payload: ContactRequestDto }
  >({
    mutationFn: ({ restaurantId, payload }) =>
      upsertContactApi(restaurantId, payload).then((res) => {
        if (res.status !== 'success') throw new Error(res.message);
        return res;
      }),
    onSuccess: (response, { restaurantId }) => {
      // Update React-Query cache for the restaurant data
      queryClient.setQueryData<RestaurantData>(['restaurant', restaurantId], response.data!);
      // invoke optional callback
      if (onSuccessCallback) {
        onSuccessCallback(response);
      }
    },
    onError: (err) => {
      console.warn('Upsert contact failed:', err);
    },
  });
}

/**
 * Hook to delete a contact (email or phone), sync cache, and invoke optional callback on success.
 */
export function useDeleteContactMutation(
  onSuccessCallback?: (response: ApiResponse<RestaurantData>) => void,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RestaurantData>,
    Error,
    { restaurantId: number; type: ContactType; contactId: number }
  >({
    mutationFn: ({ restaurantId, type, contactId }) =>
      deleteContactApi(restaurantId, type, contactId).then((res) => {
        if (res.status !== 'success') throw new Error(res.message);
        return res;
      }),
    onSuccess: (response, { restaurantId }) => {
      // Update React-Query cache for the restaurant data
      queryClient.setQueryData<RestaurantData>(['restaurant', restaurantId], response.data!);
      // invoke optional callback
      if (onSuccessCallback) {
        onSuccessCallback(response);
      }
    },
    onError: (err) => {
      console.warn('Delete contact failed:', err);
    },
  });
}
