import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';

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
export const fetchAllTablesApi = async (
  restaurantId: number,
): Promise<ApiResponse<RestaurantTable[]>> => {
  return await apiMethods.get<RestaurantTable[]>(`/api/restaurant-tables/${restaurantId}`);
};
