import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { login } from './authService';

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
}

export interface RestaurantTable {
  tableName: string;
  status: TableStatus;
  capacity: number;
  orderItemsCount: number;
}

// Fetch all tables with Status
export const fetchAllTablesApi = async (): Promise<ApiResponse<RestaurantTable[]>> => {
  await login({ username: 'ree', password: 'reeree' });
  return await apiMethods.get<RestaurantTable[]>(`/api/restaurant-tables/1`);
};
