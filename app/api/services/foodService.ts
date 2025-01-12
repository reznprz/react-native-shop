import apiMethods from "app/api/handlers/apiMethod";
import { ApiResponse } from "app/api/handlers/index";

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
  authorId: number | null;
  description: string | null;
  price: number;
  categoryId: number | null;
  categoryName: string | null;
  categoryNameTwo: string | null;
  img: string | null;
  ingredients: string | null;
  calories: number | null;
  servingSize: string | null;
  priceTwo: number;
}

// Fetch all foods
export const fetchAllFoods = async (): Promise<
  ApiResponse<GetAllFoodsResponse>
> => {
  return await apiMethods.get<GetAllFoodsResponse>("/api/foods/v2");
};
