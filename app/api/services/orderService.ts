import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { login } from './authService';

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
}

export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  tableName: string;
  tableId: number;
  totalPrice: number;
  orderType: OrderType;
  orderItems: OrderItem[];
}

// Create Order
export const addUpdateOrderApi = async (
  orderId: number,
  tableName: string,
  orderItem: OrderItem,
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
    totalPrice: 0,
    orderType: OrderType.ONLINE,
    orderItem: orderItems,
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
