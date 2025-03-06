import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { addUpdateOrderApi, Order, OrderItem } from '../api/services/orderService';
import { ApiResponse } from 'app/api/handlers';

export interface AddUpdateOrderParams {
  orderId: number;
  tableName: string;
  orderItems: OrderItem;
}

/**
 * React Query Mutation for creating/updating an Order
 * for React Query v5.
 */
export function useAddUpdateOrderMutation(
  options?: UseMutationOptions<ApiResponse<Order>, Error, AddUpdateOrderParams>,
) {
  // We call useMutation with an object that has `mutationFn` plus any additional options:
  return useMutation<ApiResponse<Order>, Error, AddUpdateOrderParams>({
    // Our mutation function (required)
    mutationFn: async (params: AddUpdateOrderParams) => {
      const { orderId, tableName, orderItems } = params;
      if (!tableName || !orderItems) {
        throw new Error('Missing tableName, or orderItems');
      }
      const response: ApiResponse<Order> = await addUpdateOrderApi(orderId, tableName, orderItems);

      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    // Spread your custom options (onSuccess, onError, etc.)
    ...options,
  });
}
