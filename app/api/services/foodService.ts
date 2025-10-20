import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { Platform } from 'react-native';

type CrossFile = File | { uri: string; name: string; type: string };

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
  file?: CrossFile,
): Promise<ApiResponse<Food[]>> => {
  const url = `/api/food/${restaurantId}?categoryId=${categoryId}`;
  if (!file) {
    return apiMethods.post<Food[]>(url, newFood); // Axios will set application/json
  }

  const fd = new FormData();
  fd.append('data', JSON.stringify(newFood));

  if (Platform.OS === 'web') {
    const maybeUri = (file as any).uri as string | undefined;
    if (maybeUri?.startsWith?.('blob:')) {
      const res = await fetch(maybeUri);
      const blob = await res.blob();
      const webFile = new File(
        [blob],
        (file as any).name || 'upload.jpg',
        { type: (file as any).type || blob.type || 'application/octet-stream' }
      );
      fd.append('file', webFile);
    } else if (file instanceof File) {
      fd.append('file', file);
    } else {
      const res = await fetch((file as any).uri);
      const blob = await res.blob();
      const webFile = new File(
        [blob],
        (file as any).name || 'upload.jpg',
        { type: (file as any).type || blob.type || 'application/octet-stream' }
      );
      fd.append('file', webFile);
    }
  } else {
    // React Native
    fd.append('file', {
      uri: (file as any).uri,                        // content:// or file://
      name: (file as any).name || 'upload.jpg',
      type: (file as any).type || 'application/octet-stream',
    } as any);
  }

  // IMPORTANT: do NOT set Content-Type; Axios adds multipart boundary
  return apiMethods.post<Food[]>(url, fd);
};

export const updateFoodApi = async (
  foodId: number,
  updatedFood: Food,
  file?: CrossFile,
): Promise<ApiResponse<Food[]>> => {
  const baseUrl = `/api/food/${foodId}`;

  // If no file: send plain JSON via PUT
  if (!file) {
    return apiMethods.put<Food[]>(baseUrl, updatedFood); // Axios will set application/json
  }

  // Else: build FormData and POST (multipart)
  const fd = new FormData();
  fd.append('data', JSON.stringify(updatedFood));

  if (Platform.OS === 'web') {
    const maybeUri = (file as any).uri as string | undefined;
    if (maybeUri?.startsWith?.('blob:')) {
      const res = await fetch(maybeUri);
      const blob = await res.blob();
      const webFile = new File(
        [blob],
        (file as any).name || 'upload.jpg',
        { type: (file as any).type || blob.type || 'application/octet-stream' }
      );
      fd.append('file', webFile);
    } else if (file instanceof File) {
      fd.append('file', file);
    } else {
      const res = await fetch((file as any).uri);
      const blob = await res.blob();
      const webFile = new File(
        [blob],
        (file as any).name || 'upload.jpg',
        { type: (file as any).type || blob.type || 'application/octet-stream' }
      );
      fd.append('file', webFile);
    }
  } else {
    // React Native
    fd.append('file', {
      uri: (file as any).uri,                        // content:// or file://
      name: (file as any).name || 'upload.jpg',
      type: (file as any).type || 'application/octet-stream',
    } as any);
  }

  // IMPORTANT: do NOT set Content-Type; Axios adds multipart boundary
  return apiMethods.put<Food[]>(baseUrl, fd);
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
