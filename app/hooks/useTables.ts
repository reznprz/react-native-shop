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
import { resetPrepTableItems, setPrepTableItems } from 'app/redux/prepTableItemsSlice';
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

export const convertFoodToOrderItem = (food: Food, orderMenuType: string): OrderItem => ({
  id: 0,
  orderId: 0,
  productName: food.name,
  quantity: 1,
  unitPrice: orderMenuType === 'TOURIST' ? food.touristPrice : food.price,
  total: food.price,
  imageUrl: food.img,
});

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

  // Mutation: Add or Update Order
  const {
    mutate: addOrUpdateOrder,
    error: addUpdateOrderError,
    data: addUpdateOrderData,
    reset: resetAddOrUpdateOrder,
  } = useAddUpdateOrderMutation({
    onSuccess: (response) => {
      if (response.data) {
        // const updatedOrder = response.data;
        // const updatedTableItem = toTableItem(updatedOrder);
        // dispatch(setPrepTableItems(updatedTableItem));
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

      const item = orderItem || convertFoodToOrderItem(food!, orderMenuType);

      // check for existing item
      const existingIndex = currentState.orderItems.findIndex(
        (item) => item.productName === item.productName,
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
          total: item.unitPrice * newQuantity,
        };
      } else {
        // Add new item
        updatedOrderItems = [
          ...currentState.orderItems,
          {
            id: 0, // new item id created when inserted into db
            orderId: currentState.id,
            productName: item.productName,
            quantity: newQuantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * newQuantity,
          },
        ];
      }

      const updatedTotalPrice = updatedOrderItems.reduce((acc, item) => acc + item.total, 0);

      const updatedPrepTableItems = {
        ...currentState,
        tableName: tableName, // from redux
        restaurantId: storeRestaurantId,
        totalPrice: updatedTotalPrice,
        orderItems: updatedOrderItems,
      };

      // Dispatch the new state
      dispatch(setPrepTableItems(updatedPrepTableItems));

      // Now call the mutation using the updated state
      addOrUpdateOrder({
        orderId: updatedPrepTableItems.id,
        tableName: tableName,
        orderMenuType: orderMenuType,
        totalPrice: item.unitPrice * newQuantity,
        restaurantId: storeRestaurantId,
        userId: storeRestaurantId,
        orderItems: {
          id: 0,
          orderId: updatedPrepTableItems.id,
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

  const handleAddDiscount = useCallback(
    (discountAmount: number) => {
      const currentState = prepTableItems;
      const newTotal = currentState.subTotal - discountAmount;
      const updatedPrepTableItems = {
        ...currentState,
        discountAmount: discountAmount,
        totalPrice: newTotal,
      };
      dispatch(setPrepTableItems(updatedPrepTableItems));
    },
    [dispatch, prepTableItems],
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
      console.log('Completing order:', orderId, payload);
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
      return { status: 'success' };
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
    handleGoToMenuPress,
    handleTableClick,
    handleAddUpdateFoodItems,
    handleAddDiscount,
    handleCompleteOrder,
    navigateToOrdersScreen,
    handleSelectTable,
  };
}
