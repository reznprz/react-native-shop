import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/store';
import { useMutation } from '@tanstack/react-query';
import { ApiResponse } from 'app/api/handlers';
import {
  addTableApi,
  deleteTableApi,
  fetchAllTablesApi,
  RestaurantTableInfo,
  updateTableApi,
} from 'app/api/services/tableService';

export const useTableManager = () => {
  // redux
  const storedRestaurantId = useSelector((state: RootState) => state.auth.authData?.restaurantId);

  // localState
  const [tables, setTables] = useState<RestaurantTableInfo[]>([]);

  const getTableMutation = useMutation<
    ApiResponse<RestaurantTableInfo[]>,
    Error,
    { restaurantId: number }
  >({
    mutationFn: async ({ restaurantId }) => {
      if (!restaurantId || restaurantId === 0) {
        throw new Error('Missing restaurantId Id');
      }
      const response: ApiResponse<RestaurantTableInfo[]> = await fetchAllTablesApi(restaurantId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        setTables(response.data);
      }
    },
    onError: (err) => {
      console.warn('fetch table failed:', err);
    },
  });

  const addTableMutation = useMutation<
    ApiResponse<RestaurantTableInfo[]>,
    Error,
    { restaurantId: number; newTable: RestaurantTableInfo }
  >({
    mutationFn: async ({ restaurantId, newTable }) => {
      if (!restaurantId || restaurantId === 0) {
        throw new Error('Missing restaurantId Id');
      }
      const response: ApiResponse<RestaurantTableInfo[]> = await addTableApi(
        restaurantId,
        newTable,
      );
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        setTables(response.data);
      }
    },
    onError: (err) => {
      console.warn('add table failed:', err);
    },
  });

  const updateTableMutation = useMutation<
    ApiResponse<RestaurantTableInfo[]>,
    Error,
    { tableId: number; updatedTable: RestaurantTableInfo }
  >({
    mutationFn: async ({ tableId, updatedTable }) => {
      if (!tableId || tableId === 0) {
        throw new Error('Missing tableId');
      }
      const response: ApiResponse<RestaurantTableInfo[]> = await updateTableApi(
        tableId,
        updatedTable,
      );
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        setTables(response.data);
      }
    },
    onError: (err) => {
      console.warn('update table failed:', err);
    },
  });

  const deleteTableMutation = useMutation<
    ApiResponse<RestaurantTableInfo[]>,
    Error,
    { tableId: number }
  >({
    mutationFn: async ({ tableId }) => {
      if (!tableId || tableId === 0) {
        throw new Error('Missing tableId');
      }
      const response: ApiResponse<RestaurantTableInfo[]> = await deleteTableApi(tableId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 'success' && response.data) {
        setTables(response.data);
      }
    },
    onError: (err) => {
      console.warn('delete table failed:', err);
    },
  });

  return {
    restaurantId: storedRestaurantId || 0,

    tables,
    getTableMutation,
    addTableMutation,
    updateTableMutation,
    deleteTableMutation,
  };
};
