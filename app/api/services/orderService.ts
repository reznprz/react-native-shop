import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { login } from './authService';
import { CompleteOrderRequest } from 'app/hooks/useTables';

export interface OrderItem {
  id: number;
  orderId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  imageUrl?: string;
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
  orderItems: OrderItem[];
}

export interface FindOrdersFilters {
  date?: string;
  orderStatus?: string[];
  paymentStatus?: string[];
  orderType?: string[];
  paymentMethod?: string[];
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
    orderType: OrderType.ONLINE,
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

  return await apiMethods.get<OrderDetails[]>('/public/api/orders', { params: filters });
};

export const findOrdersByIdApi = async (orderId: number): Promise<ApiResponse<OrderDetails>> => {
  await login({ username: 'ree', password: 'reeree' });
  return await apiMethods.get<OrderDetails>(`/public/api/orders/${orderId}`);
};
