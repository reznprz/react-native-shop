import { ApiResponse } from 'app/api/handlers';
import {
  addExpenseApi,
  deleteExpenseApi,
  Expense,
  ExpenseDetailResponse,
  findExpenseByDateRangeApi,
  getExpenseDescriptionsApi,
  initialExpenseDetailResponse,
} from 'app/api/services/expenseService';
import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

export const useExpenses = () => {
  // Get the restaurantId and userId from the Redux store
  const storedAuthData = useSelector((state: RootState) => state.auth.authData);
  const { restaurantId: storeRestaurantId = 0, userId: storedUserId = 0 } = storedAuthData || {};

  // local state
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetailResponse>(
    initialExpenseDetailResponse,
  );
  const [expenseDescription, setExpenseDescription] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const getExpenseDescriptionsMutation = useMutation<
    ApiResponse<string[]>,
    Error,
    { restaurantId: number }
  >({
    mutationFn: async ({ restaurantId }) => {
      const response: ApiResponse<string[]> = await getExpenseDescriptionsApi(restaurantId);
      if (response.status !== 'success') {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      setExpenseDescription(response.data || []);
    },
    onError: (err) => {
      setExpenseDescription([]);
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

  const getExpenseDescriptionsHandler = useCallback(() => {
    getExpenseDescriptionsMutation.mutate({ restaurantId: storeRestaurantId });
  }, [getExpenseDescriptionsMutation]);

  const filteredExpenseDetails = useMemo<ExpenseDetailResponse>(() => {
    // If searchTerm is empty/whitespace, return the original response
    if (!searchTerm.trim()) {
      return expenseDetails;
    }

    const lower = searchTerm.toLowerCase();
    const filteredExpenses: Expense[] = expenseDetails.expenses.filter((e) => {
      const description = e.description?.toLowerCase() || '';
      // You can add more fields here (e.g. e.userName) if you want to match on other props
      return description.includes(lower);
    });

    // Return a new ExpenseDetailResponse with only the `expenses` array replaced
    return {
      ...expenseDetails,
      expenses: filteredExpenses,
    };
  }, [expenseDetails, searchTerm]);

  return {
    expenseDetails: filteredExpenseDetails,
    expenseDescription,
    expenseScreenState: findExpenseByDateRangeMutation,
    addExpenseState: createExpenseMutation,
    deleteExpenseState: deleteExpenseMutation,
    getExpenseDescriptionsHandler,

    handleAddExpense,
    fetchExpense,
    handleDeleteExpense,

    //search
    searchTerm,
    setSearchTerm,
  };
};
