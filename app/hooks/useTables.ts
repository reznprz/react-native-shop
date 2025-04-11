import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { Food } from 'app/api/services/foodService';
import { ApiResponse } from 'app/api/handlers';
import { fetchAllTablesApi, RestaurantTable, TableStatus } from 'app/api/services/tableService';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { setTableName } from 'app/redux/tableSlice';
import { navigate, navigationRef } from 'app/navigation/navigationService';
import {
  completeOrderApi,
  fetchExistingOrderByTableNameApi,
  Order,
  OrderItem,
  OrderMenuType,
  OrderType,
} from 'app/api/services/orderService';
import { useAddUpdateOrderMutation } from './apiQuery/useAddUpdateOrderMutation';
import {
  resetPrepTableItems,
  setPrepTableItems,
  applyDiscount,
} from 'app/redux/prepTableItemsSlice';
import { ButtonState } from 'app/components/common/button/LoadingButton';

export interface TableItem {
  id: number;
  userId: number;
  restaurantId: number;
  tableName: string;
  totalPrice: number;
  discountAmount: number;
  subTotal: number;
  orderType: OrderType;
  orderMenuType: OrderMenuType;
  orderItems: OrderItem[];
  date: string;
  paymentInfo: PaymentInfo[];
}

export interface PaymentInfo {
  amount: number;
  paymentType: string;
  note?: string;
}

export enum OperationType {
  ADD = 'ADD',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  NONE = 'NONE',
}

export interface CompleteOrderRequest {
  discountAmount: number;
  totalAmount: number;
  subTotalAmount: number;
  paidAmount?: number;
  creditAmount?: number;
  paymentInfos: PaymentInfo[];
}

/** Helper to map a returned `Order` => local `TableItem`. */
function toTableItem(order: Order): TableItem {
  return {
    id: order.id,
    userId: order.userId,
    restaurantId: order.restaurantId,
    tableName: order.tableName,
    totalPrice: order.totalPrice,
    discountAmount: 0,
    subTotal: order.totalPrice,
    orderType: order.orderType,
    orderMenuType: order.orderMenuType,
    orderItems: order.orderItems,
    date: order.date,
    paymentInfo: [],
  };
}

export const convertFoodToOrderItem = (
  food: Food,
  orderMenuType: string,
  newQuantity: number,
): OrderItem => ({
  id: 0,
  orderId: 0,
  productName: food.name,
  quantity: newQuantity,
  unitPrice: orderMenuType === 'TOURIST' ? food.touristPrice : food.price,
  total: food.price,
  imageUrl: food.img,
});

export function determineOperation(
  order: TableItem,
  updatedItem: OrderItem,
  newQuantity: number,
): OperationType {
  // Look for an existing item with the same product name
  const existingItem = order.orderItems.find(
    (item) => item.productName === updatedItem.productName,
  );
  // If the quantity is 0, we intend to delete the item
  if (newQuantity === 0) {
    return OperationType.DELETE;
  }
  // If no matching item exists, this is a new item addition
  else if (!existingItem) {
    return OperationType.ADD;
  }
  // If found and any attribute has changed, update the item
  else {
    if (existingItem.quantity !== newQuantity || existingItem.unitPrice !== updatedItem.unitPrice) {
      return OperationType.UPDATE;
    }
  }
  return OperationType.NONE;
}

export function updateTableItemWithOrderItem(
  order: TableItem,
  updatedItem: OrderItem,
  newQuantity: number,
): TableItem {
  const op = determineOperation(order, updatedItem, newQuantity);
  switch (op) {
    case OperationType.ADD:
      // Add the new item to orderItems
      return {
        ...order,
        orderItems: [...order.orderItems, updatedItem],
      };

    case OperationType.DELETE:
      // Remove the item matching the product name
      return {
        ...order,
        orderItems: order.orderItems.filter((item) => item.productName !== updatedItem.productName),
      };

    case OperationType.UPDATE:
      // Partially update only the fields you want (e.g., quantity)
      return {
        ...order,
        orderItems: order.orderItems.map((item) => {
          if (item.productName !== updatedItem.productName) {
            return item;
          }
          return {
            ...item,
            // Update only the props you want to change
            quantity: newQuantity,
            // e.g., if unitPrice also changed
            unitPrice: updatedItem.unitPrice,
            // You can recalc total if needed
            total: newQuantity * updatedItem.unitPrice,
          };
        }),
      };

    case OperationType.NONE:
    default:
      // No changes
      return order;
  }
}

export const useRestaurantTablesQuery = (
  restaurantId: number,
): UseQueryResult<ApiResponse<RestaurantTable[]>, Error> => {
  return useQuery<ApiResponse<RestaurantTable[]>, Error>({
    queryKey: ['restaurantTables'],
    queryFn: async (): Promise<ApiResponse<RestaurantTable[]>> => {
      if (!restaurantId || restaurantId === 0) {
        throw new Error('Restaurant is not valid');
      }
      const response = await fetchAllTablesApi(restaurantId);
      if (response.status !== 'success' || !response.data) {
        throw new Error(response.message || 'Error fetching tables');
      }
      return response;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

export function useTables() {
  const dispatch: AppDispatch = useDispatch();
  const tableName = useSelector((state: RootState) => state.table.tableName);
  const prepTableItems = useSelector((state: RootState) => state.prepTableItems);
  const storedAuthData = useSelector((state: RootState) => state.auth.authData);

  const { restaurantId: storeRestaurantId = 0, userId: storedUserId = 0 } = storedAuthData || {};

  const {
    data: tablesData,
    isLoading: isTablesLoading,
    error: tablesError,
    refetch: refetchTables,
  } = useRestaurantTablesQuery(storeRestaurantId);

  const tables: RestaurantTable[] = tablesData?.data || [];

  /**
   * Update state for a Food item, then call api for update with mutation on success we update the orderId.
   */
  const {
    mutate: addOrUpdateOrder,
    error: addUpdateOrderError,
    data: addUpdateOrderData,
    reset: resetAddOrUpdateOrder,
    status: addOrUpdateApiState,
  } = useAddUpdateOrderMutation({
    onSuccess: (response) => {
      if (response.data) {
        if (response.data) {
          const updatedOrder = response.data;
          const updatedTableItem = toTableItem(updatedOrder);
          dispatch(setPrepTableItems(updatedTableItem));
        }
      }
    },
    onError: (err) => {
      console.warn('Add/Update Order failed:', err);
      dispatch(resetPrepTableItems());
    },
  });

  /**
   * Update state for a Food item, then call api for update with mutation.
   */
  const handleAddUpdateFoodItems = useCallback(
    (newQuantity: number, food?: Food, orderItem?: OrderItem, orderMenuType: string = 'NORMAL') => {
      // current state from redux
      const currentState = prepTableItems;

      const item = orderItem || convertFoodToOrderItem(food!, orderMenuType, newQuantity);

      // Compute updated table
      const updatedTableItems = updateTableItemWithOrderItem(currentState, item, newQuantity);

      // Dispatch Redux action to update store
      dispatch(setPrepTableItems(updatedTableItems));

      // Now call the mutation using the updated state
      addOrUpdateOrder({
        orderId: updatedTableItems.id,
        tableName: tableName,
        orderMenuType: orderMenuType,
        totalPrice: item.unitPrice * newQuantity,
        restaurantId: storeRestaurantId,
        userId: storeRestaurantId,
        orderItems: {
          id: 0,
          orderId: updatedTableItems.id,
          productName: item.productName,
          quantity: newQuantity,
          unitPrice: item.unitPrice,
          total: item.unitPrice * newQuantity,
        },
      });
    },
    [prepTableItems, dispatch, tableName, addOrUpdateOrder],
  );

  // Memoized Calculations
  const totalTables = useMemo(() => tables.length, [tables]);

  const availableTables = useMemo(() => {
    return tables.filter((table) => table.status === TableStatus.AVAILABLE).length;
  }, [tables]);

  const occupiedTables = useMemo(() => {
    return tables.filter((table) => table.status === TableStatus.OCCUPIED).length;
  }, [tables]);

  const totalCapacity = useMemo(() => {
    return tables.reduce((sum, table) => sum + table.capacity, 0);
  }, [tables]);

  const activeOrders = useMemo(() => {
    return tables.reduce((sum, table) => sum + table.orderItemsCount, 0);
  }, [tables]);

  const tableNames = useMemo(() => tables.map((t) => t.tableName), [tables]);

  const exstingOrderForTableMutation = useMutation<
    ApiResponse<Order>,
    Error,
    { tableName: string; restaurantId: number }
  >({
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
    onSuccess: (response) => {
      if (response.data && response.data.orderItems && response.data.orderItems.length > 0) {
        dispatch(setPrepTableItems(toTableItem(response.data)));
      } else {
        dispatch(resetPrepTableItems());
      }
    },
    onError: (err) => {
      console.warn('existing order fetch failed:', err);
      dispatch(resetPrepTableItems());
    },
  });

  // Expose a function that accepts tableId and restaurantId to trigger the API call.
  const fetchExistingOrderForTable = async (tableNameParam: string, restaurantIdParam: number) => {
    await exstingOrderForTableMutation.mutateAsync({
      tableName: tableNameParam,
      restaurantId: restaurantIdParam,
    });
  };

  const handleTableClick = useCallback(
    (selectedTableName: string) => {
      fetchExistingOrderForTable(selectedTableName, storeRestaurantId);

      dispatch(setTableName(selectedTableName));
    },
    [dispatch, fetchExistingOrderForTable, tableName],
  );

  const handleGoToMenuPress = useCallback(
    (selectedTableName: string) => {
      fetchExistingOrderForTable(selectedTableName, storeRestaurantId);

      dispatch(setTableName(selectedTableName));
      navigate('MainTabs', {
        screen: 'Menu',
        params: { selectedTab: 'All Foods' },
      });
    },
    [dispatch, tableName, fetchExistingOrderForTable, navigate],
  );

  const handleSelectTable = useCallback(
    (selectedTableName: string) => {
      fetchExistingOrderForTable(selectedTableName, storeRestaurantId);
      dispatch(setTableName(selectedTableName));
    },
    [dispatch, tableName],
  );

  const refreshPrepTableItems = useCallback(
    (selectedTableName: string) => {
      fetchExistingOrderForTable(selectedTableName, storeRestaurantId);
      dispatch(setTableName(selectedTableName));
    },
    [dispatch, tableName],
  );

  const handleAddDiscount = useCallback(
    (amount: number) => dispatch(applyDiscount(amount)),
    [dispatch],
  );

  const handleCompleteOrder = useCallback(
    (paymentInfos: PaymentInfo[]) => {
      const currentState = prepTableItems;
      const { id, totalPrice, discountAmount, subTotal } = currentState;

      const completeOrderRequest: CompleteOrderRequest = {
        discountAmount,
        totalAmount: totalPrice,
        subTotalAmount: subTotal,
        paymentInfos,
      };

      completeOrderMutation.mutate({ payload: completeOrderRequest, orderId: id });
    },
    [dispatch, prepTableItems],
  );

  const completeOrderMutation = useMutation<
    ApiResponse<Order>,
    Error,
    { payload: CompleteOrderRequest; orderId: number }
  >({
    mutationFn: async ({ payload, orderId }) => {
      if (!orderId || payload.paymentInfos.length === 0) {
        throw new Error('Missing orderId or payment Information');
      }
      const response: ApiResponse<Order> = await completeOrderApi(payload, orderId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (response) => {
      console.warn('existing order fetch failed:', response);
    },
    onError: (err) => {
      console.warn('existing order fetch failed:', err);
    },
  });

  const completeOrderState: ButtonState = useMemo(() => {
    if (completeOrderMutation.isPending) {
      return { status: 'loading' };
    }
    if (completeOrderMutation.isError) {
      return {
        status: 'error',
        message: completeOrderMutation.error?.message || 'An error occurred',
        reset: () => completeOrderMutation.reset(),
      };
    }
    if (completeOrderMutation.isSuccess) {
      return { status: 'success', reset: () => completeOrderMutation.reset() };
    }
    return { status: 'idle' };
  }, [completeOrderMutation]);

  const navigateToOrdersScreen = useCallback(() => {
    if (navigationRef.isReady()) {
      navigate('MainTabs', {
        screen: 'Orders',
        params: { selectedTab: 'Todays Order' },
      });

      completeOrderMutation.reset();
      dispatch(resetPrepTableItems());
      refetchTables();
    }
  }, [completeOrderMutation, dispatch]);

  return {
    // TABLES QUERY
    tables,
    isTablesLoading,
    tablesError,
    refetchTables,

    // ORDER MUTATION
    addUpdateOrderData,
    addUpdateOrderError,
    resetAddOrUpdateOrder,

    // COMPLETE ORDER MUTATION
    completeOrderState,

    // REDUX APP STATE
    prepTableItems,
    currentTable: tableName,

    // DERIVED
    totalTables,
    availableTables,
    occupiedTables,
    totalCapacity,
    activeOrders,
    tableNames,

    //Existing Order Mutation
    fetchExistingOrderForTable,
    refreshPrepTableItems,
    exstingOrderForTableMutation,

    // HANDLERS
    handleGoToMenuPress,
    handleTableClick,
    handleAddUpdateFoodItems,
    handleAddDiscount,
    handleCompleteOrder,
    navigateToOrdersScreen,
    handleSelectTable,
  };
}
