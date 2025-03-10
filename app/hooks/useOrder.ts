import { ApiResponse } from 'app/api/handlers';
import {
  findOrdersByFiltersAndOrdersApi,
  findOrdersByIdApi,
  FindOrdersFilters,
  OrderDetails,
} from 'app/api/services/orderService';
import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Filter, FilterStatus, mapSelectedFilterNames } from 'app/components/filter/filter';

export const useOrder = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  const [order, setOrder] = useState<OrderDetails | null>(null);

  // Initial filter setup
  const initialFilters = {
    orderStatuses: ['Created', 'Completed', 'Canceled'],
    paymentMethods: ['Esewa', 'Fone_Pay', 'Credit'],
    paymentStatuses: ['Paid', 'Unpaid'],
    orderTypes: ['Online', 'Store', 'Takeout', 'Foodmandu'],
  };

  const [orderStatuses, setOrderStatuses] = useState<FilterStatus[]>(() =>
    initialFilters.orderStatuses.map((name) => ({
      name,
      isSelected: false,
    })),
  );

  const [paymentStatuses, setPaymentStatuses] = useState<FilterStatus[]>(() =>
    initialFilters.paymentStatuses.map((name) => ({
      name,
      isSelected: false,
    })),
  );

  const [orderTypes, setOrderTypes] = useState<FilterStatus[]>(() =>
    initialFilters.orderTypes.map((name) => ({
      name,
      isSelected: false,
    })),
  );

  const [paymentMethods, setPaymentMethods] = useState<FilterStatus[]>(() =>
    initialFilters.paymentMethods.map((name) => ({
      name,
      isSelected: false,
    })),
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
    [findOrdersByFiltersAndOrdersMutation, orders],
  );

  const fetchOrderById = useCallback(
    (orderId: number) => {
      console.log('fetching order by id', orderId);
      findOrdersByIdMutation.mutate({ orderId });
    },
    [findOrdersByIdMutation, orders],
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

  const handleApplyFilters = (
    finalOrderStatuses: FilterStatus[],
    finalPaymentStatuses: FilterStatus[],
    finalOrderTypes: FilterStatus[],
    finalPaymentMethods: FilterStatus[],
    date: string,
  ) => {
    setOrderStatuses(finalOrderStatuses);
    setPaymentStatuses(finalPaymentStatuses);
    setOrderTypes(finalOrderTypes);
    setPaymentMethods(finalPaymentMethods);

    const payload: FindOrdersFilters = {
      date,
      orderStatuses: mapSelectedFilterNames(finalOrderStatuses, true),
      orderTypes: mapSelectedFilterNames(finalOrderTypes, true),
      paymentMethods: mapSelectedFilterNames(finalPaymentMethods, true),
      paymentStatuses: mapSelectedFilterNames(finalPaymentStatuses, true),
    };

    fetchOrders(payload);
  };

  return {
    orders,
    totalAmount,
    paidAmount,
    unpaidAmount,
    totalOrders,

    orderScreenState: findOrdersByFiltersAndOrdersMutation,
    orderDetailScreen: findOrdersByIdMutation,
    order,

    // Filter statuses
    orderStatuses,
    paymentStatuses,
    orderTypes,
    paymentMethods,

    fetchOrders,
    fetchOrderById,
    handleApplyFilters,
  };
};
