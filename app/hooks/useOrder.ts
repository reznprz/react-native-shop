import { ApiResponse } from 'app/api/handlers';
import { useSelector } from 'react-redux';
import {
  addPaymentsApi,
  canceledOrderApi,
  findOrdersByFiltersAndOrdersApi,
  findOrdersByIdApi,
  FindOrdersFilters,
  OrderDetails,
  switchPaymentApi,
  switchTableApi,
} from 'app/api/services/orderService';
import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  deselectAllFilters,
  FilterStatus,
  mapSelectedFilterNames,
} from 'app/components/filter/filter';
import { PaymentInfo } from './useTables';
import { ButtonState } from 'app/components/common/button/LoadingButton';
import { RootState } from 'app/redux/rootReducer';
import { DateRangeSelection, DateRangeSelectionType } from 'app/components/date/utils';

export const useOrder = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const storedRestaurantId = useSelector((state: RootState) => state.auth.authData?.restaurantId);

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

  const canceledOrderMutation = useMutation<ApiResponse<OrderDetails>, Error, { orderId: number }>({
    mutationFn: async ({ orderId }) => {
      if (!orderId || orderId === 0) {
        throw new Error('Missing order Id');
      }
      const response: ApiResponse<OrderDetails> = await canceledOrderApi(orderId);
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
  });

  const switchTableMutation = useMutation<
    ApiResponse<OrderDetails>,
    Error,
    { orderId: number; tableName: string }
  >({
    mutationFn: async ({ orderId, tableName }) => {
      if (!orderId || orderId === 0) {
        throw new Error('Missing order Id');
      }
      const response: ApiResponse<OrderDetails> = await switchTableApi(orderId, tableName);
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
  });

  const switchPaymentMutation = useMutation<
    ApiResponse<OrderDetails>,
    Error,
    { orderId: number; paymentId: number; paymentType: string }
  >({
    mutationFn: async ({ orderId, paymentId, paymentType }) => {
      if (!orderId || orderId === 0) {
        throw new Error('Missing order Id');
      }
      const response: ApiResponse<OrderDetails> = await switchPaymentApi(
        orderId,
        paymentId,
        paymentType,
      );
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
  });

  const addPaymentsMutation = useMutation<
    ApiResponse<OrderDetails>,
    Error,
    { orderId: number; paymentInfos: PaymentInfo[] }
  >({
    mutationFn: async ({ orderId, paymentInfos }) => {
      if (!orderId || paymentInfos.length === 0) {
        throw new Error('Missing order Id or payments');
      }
      const response: ApiResponse<OrderDetails> = await addPaymentsApi(orderId, paymentInfos);
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
    },
  });

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

  const addPayments = useCallback(
    (orderId: number, paymentInfos: PaymentInfo[]) => {
      addPaymentsMutation.mutate({ orderId, paymentInfos });
    },
    [addPaymentsMutation],
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
      selectedDateRange: DateRangeSelection,
    ): FindOrdersFilters => {
      const selectedOrderStatuses = mapSelectedFilterNames(finalOrderStatuses, true);
      const selectedOrderTypes = mapSelectedFilterNames(finalOrderTypes, true);
      const selectedPaymentMethods = mapSelectedFilterNames(finalPaymentMethods, true);
      const selectedPaymentStatuses = mapSelectedFilterNames(finalPaymentStatuses, true);

      // Build the base object:
      const base: FindOrdersFilters = {
        restaurantId: storedRestaurantId || 0,
      };

      //  Interpret the union:
      switch (selectedDateRange.selectionType) {
        case DateRangeSelectionType.QUICK_RANGE:
          // e.g. { label: "Past 15 Mins", unit: "minutes", value: 15 }
          base.quickRangeLabel = selectedDateRange.quickRange.label;
          base.quickRangeUnit = selectedDateRange.quickRange.unit;
          base.quickRangeValue = selectedDateRange.quickRange.value;
          break;

        case DateRangeSelectionType.TIME_RANGE_TODAY:
          // e.g. { startHour, startMin, endHour, endMin }
          base.timeRangeToday = {
            startHour: selectedDateRange.startHour,
            startMin: selectedDateRange.startMin,
            endHour: selectedDateRange.endHour,
            endMin: selectedDateRange.endMin,
          };
          break;

        case DateRangeSelectionType.SINGLE_DATE:
          // e.g. "2025-03-25"
          base.singleDate = selectedDateRange.date;
          break;

        case DateRangeSelectionType.DATE_RANGE:
          // e.g. "startDate" and "endDate"
          base.startDate = selectedDateRange.startDate;
          base.endDate = selectedDateRange.endDate;
          break;
      }

      const totalSelected =
        selectedOrderStatuses.length +
        selectedOrderTypes.length +
        selectedPaymentMethods.length +
        selectedPaymentStatuses.length;

      // If no filters are selected, use default order statuses.
      if (totalSelected === 0) {
        base.orderStatuses = ['CREATED', 'COMPLETED'];
      } else {
        // Add the filter arrays
        if (selectedOrderStatuses.length > 0) {
          base.orderStatuses = selectedOrderStatuses;
        }
        if (selectedOrderTypes.length > 0) {
          base.orderTypes = selectedOrderTypes;
        }
        if (selectedPaymentMethods.length > 0) {
          base.paymentMethods = selectedPaymentMethods;
        }
        if (selectedPaymentStatuses.length > 0) {
          base.paymentStatuses = selectedPaymentStatuses;
        }
      }

      base.selectionType = selectedDateRange.selectionType;

      return base;
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
      selectedDateRange: DateRangeSelection,
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
        selectedDateRange,
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
    (selectedDateRange: DateRangeSelection) => {
      // Build payload using the helper function.
      const payload = buildOrdersPayload(
        orderStatuses,
        paymentStatuses,
        orderTypes,
        paymentMethods,
        selectedDateRange,
      );

      // Execute the order fetch with the constructed payload.
      fetchOrders(payload);
    },
    [fetchOrders, buildOrdersPayload],
  );

  const handleAddPayments = useCallback(
    (orderId: number, newPayments: PaymentInfo[]) => {
      addPayments(orderId, newPayments);
    },
    [addPaymentsMutation],
  );

  const handleCancelOrder = useCallback(
    (orderId: number) => {
      canceledOrderMutation.mutate({ orderId: orderId });
    },
    [canceledOrderMutation],
  );

  const handleSwitchTable = useCallback(
    (orderId: number, selectedTable: string) => {
      switchTableMutation.mutate({ orderId: orderId, tableName: selectedTable });
    },
    [switchTableMutation],
  );

  const handleSwitchPayment = useCallback(
    (orderId: number, paymentId: number, newPaymentType: string) => {
      switchPaymentMutation.mutate({
        orderId: orderId,
        paymentId: paymentId,
        paymentType: newPaymentType,
      });
    },
    [switchPaymentMutation],
  );

  const addPaymentState: ButtonState = useMemo(() => {
    if (addPaymentsMutation.isPending) {
      return { status: 'loading' };
    }
    if (addPaymentsMutation.isError) {
      return {
        status: 'error',
        message: addPaymentsMutation.error?.message || 'An error occurred',
        reset: () => addPaymentsMutation.reset(),
      };
    }
    if (addPaymentsMutation.isSuccess) {
      return { status: 'success', reset: () => addPaymentsMutation.reset() };
    }
    return { status: 'idle' };
  }, [addPaymentsMutation]);

  const canceledOrderState: ButtonState = useMemo(() => {
    if (canceledOrderMutation.isPending) {
      return { status: 'loading' };
    }
    if (canceledOrderMutation.isError) {
      return {
        status: 'error',
        message: canceledOrderMutation.error?.message || 'An error occurred',
        reset: () => canceledOrderMutation.reset(),
      };
    }
    if (canceledOrderMutation.isSuccess) {
      return { status: 'success', reset: () => canceledOrderMutation.reset() };
    }
    return { status: 'idle' };
  }, [canceledOrderMutation]);

  const switchTableState: ButtonState = useMemo(() => {
    if (switchTableMutation.isPending) {
      return { status: 'loading' };
    }
    if (switchTableMutation.isError) {
      return {
        status: 'error',
        message: switchTableMutation.error?.message || 'An error occurred',
        reset: () => switchTableMutation.reset(),
      };
    }
    if (switchTableMutation.isSuccess) {
      return { status: 'success', reset: () => switchTableMutation.reset() };
    }
    return { status: 'idle' };
  }, [switchTableMutation]);

  const switchPaymentState: ButtonState = useMemo(() => {
    if (switchPaymentMutation.isPending) {
      return { status: 'loading' };
    }
    if (switchPaymentMutation.isError) {
      return {
        status: 'error',
        message: switchPaymentMutation.error?.message || 'An error occurred',
        reset: () => switchPaymentMutation.reset(),
      };
    }
    if (switchPaymentMutation.isSuccess) {
      return { status: 'success', reset: () => switchPaymentMutation.reset() };
    }
    return { status: 'idle' };
  }, [switchPaymentMutation]);

  return {
    orders,
    totalAmount,
    paidAmount,
    unpaidAmount,
    totalOrders,

    orderScreenState: findOrdersByFiltersAndOrdersMutation,
    orderDetailScreen: findOrdersByIdMutation,
    order,

    //add payment api
    addPaymentState,

    // canceled order api state
    canceledOrderState,

    // switchTable api State
    switchTableState,

    // switchPayment api state
    switchPaymentState,

    // Filter statuses.
    orderStatuses,
    paymentStatuses,
    orderTypes,
    paymentMethods,

    fetchOrderById,
    handleApplyFilters,
    handleClearFilter,
    handleDateSelect,
    handleAddPayments,
    handleCancelOrder,
    handleSwitchTable,
    handleSwitchPayment,
  };
};
