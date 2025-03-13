import { ApiResponse } from 'app/api/handlers';
import {
  findOrdersByFiltersAndOrdersApi,
  findOrdersByIdApi,
  FindOrdersFilters,
  OrderDetails,
} from 'app/api/services/orderService';
import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  deselectAllFilters,
  FilterStatus,
  mapSelectedFilterNames,
} from 'app/components/filter/filter';

export const useOrder = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  // Initial filter setup
  const initialFilters = {
    orderStatuses: ['Created', 'Completed', 'Canceled'],
    paymentMethods: ['Cash', 'Esewa', 'Fone_Pay', 'Credit'],
    paymentStatuses: ['Paid', 'Unpaid'],
    orderTypes: ['Online', 'Store', 'Takeout', 'Foodmandu'],
  };

  const [orderStatuses, setOrderStatuses] = useState<FilterStatus[]>(() =>
    initialFilters.orderStatuses.map((name) => ({ name, isSelected: false })),
  );
  const [paymentStatuses, setPaymentStatuses] = useState<FilterStatus[]>(() =>
    initialFilters.paymentStatuses.map((name) => ({ name, isSelected: false })),
  );
  const [orderTypes, setOrderTypes] = useState<FilterStatus[]>(() =>
    initialFilters.orderTypes.map((name) => ({ name, isSelected: false })),
  );
  const [paymentMethods, setPaymentMethods] = useState<FilterStatus[]>(() =>
    initialFilters.paymentMethods.map((name) => ({ name, isSelected: false })),
  );

  const findOrdersByFiltersAndOrdersMutation = useMutation<
    ApiResponse<OrderDetails[]>,
    Error,
    { filters: FindOrdersFilters }
  >({
    mutationFn: async ({ filters }) => {
      const response: ApiResponse<OrderDetails[]> = await findOrdersByFiltersAndOrdersApi(filters);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setOrders(response.data || []);
    },
    onError: (err) => {
      console.warn('existing order fetch failed:', err);
      setOrders([]);
    },
  });

  const findOrdersByIdMutation = useMutation<ApiResponse<OrderDetails>, Error, { orderId: number }>(
    {
      mutationFn: async ({ orderId }) => {
        if (!orderId || orderId === 0) {
          throw new Error('Missing order Id');
        }
        const response: ApiResponse<OrderDetails> = await findOrdersByIdApi(orderId);
        if (response.status !== 'success') {
          throw new Error(response.message);
        }
        return response;
      },
      onSuccess: (response) => {
        setOrder(response.data || null);
      },
      onError: (err) => {
        console.warn('existing order fetch failed:', err);
        setOrder(null);
      },
    },
  );

  const fetchOrders = useCallback(
    (filters: FindOrdersFilters) => {
      findOrdersByFiltersAndOrdersMutation.mutate({ filters });
    },
    [findOrdersByFiltersAndOrdersMutation],
  );

  const fetchOrderById = useCallback(
    (orderId: number) => {
      findOrdersByIdMutation.mutate({ orderId });
    },
    [findOrdersByIdMutation],
  );

  const totalAmount = useMemo(
    () => orders.reduce((sum, order) => sum + order.totalAmount, 0),
    [orders],
  );
  const paidAmount = useMemo(
    () =>
      orders
        .filter((order) => order.paymentStatus === 'PAID')
        .reduce((sum, order) => sum + order.totalAmount, 0),
    [orders],
  );
  const unpaidAmount = useMemo(
    () =>
      orders
        .filter((order) => order.paymentStatus === 'UNPAID')
        .reduce((sum, order) => sum + order.totalAmount, 0),
    [orders],
  );
  const totalOrders = useMemo(() => orders.length, [orders]);

  // Helper function to build the orders payload from filters and date.
  const buildOrdersPayload = useCallback(
    (
      finalOrderStatuses: FilterStatus[],
      finalPaymentStatuses: FilterStatus[],
      finalOrderTypes: FilterStatus[],
      finalPaymentMethods: FilterStatus[],
      date: string,
    ): FindOrdersFilters => {
      const selectedOrderStatuses = mapSelectedFilterNames(finalOrderStatuses, true);
      const selectedOrderTypes = mapSelectedFilterNames(finalOrderTypes, true);
      const selectedPaymentMethods = mapSelectedFilterNames(finalPaymentMethods, true);
      const selectedPaymentStatuses = mapSelectedFilterNames(finalPaymentStatuses, true);

      const totalSelected =
        selectedOrderStatuses.length +
        selectedOrderTypes.length +
        selectedPaymentMethods.length +
        selectedPaymentStatuses.length;

      // If no filters are selected, use default order statuses.
      if (totalSelected === 0) {
        return { date, orderStatuses: ['CREATED', 'COMPLETED'] };
      }

      return {
        date,
        orderStatuses: selectedOrderStatuses,
        orderTypes: selectedOrderTypes,
        paymentMethods: selectedPaymentMethods,
        paymentStatuses: selectedPaymentStatuses,
      };
    },
    [],
  );

  // Optimized handleApplyFilters using useCallback and the helper function
  const handleApplyFilters = useCallback(
    (
      finalOrderStatuses: FilterStatus[],
      finalPaymentStatuses: FilterStatus[],
      finalOrderTypes: FilterStatus[],
      finalPaymentMethods: FilterStatus[],
      date: string,
    ) => {
      // Update state with new filter arrays.
      setOrderStatuses(finalOrderStatuses);
      setPaymentStatuses(finalPaymentStatuses);
      setOrderTypes(finalOrderTypes);
      setPaymentMethods(finalPaymentMethods);

      // Build payload using the helper function.
      const payload = buildOrdersPayload(
        finalOrderStatuses,
        finalPaymentStatuses,
        finalOrderTypes,
        finalPaymentMethods,
        date,
      );

      // Execute the order fetch with the constructed payload.
      fetchOrders(payload);
    },
    [fetchOrders, buildOrdersPayload],
  );

  // Clear all filters.
  const handleClearFilter = useCallback(() => {
    setOrderStatuses(deselectAllFilters(orderStatuses));
    setPaymentStatuses(deselectAllFilters(paymentStatuses));
    setOrderTypes(deselectAllFilters(orderTypes));
    setPaymentMethods(deselectAllFilters(paymentMethods));
  }, [orderStatuses, paymentStatuses, orderTypes, paymentMethods]);

  const handleDateSelect = useCallback(
    (selectedDate: string) => {
      // Build payload using the helper function.
      const payload = buildOrdersPayload(
        orderStatuses,
        paymentStatuses,
        orderTypes,
        paymentMethods,
        selectedDate,
      );

      // Execute the order fetch with the constructed payload.
      fetchOrders(payload);
    },
    [fetchOrders, buildOrdersPayload],
  );

  return {
    orders,
    totalAmount,
    paidAmount,
    unpaidAmount,
    totalOrders,

    orderScreenState: findOrdersByFiltersAndOrdersMutation,
    orderDetailScreen: findOrdersByIdMutation,
    order,

    // Filter statuses.
    orderStatuses,
    paymentStatuses,
    orderTypes,
    paymentMethods,

    fetchOrderById,
    handleApplyFilters,
    handleClearFilter,
    handleDateSelect,
  };
};
