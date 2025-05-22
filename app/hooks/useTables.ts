import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { Food } from 'app/api/services/foodService';
import { RestaurantTable, TableStatus } from 'app/api/services/tableService';
import { setTableName } from 'app/redux/tableSlice';
import { navigate, navigationRef } from 'app/navigation/navigationService';
import { Order, OrderItem, OrderMenuType, OrderType } from 'app/api/services/orderService';
import { useAddUpdateOrderMutation } from './apiQuery/useAddUpdateOrderMutation';
import {
  resetPrepTableItems,
  setPrepTableItems,
  applyDiscount,
} from 'app/redux/prepTableItemsSlice';
import { ButtonState } from 'app/components/common/button/LoadingButton';

// Local Api Query & helpers
import { useRestaurantTablesQuery } from './apiQuery/useRestaurantTablesQuery';
import { useExistingOrderMutation } from './apiQuery/useExistingOrderMutation';
import { useCompleteOrderMutation } from './apiQuery/useCompleteOrderMutation';

// Types
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

export function useTables() {
  // Redux state & dispatch
  const dispatch: AppDispatch = useDispatch();
  const tableName = useSelector((state: RootState) => state.table.tableName);
  const prepTableItems = useSelector((state: RootState) => state.prepTableItems);
  const storedAuthData = useSelector((state: RootState) => state.auth.authData);
  const { restaurantId: storeRestaurantId = 0, userId: storedUserId = 0 } = storedAuthData || {};

  // Queries Api
  const {
    data: tablesData,
    isLoading: isTablesLoading,
    error: tablesError,
    refetch: refetchTables,
  } = useRestaurantTablesQuery(storeRestaurantId);
  const tables: RestaurantTable[] = tablesData?.data || [];

  const {
    mutate: completeOrderMutation,
    data: completeOrderData,
    isError: isCompleteOrderError,
    isPending: isCompleteOrderPending, // React Query v5 uses isPending
    error: completeOrderError,
    isSuccess: isCompleteOrderSuccess,
    reset: resetCompleteOrder,
  } = useCompleteOrderMutation();

  // Derived values (memoised)
  const [totalTables, availableTables, occupiedTables, totalCapacity, activeOrders, tableNames] =
    useMemo(() => {
      const total = tables.length;
      const available = tables.filter((t) => t.status === TableStatus.AVAILABLE).length;
      const occupied = total - available;
      const capacity = tables.reduce((sum, t) => sum + t.capacity, 0);
      const active = tables.reduce((sum, t) => sum + t.orderItemsCount, 0);
      const names = tables.map((t) => t.tableName);
      return [total, available, occupied, capacity, active, names];
    }, [tables]);

  // Expose a function that accepts tableId and restaurantId to trigger the API call.
  const fetchExistingOrderForTable = async (tableNameParam: string, restaurantIdParam: number) => {
    await exstingOrderForTable.mutateAsync({
      tableName: tableNameParam,
      restaurantId: restaurantIdParam,
    });
  };

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
          if (response.data) {
            const { id: orderId = 0, totalPrice: orderTotalAmount = 0 } = response.data || {};

            dispatch(
              setPrepTableItems({
                id: orderId,
                totalPrice: orderTotalAmount - prepTableItems.discountAmount,
                subTotal: orderTotalAmount,
              }),
            );
          } else {
            refetchTables();
            // fetch existing orders in background
            fetchExistingOrderForTable(tableName, storeRestaurantId);
          }
        }
      }
    },
    onError: (err) => {
      console.warn('Add/Update Order failed:', err);
      // fetch existing orders in background
      fetchExistingOrderForTable(tableName, storeRestaurantId);
    },
  });

  /**
   * Update state for a Food item, then call api for update with mutation.
   */
  const handleAddUpdateFoodItems = useCallback(
    (newQuantity: number, food?: Food, orderItem?: OrderItem, orderMenuType: string = 'NORMAL') => {
      const currentState = prepTableItems;

      const item = orderItem || convertFoodToOrderItem(food!, orderMenuType, newQuantity);

      // Compute updated table
      const updatedTableItems = updateTableItemWithOrderItem(currentState, item, newQuantity);
      dispatch(setPrepTableItems(updatedTableItems));

      // Query Api call
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

  const exstingOrderForTable = useExistingOrderMutation(
    (order) => {
      if (order && order.orderItems && order.orderItems.length > 0) {
        dispatch(setPrepTableItems(toTableItem(order)));
      } else {
        dispatch(resetPrepTableItems());
      }
    },
    (error) => {
      console.warn('existing order fetch failed:', error);
      dispatch(resetPrepTableItems());
    },
  );

  const handleTableClick = useCallback(
    (selectedTableName: string) => {
      fetchExistingOrderForTable(selectedTableName, storeRestaurantId);

      // TODO: migrate this redux to the prepTableItemsSlice
      dispatch(setTableName(selectedTableName));
    },
    [dispatch, fetchExistingOrderForTable, tableName],
  );

  const handleGoToMenuPress = useCallback(
    (selectedTableName: string) => {
      fetchExistingOrderForTable(selectedTableName, storeRestaurantId);

      // TODO: migrate this redux to the prepTableItemsSlice
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
      // TODO: migrate this redux to the prepTableItemsSlice
      dispatch(setTableName(selectedTableName));
    },
    [dispatch, tableName],
  );

  const refreshPrepTableItems = useCallback(
    (selectedTableName: string) => {
      fetchExistingOrderForTable(selectedTableName, storeRestaurantId);
      // TODO: migrate this redux to the prepTableItemsSlice
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

      completeOrderMutation({ payload: completeOrderRequest, orderId: id });
    },
    [dispatch, prepTableItems],
  );

  // Custom state for UI LoadingButton
  const completeOrderState: ButtonState = useMemo(() => {
    if (isCompleteOrderPending) {
      return { status: 'loading' };
    }
    if (isCompleteOrderError) {
      return {
        status: 'error',
        message: completeOrderError?.message || 'An error occurred',
        reset: () => resetCompleteOrder(),
      };
    }
    if (isCompleteOrderSuccess) {
      return { status: 'success', reset: () => resetCompleteOrder() };
    }
    return { status: 'idle' };
  }, [
    isCompleteOrderPending,
    isCompleteOrderError,
    completeOrderError,
    isCompleteOrderSuccess,
    resetCompleteOrder,
  ]);

  const navigateToOrdersScreen = useCallback(() => {
    if (navigationRef.isReady()) {
      navigate('MainTabs', {
        screen: 'Orders',
        params: { selectedTab: 'Todays Order' },
      });

      resetCompleteOrder();
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
    exstingOrderForTableMutation: exstingOrderForTable,

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
