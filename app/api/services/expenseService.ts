import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';

export interface IconMetadata {
  iconName: string;
  iconType: string;
  filledColor: string;
  bgColor: string;
}

export interface Expense {
  id: number;
  quantity: number;
  description: string;
  amount: number;
  expensesDate: string;
  restaurantName?: string;
  userName?: string;
  iconMetadataDetails?: IconMetadata;
  iconMetadata?: string;
}

export interface ExpenseDetailResponse {
  totalExpenses: number;
  todayExpenses: number;
  thisMonthExpenses: number;
  expenses: Expense[];
}

export const initialExpenseDetailResponse: ExpenseDetailResponse = {
  totalExpenses: 0,
  todayExpenses: 0,
  thisMonthExpenses: 0,
  expenses: [],
};

// Create Expense
export const addExpenseApi = async (
  restaurantId: number,
  userId: number,
  expense: Expense,
): Promise<ApiResponse<ExpenseDetailResponse>> => {
  const expenseRequest = {
    quantity: expense.quantity,
    description: expense.description,
    amount: expense.amount,
    expensesDate: expense.expensesDate,
  };
  return await apiMethods.post<ExpenseDetailResponse>(
    `/api/expenses/${restaurantId}/${userId}`,
    expenseRequest,
  );
};

export const findExpenseByDateRangeApi = async (
  date: string,
  restaurantId: number,
): Promise<ApiResponse<ExpenseDetailResponse>> => {
  return await apiMethods.get<ExpenseDetailResponse>(
    `/api/expenses/date/${restaurantId}?date=${date}`,
  );
};

export const deleteExpenseApi = async (id: number): Promise<ApiResponse<ExpenseDetailResponse>> => {
  return await apiMethods.delete<ExpenseDetailResponse>(`/api/expenses/${id}`);
};
