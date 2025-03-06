import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { Food } from 'app/api/services/foodService';
import { ApiResponse } from 'app/api/handlers';
import { fetchAllTablesApi, RestaurantTable, TableStatus } from 'app/api/services/tableService';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { setTableName } from 'app/redux/tableSlice';
import { navigate } from 'app/navigation/navigationService';
import {
  fetchExistingOrderByTableNameApi,
  Order,
  OrderItem,
  OrderType,
} from 'app/api/services/orderService';
import { useAddUpdateOrderMutation } from './useAddUpdateOrderMutation';
import { resetPrepTableItems, setPrepTableItems } from 'app/redux/prepTableItemsSlice';

export interface TableItem {
  id: number;
  userId: number;
  restaurantId: number;
  tableName: string;
  totalPrice: number;
  orderType: OrderType;
  orderItems: OrderItem[];
  paymentInfo: PaymentInfo[];
}

export interface PaymentInfo {
  paymentType: string;
  debitAmount: number;
  creditAmount: number;
  totalAmount: number;
  discountAmount: number;
  subTotal: number;
  paymentStatus: string;
}

/** Helper to map a returned `Order` => local `TableItem`. */
function toTableItem(order: Order): TableItem {
  return {
    id: order.id,
    userId: order.userId,
    restaurantId: order.restaurantId,
    tableName: order.tableName,
    totalPrice: order.totalPrice,
    orderType: order.orderType,
    orderItems: order.orderItems,
    paymentInfo: [],
  };
}

const initialTableItem: TableItem = {
  id: 0,
  userId: 0,
  restaurantId: 0,
  tableName: '',
  totalPrice: 0,
  orderType: OrderType.STORE,
  orderItems: [],
  paymentInfo: [],
};

// Query: Fetch Restaurant Tables
export const useRestaurantTablesQuery = (): UseQueryResult<
  ApiResponse<RestaurantTable[]>,
  Error
> => {
  return useQuery<ApiResponse<RestaurantTable[]>, Error>({
    queryKey: ['restaurantTables'],
    queryFn: async (): Promise<ApiResponse<RestaurantTable[]>> => {
      const response = await fetchAllTablesApi();
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

  const {
    data: tablesData,
    isLoading: isTablesLoading,
    error: tablesError,
    refetch: refetchTables,
  } = useRestaurantTablesQuery();

  const tables: RestaurantTable[] = tablesData?.data || [];

  // Mutation: Add or Update Order
  const {
    mutate: addOrUpdateOrder,
    error: addUpdateOrderError,
    data: addUpdateOrderData,
    reset: resetAddOrUpdateOrder,
  } = useAddUpdateOrderMutation({
    onSuccess: (response) => {
      if (response.data) {
        const updatedOrder = response.data;
        const updatedTableItem = toTableItem(updatedOrder);
        dispatch(setPrepTableItems(updatedTableItem));
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
  const updateCartItemForFood = useCallback(
    (food: Food, newQuantity: number) => {
      // current state from redux
      const currentState = prepTableItems;

      // check for existing item
      const existingIndex = currentState.orderItems.findIndex(
        (item) => item.productName === food.name,
      );

      let updatedOrderItems: OrderItem[] = [];

      // ts returns -1 if not found
      if (existingIndex > -1) {
        // Update existing item
        updatedOrderItems = [...currentState.orderItems];
        const existingItem = updatedOrderItems[existingIndex];
        updatedOrderItems[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
          total: food.price * newQuantity,
        };
      } else {
        // Add new item
        updatedOrderItems = [
          ...currentState.orderItems,
          {
            id: 0, // new item id created when inserted into db
            orderId: currentState.id,
            productName: food.name,
            quantity: newQuantity,
            unitPrice: food.price,
            total: food.price * newQuantity,
          },
        ];
      }

      const updatedTotalPrice = updatedOrderItems.reduce((acc, item) => acc + item.total, 0);

      const updatedPrepTableItems = {
        ...currentState,
        tableName: tableName, // from redux
        restaurantId: 1,
        totalPrice: updatedTotalPrice,
        orderItems: updatedOrderItems,
      };

      // Dispatch the new state
      dispatch(setPrepTableItems(updatedPrepTableItems));

      // Now call the mutation using the updated state
      addOrUpdateOrder({
        orderId: updatedPrepTableItems.id,
        tableName: tableName,
        orderItems: {
          id: 0, // new item id created when inserted into db
          orderId: updatedPrepTableItems.id,
          productName: food.name,
          quantity: newQuantity,
          unitPrice: food.price,
          total: food.price * newQuantity,
        },
      });
    },
    [prepTableItems, dispatch, tableName, addOrUpdateOrder],
  );

  /**
   * Update state for a Food item, then call api for update with mutation.
   */
  const updateCartItemForOrderItem = useCallback(
    (orderItem: OrderItem, newQuantity: number) => {
      // Compute updated state
      const currentState = prepTableItems;
      const existingIndex = currentState.orderItems.findIndex(
        (item) => item.productName === orderItem.productName,
      );

      if (existingIndex === -1) return;

      const updatedOrderItems = [...currentState.orderItems];
      const existing = updatedOrderItems[existingIndex];
      updatedOrderItems[existingIndex] = {
        ...existing,
        quantity: newQuantity,
        total: existing.unitPrice * newQuantity,
      };

      const updatedTotalPrice = updatedOrderItems.reduce((acc, item) => acc + item.total, 0);

      const updatedPrepTableItems = {
        ...currentState,
        tableName: tableName,
        restaurantId: 1,
        totalPrice: updatedTotalPrice,
        orderItems: updatedOrderItems,
      };

      // Dispatch the new state
      dispatch(setPrepTableItems(updatedPrepTableItems));

      // Call the mutation with the updated state
      addOrUpdateOrder({
        orderId: updatedPrepTableItems.id,
        tableName: tableName,
        orderItems: {
          id: 0,
          orderId: updatedPrepTableItems.id,
          productName: orderItem.productName,
          quantity: newQuantity,
          unitPrice: orderItem.unitPrice,
          total: orderItem.unitPrice * newQuantity,
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
      if (selectedTableName !== tableName) {
        fetchExistingOrderForTable(selectedTableName, 1);
      }
      dispatch(setTableName(selectedTableName));
    },
    [dispatch, fetchExistingOrderForTable, tableName],
  );
  
  const handleGoToMenuClick = useCallback(
    (selectedTableName: string) => {
      if (selectedTableName !== tableName) {
        fetchExistingOrderForTable(selectedTableName, 1);
      } 
      dispatch(setTableName(selectedTableName));
      navigate('MainTabs', {
        screen: 'Menu',
        params: { selectedTab: 'All Foods' },
      });
    },
    [dispatch, tableName, fetchExistingOrderForTable, navigate],
  );
  

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

    // LOCAL STATE
    prepTableItems,

    // DERIVED
    totalTables,
    availableTables,
    occupiedTables,
    totalCapacity,
    activeOrders,
    tableNames,

    //Existing Order Mutation
    fetchExistingOrderForTable,
    exstingOrderForTableMutation,

    // HANDLERS
    handleGoToMenuClick,
    handleTableClick,
    updateCartItemForFood,
    updateCartItemForOrderItem,
  };
}
