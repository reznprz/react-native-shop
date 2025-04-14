import { ApiResponse } from 'app/api/handlers';
import {
  addExpenseApi,
  deleteExpenseApi,
  Expense,
  ExpenseDetailResponse,
  findExpenseByDateRangeApi,
  initialExpenseDetailResponse,
} from 'app/api/services/expenseService';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

export const useExpenses = () => {
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetailResponse>(
    initialExpenseDetailResponse,
  );

  const storedAuthData = useSelector((state: RootState) => state.auth.authData);

  const { restaurantId: storeRestaurantId = 0, userId: storedUserId = 0 } = storedAuthData || {};

  const createExpenseMutation = useMutation<
    ApiResponse<ExpenseDetailResponse>,
    Error,
    { newExpense: Expense }
  >({
    mutationFn: async ({ newExpense }) => {
      const response: ApiResponse<ExpenseDetailResponse> = await addExpenseApi(
        storeRestaurantId,
        storedUserId,
        newExpense,
      );
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setExpenseDetails(response.data || initialExpenseDetailResponse);
    },
    onError: (err) => {
      setExpenseDetails(initialExpenseDetailResponse);
    },
  });

  const findExpenseByDateRangeMutation = useMutation<
    ApiResponse<ExpenseDetailResponse>,
    Error,
    { date: string; restaurantId: number }
  >({
    mutationFn: async ({ date, restaurantId }) => {
      const response: ApiResponse<ExpenseDetailResponse> = await findExpenseByDateRangeApi(
        date,
        restaurantId,
      );
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setExpenseDetails(response.data || initialExpenseDetailResponse);
    },
    onError: (err) => {
      setExpenseDetails(initialExpenseDetailResponse);
    },
  });

  const deleteExpenseMutation = useMutation<
    ApiResponse<ExpenseDetailResponse>,
    Error,
    { id: number }
  >({
    mutationFn: async ({ id }) => {
      const response: ApiResponse<ExpenseDetailResponse> = await deleteExpenseApi(id);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setExpenseDetails(response.data || initialExpenseDetailResponse);
    },
    onError: (err) => {
      setExpenseDetails(initialExpenseDetailResponse);
    },
  });

  const fetchExpense = useCallback(
    (date: string) => {
      findExpenseByDateRangeMutation.mutate({ date: date, restaurantId: storeRestaurantId });
    },
    [findExpenseByDateRangeMutation],
  );

  const handleAddExpense = useCallback(
    (newExpense: Expense) => {
      createExpenseMutation.mutate({ newExpense: newExpense });
    },
    [createExpenseMutation],
  );

  const handleDeleteExpense = useCallback(
    (id: number) => {
      deleteExpenseMutation.mutate({ id: id });
    },
    [deleteExpenseMutation],
  );

  return {
    expenseDetails,
    expenseScreenState: findExpenseByDateRangeMutation,
    addExpenseState: createExpenseMutation,
    deleteExpenseState: deleteExpenseMutation,

    handleAddExpense,
    fetchExpense,
    handleDeleteExpense,
  };
};
