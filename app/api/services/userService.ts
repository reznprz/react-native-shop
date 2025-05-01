import { AccessLevel } from './authService';
import { ApiResponse } from '../handlers';
import apiMethods from '../handlers/apiMethod';

export interface RegisterRequest {
  restaurantName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: number;
  accessLevel: AccessLevel;
  passcode: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
  restaurantId: number;
}

export interface UserRegisterRequest extends RegisterRequest {
  accessLevel: AccessLevel;
}

export interface SuccessResponse {
  message: string;
  success: boolean;
}

export const createUser = async (
  restaurantId: number,
  newUser: UserRegisterRequest,
): Promise<ApiResponse<SuccessResponse>> => {
  return await apiMethods.post<SuccessResponse>(`/api/user/${restaurantId}`, newUser);
};

export const getUsers = async (restaurantId: number): Promise<ApiResponse<User[]>> => {
  return await apiMethods.get<User[]>(`/api/user/byRestaurant/${restaurantId}`);
};
export { AccessLevel };
