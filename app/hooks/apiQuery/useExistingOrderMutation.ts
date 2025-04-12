import { useMutation } from '@tanstack/react-query';
import { fetchExistingOrderByTableNameApi, Order } from 'app/api/services/orderService';
import { ApiResponse } from 'app/api/handlers';

interface MutationVariables {
  tableName: string;
  restaurantId: number;
}

/**
 * A reusable hook for fetching an existing order for a specific table.
 *
 * @param onSuccess - Callback receiving the order data (or null)
 * @param onError - Optional callback for handling errors
 */
export const useExistingOrderMutation = (
  onSuccess: (order: Order | null) => void,
  onError?: (err: Error) => void,
) =>
  useMutation<ApiResponse<Order>, Error, MutationVariables>({
    mutationFn: async ({ tableName, restaurantId }) => {
      if (!tableName || !restaurantId) {
        throw new Error('Missing tableName or restaurantId');
      }
      const response = await fetchExistingOrderByTableNameApi(tableName, restaurantId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      // Convert the API response to the expected order data
      onSuccess(response.data ?? null);
    },
    onError,
  });
