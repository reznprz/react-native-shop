import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchExistingOrderByTableNameApi, Order } from '../api/services/orderService';
import { ApiResponse } from 'app/api/handlers';

export function useFetchExistingOrderForTable(
  options?: UseMutationOptions<
    ApiResponse<Order>,
    Error,
    { tableName: string; restaurantId: number }
  >,
) {
  return useMutation<ApiResponse<Order>, Error, { tableName: string; restaurantId: number }>({
    mutationFn: async ({ tableName, restaurantId }) => {
      if (!tableName || !restaurantId) {
        throw new Error('Missing tableName or restaurantId');
      }
      const response: ApiResponse<Order> = await fetchExistingOrderByTableNameApi(
        tableName,
        restaurantId,
      );
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    ...options,
  });
}
