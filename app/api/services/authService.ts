import axios from 'axios';
import { config } from 'app/config/config';
import { RegisterRequest, SuccessResponse } from './userService';

export interface Credentials {
  username: string;
  password: string;
}

export enum PlanType {
  STARTER = 'STARTER',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  NONE = 'NONE',
}

export enum ContactStatus {
  PRIMARY = 'PRIMARY',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum AccessLevel {
  ADMIN = 'ADMIN',
  USER = 'STAFF',
}

export enum FeatureKey {
  ENABLE_TOURIST_MENU = 'ENABLE_TOURIST_MENU',
}

export interface OtpRequest {
  target: string;
  channel: 'email' | 'sms';
}

export interface OtpValidateRequest {
  target: string;
  code: string;
}

export interface OtpValidate {
  target: string;
  code: string;
}

export interface OtpRequestResponse {
  message: string;
}

export interface OtpValidateResponse {
  verified: boolean;
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
export interface RestaurantEmail {
  id: number;
  email: string;
  status: ContactStatus;
}

export interface RestaurantPhone {
  id: number;
  phoneNumber: string;
  status: ContactStatus;
}

export interface RestaurantFeature {
  id: number;
  key: FeatureKey;
  enabled: boolean;
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
  initials: string;
  restaurantImgUrl: string;
  userAvatarUrl: string;
  features: RestaurantFeature[];
  subscriptionExpirationInfo: SubscriptionExpirationInfo;
}

/**
 * Log in and store the JWT tokens in AsyncStorage (if you want).
 * Then you also dispatch setAuthData(...) in Redux to keep them in store.
 */
export const login = async (credentials: Credentials): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${config.tokenBaseURL}/auth/login`,
    credentials,
    {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 10000,
    },
  );
  const authResponse = response.data;

  return authResponse;
};

export const refreshTokenApi = async (refreshToken: string): Promise<string> => {
  const response = await axios.post<{ accessToken: string }>(
    `${config.tokenBaseURL}/auth/refresh`,
    { token: refreshToken },
    {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 10000,
    },
  );
  return response.data.accessToken;
};

export const registerRestaurantApi = async (
  newRestaurantResgistration: RegisterRequest,
): Promise<SuccessResponse> => {
  const response = await axios.post<SuccessResponse>(
    `${config.tokenBaseURL}/auth/register`,
    newRestaurantResgistration,
    {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 10000,
    },
  );
  return response.data;
};

export const requesOtpApi = async (otpRequest: OtpRequest): Promise<OtpRequestResponse> => {
  const response = await axios.post<OtpRequestResponse>(
    `${config.tokenBaseURL}/otp/request`,
    otpRequest,
    {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 10000,
    },
  );
  const authResponse = response.data;

  return authResponse;
};

export const validateOtpApi = async (request: OtpValidateRequest): Promise<OtpValidateResponse> => {
  const response = await axios.post<OtpValidateResponse>(
    `${config.tokenBaseURL}/otp/validate`,
    request,
    {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 10000,
    },
  );
  const authResponse = response.data;

  return authResponse;
};
