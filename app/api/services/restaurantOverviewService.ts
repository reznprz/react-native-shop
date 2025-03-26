import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { login } from './authService';
import { Expense, IconMetadata } from './expenseService';
import { OrderDetails } from './orderService';
import { DateRangeSelection } from 'app/components/DateRangePickerModal';
import qs from 'qs';

export interface PaymentDistribution {
  method: string;
  amount: number;
  percentage: number;
  qrPaymentsDetails?: PaymentDistribution[];
}

export interface DailySalesTransaction {
  id: number;
  openingCash: number;
  expenses: number;
  totalSales: number;
  cash: number;
  qr: number;
  closingCash: number;
  unPaid: number;
  date: string;
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

export interface DailySalesDetails {
  dailySalesTransaction: DailySalesTransaction;
  totalOverallSales: number;
  thisMonth: number;
  paymentMethodDistribution: PaymentDistribution[];
}

export const initializeRestaurantOverview = (): RestaurantOverview => ({
  totalSales: 0,
  totalNoOrders: 0,
  totalExpenses: 0,
  activeTables: 0,

  paymentMethodDistribution: [],
  expense: [],

  dailySalesTransaction: {
    id: 0,
    openingCash: 0,
    expenses: 0,
    totalSales: 0,
    cash: 0,
    closingCash: 0,
    unPaid: 0,
    qr: 0,
    date: '',
  },

  inventoryStatus: [],
  topSellingProducts: [],
  recentTransactions: [],
});

export const initialDailySalesDetails: DailySalesDetails = {
  dailySalesTransaction: {
    id: 0,
    openingCash: 0,
    expenses: 0,
    totalSales: 0,
    cash: 0,
    closingCash: 0,
    unPaid: 0,
    qr: 0,
    date: '',
  },
  totalOverallSales: 0,
  thisMonth: 0,
  paymentMethodDistribution: [],
};

export const getRestaurantOverviewApi = async (
  restaurantId: number,
): Promise<ApiResponse<RestaurantOverview>> => {
  await login({ username: 'ree', password: 'reeree' });

  return await apiMethods.get<RestaurantOverview>(`/api/overview/${restaurantId}`);
};

export const getDailySalesApi = async (
  restaurantId: number,
  date: DateRangeSelection,
): Promise<ApiResponse<DailySalesDetails>> => {
  await login({ username: 'ree', password: 'reeree' });

  const queryParams: Record<string, any> = {};

  queryParams.selectionType = date.selectionType;

  if (date.selectionType === 'QUICK_RANGE') {
    queryParams.quickRangeLabel = date.quickRange.label;
    if (date.quickRange.unit) {
      queryParams.quickRangeUnit = date.quickRange.unit; // "minutes" or "days"
    }
    if (date.quickRange.value !== undefined) {
      queryParams.quickRangeValue = date.quickRange.value; // e.g. 15
    }
  }
  if (date.selectionType === 'SINGLE_DATE' && date.date) {
    queryParams.singleDate = date.date;
  }

  if (date.selectionType === 'DATE_RANGE' && date.startDate && date.endDate) {
    queryParams.startDate = date.startDate;
    queryParams.endDate = date.endDate;
  }

  return await apiMethods.get<DailySalesDetails>(`/api/overview/dailySales/${restaurantId}`, {
    params: queryParams,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  });
};

export const updateDailySalesApi = async (
  restaurantId: number,
  dailySalesTransaction: DailySalesTransaction,
): Promise<ApiResponse<DailySalesDetails>> => {
  await login({ username: 'ree', password: 'reeree' });

  const payload = {
    id: dailySalesTransaction.id,
    openingCash: dailySalesTransaction.openingCash,
    expenses: dailySalesTransaction.expenses,
    totalSales: dailySalesTransaction.totalSales,
    cash: dailySalesTransaction.cash,
    closingCash: dailySalesTransaction.closingCash,
    unPaid: dailySalesTransaction.unPaid,
    qr: dailySalesTransaction.qr,
    date: dailySalesTransaction.date,
  };

  return await apiMethods.put<DailySalesDetails>(
    `/api/overview/dailySales/${restaurantId}/${dailySalesTransaction.id}`,
    payload,
  );
};
