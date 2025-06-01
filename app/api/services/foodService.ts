import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { IconMetadata } from './expenseService';
import { Platform } from 'react-native';

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

export interface FoodMenuResponse {
  foods: Food[];
  topBreakFast: Food[];
  topLunch: Food[];
  topDrinks: Food[];
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  categoryNameTwo: string;
  categoryIcon: string;
}

export const fetchAllFoodsApi = async (restaurantId: number): Promise<ApiResponse<Food[]>> => {
  const params: { searchType?: string; searchValue?: string } = {};
  params.searchType = 'ALL';
  params.searchValue = undefined;
  return await apiMethods.get<Food[]>(`/api/food/${restaurantId}`, { params: params });
};

export const fetchFoodMenuApi = async (
  restaurantId: number,
): Promise<ApiResponse<FoodMenuResponse>> => {
  return await apiMethods.get<FoodMenuResponse>(`/api/food/menu/${restaurantId}`);
};

export const fetchAllCategoriesApi = async (
  restaurantId: number,
): Promise<ApiResponse<Category[]>> => {
  return await apiMethods.get<Category[]>(`/api/food/categories/${restaurantId}`);
};

export const addFoodApi = async (
  restaurantId: number,
  categoryId: number,
  newFood: Food,
  file?: { uri: string; name: string; type: string } | File,
): Promise<ApiResponse<Food[]>> => {
  const url = `/api/food/${restaurantId}?categoryId=${categoryId}`;
  const fd = new FormData();
  const json = JSON.stringify(newFood);

  if (Platform.OS === 'web') {
    fd.append('data', new Blob([json], { type: 'application/json' }));
  } else {
    fd.append('data', {
      string: json, // RN key name is literally "string"
      name: 'data', // any filename; Spring ignores it
      type: 'application/json',
    } as any);
  }

  if (file) fd.append('file', file as any);

  return await apiMethods.post<Food[]>(url, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateFoodApi = async (
  foodId: number,
  updatedFood: Food,
  file?: { uri: string; name: string; type: string } | File,
): Promise<ApiResponse<Food[]>> => {
  const url = `/api/food/${foodId}`;
  const fd = new FormData();
  const json = JSON.stringify(updatedFood);

  if (Platform.OS === 'web') {
    fd.append('data', new Blob([json], { type: 'application/json' }));
  } else {
    fd.append('data', {
      string: json, // RN key name is literally "string"
      name: 'data', // any filename; Spring ignores it
      type: 'application/json',
    } as any);
  }

  if (file) fd.append('file', file as any);

  return await apiMethods.put<Food[]>(url, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteFoodApi = async (foodId: number): Promise<ApiResponse<Food[]>> => {
  return await apiMethods.delete<Food[]>(`/api/food/${foodId}`);
};

export const addCategoriesApi = async (
  restaurantId: number,
  newCategory: Category,
): Promise<ApiResponse<Category[]>> => {
  return await apiMethods.post<Category[]>(`/api/food/categories/${restaurantId}`, newCategory);
};

export const updateCategoriesApi = async (
  updatedCategory: Category,
): Promise<ApiResponse<Category[]>> => {
  return await apiMethods.put<Category[]>(`/api/food/categories`, updatedCategory);
};

export const deleteCategoryApi = async (
  restaurantId: number,
  categoryId: number,
): Promise<ApiResponse<Category[]>> => {
  return await apiMethods.delete<Category[]>(`/api/food/categories/${restaurantId}/${categoryId}`);
};
