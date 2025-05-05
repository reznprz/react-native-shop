import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';

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
): Promise<ApiResponse<Food[]>> => {
  return await apiMethods.post<Food[]>(`/api/food/${restaurantId}?categoryId=${categoryId}`, {
    newFood,
  });
};

export const updateFoodApi = async (
  foodId: number,
  updatedFood: Food,
): Promise<ApiResponse<Food[]>> => {
  return await apiMethods.put<Food[]>(`/api/food/${foodId}`, { updatedFood });
};

export const deleteFoodApi = async (foodId: number): Promise<ApiResponse<Food[]>> => {
  return await apiMethods.delete<Food[]>(`/api/food/${foodId}`);
};

export const addCategoriesApi = async (
  restaurantId: number,
  newCategory: Category,
): Promise<ApiResponse<Category[]>> => {
  return await apiMethods.post<Category[]>(`/api/food/categories/${restaurantId}`, { newCategory });
};

export const deleteCategoryApi = async (
  restaurantId: number,
  categoryId: number,
): Promise<ApiResponse<Category[]>> => {
  return await apiMethods.delete<Category[]>(`/api/food/categories/${restaurantId}/${categoryId}`);
};
