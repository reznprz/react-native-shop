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

export interface RestaurantTableInfo {
  id: number;
  tableName: string;
  capacity: number;
}

// Fetch all tables with Status
export const fetchAllTablesWithStatusApi = async (
  restaurantId: number,
): Promise<ApiResponse<RestaurantTable[]>> => {
  return await apiMethods.get<RestaurantTable[]>(`/api/restaurant-tables/${restaurantId}`);
};

export const fetchAllTablesApi = async (
  restaurantId: number,
): Promise<ApiResponse<RestaurantTableInfo[]>> => {
  return await apiMethods.get<RestaurantTableInfo[]>(
    `/api/restaurant-tables/restaurant/${restaurantId}`,
  );
};

export const addTableApi = async (
  restaurantId: number,
  newTable: RestaurantTableInfo,
): Promise<ApiResponse<RestaurantTableInfo[]>> => {
  return await apiMethods.post<RestaurantTableInfo[]>(
    `/api/restaurant-tables/${restaurantId}`,
    newTable,
  );
};

export const updateTableApi = async (
  tableId: number,
  updatedTable: RestaurantTableInfo,
): Promise<ApiResponse<RestaurantTableInfo[]>> => {
  return await apiMethods.put<RestaurantTableInfo[]>(
    `/api/restaurant-tables/${tableId}`,
    updatedTable,
  );
};

export const deleteTableApi = async (
  tableId: number,
): Promise<ApiResponse<RestaurantTableInfo[]>> => {
  return await apiMethods.delete<RestaurantTableInfo[]>(`/api/restaurant-tables/${tableId}`);
};
