import { useMutation } from '@tanstack/react-query';
import { completeOrderApi, Order } from 'app/api/services/orderService';
import { ApiResponse } from 'app/api/handlers';
import { CompleteOrderRequest } from '../useTables';

/**
 * Custom hook to complete an order.
 *
 * @param onSuccess - Callback fired with the order data upon a successful response.
 * @param onError - Optional callback for error handling.
 */
export const useCompleteOrderMutation = (
  onSuccess?: (order: Order) => void,
  onError?: (err: Error) => void,
) =>
  useMutation<ApiResponse<Order>, Error, { payload: CompleteOrderRequest; orderId: number }>({
    mutationFn: async ({ payload, orderId }) => {
      if (!orderId || payload.paymentInfos.length === 0) {
        throw new Error('Missing orderId or payment information');
      }
      const response = await completeOrderApi(payload, orderId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (!response.data) {
        throw new Error('No order data returned');
      }
      onSuccess?.(response.data);
    },
    onError,
  });
