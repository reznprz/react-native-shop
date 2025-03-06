import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { login } from './authService';

export interface GetAllFoodsResponse {
  requestId: string | null;
  timeStamp: string | null;
  payload: Food[];
  success: boolean;
  message?: string;
}

export interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  touristPrice: number;
  img: string;
  calories: number;
  servingSize: string;
  categoryName: string;
  isKitchenFood: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  categoryNameTwo: string;
  categoryIcon: string;
}

// Fetch all foods
export const fetchAllFoods = async (): Promise<ApiResponse<Food[]>> => {
  await login({ username: 'ree', password: 'reeree' });
  const params: { searchType?: string; searchValue?: string } = {};
  params.searchType = 'ALL';
  params.searchValue = undefined;
  return await apiMethods.get<Food[]>('/api/food', { params: params });
};

// Fetch all Categories
export const fetchAllCategories = async (): Promise<ApiResponse<Category[]>> => {
  await login({ username: 'ree', password: 'reeree' });
  return await apiMethods.get<Category[]>('/api/food/categories');
};
