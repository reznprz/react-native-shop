import { Role } from 'app/security/role';
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
  accessLevel: Role;
  passcode: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
  avatarUrl?: string;
  restaurantId: number;
}

export const emptyUser: User = {
  avatarUrl: '',
  id: 0,
  accessLevel: Role.STAFF,
  passcode: '',
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  phoneNumber: '',
  email: '',
  restaurantId: 0,
};

export interface UserRegisterRequest extends RegisterRequest {
  accessLevel: Role;
}

export interface SuccessResponse {
  message: string;
  success: boolean;
}

export const createUserApi = async (
  restaurantId: number,
  newUser: UserRegisterRequest,
): Promise<ApiResponse<User[]>> => {
  return await apiMethods.post<User[]>(`/api/user/${restaurantId}`, newUser);
};

export const getUsersApi = async (restaurantId: number): Promise<ApiResponse<User[]>> => {
  return await apiMethods.get<User[]>(`/api/user/byRestaurant/${restaurantId}`);
};

export const updateUserApi = async (
  userId: number,
  updated: User,
  updateImageOnly: boolean,
): Promise<ApiResponse<User[]>> => {
  return await apiMethods.put<User[]>(
    `/api/user/${userId}?updateImageOnly=${updateImageOnly}`,
    updated,
  );
};

export const deleteUserApi = async (
  restaurantId: number,
  userId: number,
): Promise<ApiResponse<User[]>> => {
  return await apiMethods.delete<User[]>(`/api/user/${restaurantId}/${userId}`);
};

export { Role };
