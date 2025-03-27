import axios from 'axios';
import { config } from 'app/config';

export interface Credentials {
  username: string;
  password: string;
}

export enum PlanType {
  STARTER = 'STARTER',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
}

export enum AccessLevel {
  ADMIN = 'ADMIN',
  USER = 'STAFF',
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
