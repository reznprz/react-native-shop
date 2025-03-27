import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';

export enum AccessLevel {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export enum PlanType {
  STARTER = 'STARTER',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
}

export interface SubscriptionExpirationInfo {
  planType: PlanType;
  remainingDays: number;
  remainingHours: number;
  remainingMinutes: number;
  remainingSeconds: number;
  expirationBannerMessage: string;
  subscriptionExpired: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  restaurantName: string;
  restaurantId: number;
  accessLevel: AccessLevel;
  userId: number;
  userName: string;
  userFirstName: string;
  userLastName: string;
  subscriptionExpirationInfo: SubscriptionExpirationInfo;
}

export const loginApi = async (): Promise<ApiResponse<AuthResponse>> => {
  return await apiMethods.post<AuthResponse>('/api/food/categories', {});
};
