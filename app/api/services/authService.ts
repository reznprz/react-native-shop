import axios from 'axios';
import Constants from 'expo-constants';
import { Dimensions, Platform } from 'react-native';
import { Role } from 'app/security/role';
import { RegisterRequest } from './userService';
import { ThemeVariant } from 'app/theme/theme';
import { config } from 'app/config/config';

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
  accessLevel: Role;
  userId: number;
  userName: string;
  userFirstName: string;
  userLastName: string;
  initials: string;
  restaurantImgUrl: string;
  userAvatarUrl: string;
  themeVariant: ThemeVariant;
  features: RestaurantFeature[];
  subscriptionExpirationInfo: SubscriptionExpirationInfo;
}

export interface CreateRestaurantRequest {
  restaurantName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  themeVariant: ThemeVariant;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}

const getPlatformHeader = (): string => {
  switch (Platform.OS) {
    case 'web':
      return 'WEB';
    case 'android':
      return 'ANDROID';
    case 'ios':
      return 'IOS';
    default:
      return 'UNKNOWN';
  }
};

const getDeviceTypeHeader = (): string => {
  const { width } = Dimensions.get('window');

  if (Platform.OS === 'web') {
    return width >= 1024 ? 'DESKTOP' : width >= 768 ? 'TABLET' : 'MOBILE';
  }

  return width >= 768 ? 'TABLET' : 'MOBILE';
};

const getAppVersionHeader = (): string => {
  return (
    Constants.expoConfig?.version || Constants.manifest2?.extra?.expoClient?.version || 'UNKNOWN'
  );
};

/**
 * Log in and return auth response.
 */
export const login = async (credentials: Credentials): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${config.tokenBaseURL}/auth/login`,
    credentials,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Platform': getPlatformHeader(),
        'X-Device-Type': getDeviceTypeHeader(),
        'X-App-Version': getAppVersionHeader(),
      },
      timeout: 10000,
    },
  );

  return response.data;
};

export const createNewRestaurantApi = async (
  payload: CreateRestaurantRequest,
): Promise<SuccessResponse> => {
  const response = await axios.post<SuccessResponse>(
    `${config.tokenBaseURL}/auth/register`,
    payload,
    {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 10000,
    },
  );
  return response.data;
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
  return response.data;
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
  return response.data;
};
