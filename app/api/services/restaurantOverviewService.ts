import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { login } from './authService';
import { Expense, IconMetadata } from './expenseService';
import { OrderDetails } from './orderService';

export interface PaymentDistribution {
  method: string;
  percentage: number;
}

export interface DailySalesTransaction {
  openingCash: number; // BigDecimal equivalent
  expenses: number;
  totalSales: number;
}

export interface InventoryStatus {
  name: string;
  percentage: number;
  status: string;
}

export interface TopSellingProduct {
  name: string;
  totalSales: number;
  iconMetadata: IconMetadata;
  totalNoSold: number;
}

export interface RestaurantOverview {
  totalSales: number; // BigDecimal equivalent
  totalNoOrders: number;
  totalExpenses: number;
  activeTables: number;

  paymentMethodDistribution: PaymentDistribution[];
  expense: Expense[];

  dailySalesTransaction: DailySalesTransaction;

  inventoryStatus: InventoryStatus[];

  topSellingProducts: TopSellingProduct[];

  recentTransactions: OrderDetails[];
}

export const initializeRestaurantOverview = (): RestaurantOverview => ({
  totalSales: 0,
  totalNoOrders: 0,
  totalExpenses: 0,
  activeTables: 0,

  paymentMethodDistribution: [],
  expense: [],

  dailySalesTransaction: {
    openingCash: 0,
    expenses: 0,
    totalSales: 0,
  },

  inventoryStatus: [],
  topSellingProducts: [],
  recentTransactions: [],
});

export const getRestaurantOverviewApi = async (
  restaurantId: number,
): Promise<ApiResponse<RestaurantOverview>> => {
  await login({ username: 'ree', password: 'reeree' });

  return await apiMethods.get<RestaurantOverview>(`/api/overview/${restaurantId}`);
};
