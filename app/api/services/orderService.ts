import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { login } from './authService';
import { CompleteOrderRequest, PaymentInfo } from 'app/hooks/useTables';
import qs from 'qs';
import { DateRangeSelectionType } from 'app/components/DateRangePickerModal';
import { IconMetadata } from './expenseService';

export interface OrderItem {
  id: number;
  orderId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  imageUrl?: string;
  iconDetails?: IconMetadata;
}

export enum OrderType {
  ONLINE = 'ONLINE',
  STORE = 'STORE',
  TAKEOUT = 'TAKEOUT',
  FOODMANDU = 'FOODMANDU',
}

export enum OrderMenuType {
  NORMAL = 'NORMAL',
  TOURIST = 'TOURIST',
}

export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  tableName: string;
  tableId: number;
  totalPrice: number;
  orderType: OrderType;
  orderMenuType: OrderMenuType;
  date: string;
  orderItems: OrderItem[];
}

export interface FindOrdersFilters {
  restaurantId: number;

  // filter status arrays of strings
  orderStatuses?: string[];
  paymentStatuses?: string[];
  orderTypes?: string[];
  paymentMethods?: string[];

  // The new date-range approach
  quickRangeLabel?: string; // e.g. "Past 15 Mins"
  quickRangeUnit?: 'minutes' | 'days';
  quickRangeValue?: number;
  selectionType?: DateRangeSelectionType;

  timeRangeToday?: {
    startHour: number;
    startMin: number;
    endHour: number;
    endMin: number;
  };

  singleDate?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrderDetails {
  orderId: number;
  restaurantId: number;
  tableName: string;
  orderStatus: string;
  paymentStatus: string;
  orderType: OrderType;
  paymentMethod: string;
  orderItems: OrderItem[];
  totalAmount: number;
  subTotalAmount: number;
  discountAmount: number;
  orderMenuType: string;
  payments: PaymentDetails[];
  groupedPaymentByNotesAndDate?: Record<string, PaymentDetails[]>;
  timeStamp: TimeStamp;
}

export interface PaymentDetails {
  id: number;
  restaurantId: number;
  invoiceId: number;
  orderId: number;
  creditAmount: number;
  amount: number;
  paymentMethod: string;
  note?: string;
  paymentDate: string;
}

export interface TimeStamp {
  createdDate: string;
  createdTime: string;
  completedDate: string;
  completedTime: string;
}

// Create Order
export const addUpdateOrderApi = async (
  orderId: number,
  tableName: string,
  orderItem: OrderItem,
  orderMenuType: string,
  totalPrice: number,
): Promise<ApiResponse<Order>> => {
  await login({ username: 'ree', password: 'reeree' });

  const restaurantId = 1;
  const userId = 1;

  const orderItems = {
    id: orderItem.id,
    orderId: orderItem.orderId,
    productName: orderItem.productName,
    quantity: orderItem.quantity,
    unitPrice: orderItem.unitPrice,
    total: orderItem.total,
  };

  const order = {
    id: orderId,
    userId: userId,
    restaurantId: restaurantId,
    tableName: tableName,
    tableId: 1,
    totalPrice: totalPrice,
    orderType: OrderType.STORE,
    orderItem: orderItems,
    orderMenuType: orderMenuType,
  };
  return await apiMethods.post<Order>(`/public/api/orders/addUpdate`, order);
};

export const fetchExistingOrderByTableNameApi = async (
  tableName: string,
  restaurantId: number,
): Promise<ApiResponse<Order>> => {
  await login({ username: 'ree', password: 'reeree' });
  return await apiMethods.get<Order>('/public/api/orders/find-by-table-and-restaurant', {
    params: { tableName, restaurantId },
  });
};

export const completeOrderApi = async (
  payload: CompleteOrderRequest,
  orderId: number,
): Promise<ApiResponse<Order>> => {
  await login({ username: 'ree', password: 'reeree' });
  return await apiMethods.post<Order>(`/public/api/orders/${orderId}/complete`, payload);
};

export const findOrdersByFiltersAndOrdersApi = async (
  filters: FindOrdersFilters,
): Promise<ApiResponse<OrderDetails[]>> => {
  await login({ username: 'ree', password: 'reeree' });

  const queryParams: Record<string, any> = {};

  // filters for order status, payment status, etc.
  if (filters.orderStatuses && filters.orderStatuses.length > 0) {
    queryParams.orderStatus = filters.orderStatuses;
  }
  if (filters.paymentStatuses && filters.paymentStatuses.length > 0) {
    queryParams.paymentStatus = filters.paymentStatuses;
  }
  if (filters.orderTypes && filters.orderTypes.length > 0) {
    queryParams.orderType = filters.orderTypes;
  }
  if (filters.paymentMethods && filters.paymentMethods.length > 0) {
    queryParams.paymentMethod = filters.paymentMethods;
  }

  // handle date/time selection type
  queryParams.selectionType = filters.selectionType;

  if (filters.quickRangeLabel) {
    // e.g. "Past 15 Mins"
    queryParams.quickRangeLabel = filters.quickRangeLabel;
    if (filters.quickRangeUnit) {
      queryParams.quickRangeUnit = filters.quickRangeUnit; // "minutes" or "days"
    }
    if (filters.quickRangeValue !== undefined) {
      queryParams.quickRangeValue = filters.quickRangeValue; // e.g. 15
    }
  }
  if (filters.timeRangeToday) {
    queryParams.startHour = filters.timeRangeToday.startHour;
    queryParams.startMin = filters.timeRangeToday.startMin;
    queryParams.endHour = filters.timeRangeToday.endHour;
    queryParams.endMin = filters.timeRangeToday.endMin;
  }
  if (filters.singleDate) {
    queryParams.singleDate = filters.singleDate; // e.g. "2025-03-25T00:00:00.000Z"
  }
  if (filters.startDate && filters.endDate) {
    // e.g. "2025-03-20T00:00:00.000Z" to "2025-03-22T00:00:00.000Z"
    queryParams.startDate = filters.startDate;
    queryParams.endDate = filters.endDate;
  }

  // Finally:
  return await apiMethods.get<OrderDetails[]>(`/public/api/orders/date/${filters.restaurantId}`, {
    params: queryParams,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  });
};

export const findOrdersByIdApi = async (orderId: number): Promise<ApiResponse<OrderDetails>> => {
  await login({ username: 'ree', password: 'reeree' });
  return await apiMethods.get<OrderDetails>(`/public/api/orders/${orderId}`);
};

export const canceledOrderApi = async (orderId: number): Promise<ApiResponse<OrderDetails>> => {
  await login({ username: 'ree', password: 'reeree' });
  return await apiMethods.put<OrderDetails>(`/public/api/orders/canceled/${orderId}`, {});
};

export const switchTableApi = async (
  orderId: number,
  tableName: string,
): Promise<ApiResponse<OrderDetails>> => {
  await login({ username: 'ree', password: 'reeree' });
  return await apiMethods.put<OrderDetails>(
    `/public/api/orders/switch/table/${orderId}?tableName=${tableName}`,
    {},
  );
};

export const switchPaymentApi = async (
  orderId: number,
  paymentId: number,
  paymentType: string,
): Promise<ApiResponse<OrderDetails>> => {
  await login({ username: 'ree', password: 'reeree' });
  return await apiMethods.put<OrderDetails>(
    `/public/api/orders/switch/payment/${orderId}/${paymentId}?paymentType=${paymentType}`,
    {},
  );
};

export const addPaymentsApi = async (
  orderId: number,
  paymentInfos: PaymentInfo[],
): Promise<ApiResponse<OrderDetails>> => {
  await login({ username: 'ree', password: 'reeree' });
  return await apiMethods.post<OrderDetails>(`/public/api/orders/${orderId}/payment`, paymentInfos);
};
