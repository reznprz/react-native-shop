import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { Platform } from 'react-native';
import { guessMime } from '../handlers/apiHandler';

export type CrossFile =
  | File // web
  | { uri: string; name?: string; type?: string };

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
    // JSON-only
    return apiMethods.post<Food[]>(url, newFood);
  }

  // Multipart
  const fd = new FormData();

  if (Platform.OS === 'web') {
    // Send JSON part as application/json
    fd.append(
      'data',
      new Blob([JSON.stringify(newFood)], { type: 'application/json' }),
      'data.json',
    );

    if (file instanceof File) {
      fd.append('file', file);
    } else {
      const uri = (file as any).uri as string;
      const resp = await fetch(uri);
      const blob = await resp.blob();
      const name = (file as any).name || 'upload.jpg';
      const type = (file as any).type || blob.type || guessMime(name);
      const webFile = new File([blob], name, { type });
      fd.append('file', webFile);
    }
  } else {
    // React Native: JSON as string, file with real MIME
    fd.append('data', JSON.stringify(newFood));

    const name = (file as any).name || 'upload.jpg';
    const type = (file as any).type || guessMime(name);
    fd.append('file', {
      uri: (file as any).uri,
      name,
      type,
    } as any);
  }

  // Let axios set multipart boundary automatically
  return apiMethods.post<Food[]>(url, fd);
};

export const updateFoodApi = async (
  foodId: number,
  updatedFood: Food,
  file?: CrossFile,
): Promise<ApiResponse<Food[]>> => {
  const baseUrl = `/api/food/${foodId}`;

  // 1) No file: send JSON (application/json)
  if (!file) {
    return apiMethods.put<Food[]>(baseUrl, updatedFood);
  }

  // 2) With file: send multipart/form-data
  const fd = new FormData();

  if (Platform.OS === 'web') {
    // IMPORTANT: Make `data` a JSON Blob so the part has Content-Type: application/json
    const jsonBlob = new Blob([JSON.stringify(updatedFood)], {
      type: 'application/json',
    });
    fd.append('data', jsonBlob, 'data.json');

    // Normalize the file into a real File
    if (file instanceof File) {
      fd.append('file', file);
    } else {
      const uri = (file as any).uri as string;
      const resp = await fetch(uri);
      const blob = await resp.blob();
      const name = (file as any).name || 'upload';
      const type = (file as any).type || blob.type || guessMime(name);
      const webFile = new File([blob], name, { type });
      fd.append('file', webFile);
    }
  } else {
    // React Native: RN cannot set per-part content-type for text fields.
    // Append the JSON string; backend should accept @RequestPart("data") String as well.
    fd.append('data', JSON.stringify(updatedFood));

    // File part for RN
    const rnName = (file as any).name || 'upload';
    const rnType = (file as any).type || guessMime(rnName); // don't use 'multipart/form-data' here
    fd.append('file', {
      uri: (file as any).uri, // content:// or file://
      name: rnName,
      type: rnType,
    } as any);
  }

  // Don't set Content-Type; your HTTP client will add the correct boundary.
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
