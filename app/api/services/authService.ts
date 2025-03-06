import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
 * Log in and store the JWT tokens.
 */
export const login = async (credentials: Credentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${config.tokenBaseURL}/auth/login`,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 10000,
      },
    );
    const authResponse = response.data;
    // Store tokens in AsyncStorage for later use
    await AsyncStorage.setItem('jwtToken', authResponse.accessToken);
    await AsyncStorage.setItem('refreshToken', authResponse.refreshToken);
    await AsyncStorage.setItem('restaurantId', authResponse.restaurantId.toString());
    await AsyncStorage.setItem('userId', authResponse.userId.toString());

    return authResponse;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieve the stored JWT access token.
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('jwtToken');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const getRestaurantId = async (): Promise<number> => {
  try {
    const restaurantId = await AsyncStorage.getItem('restaurantId');
    return restaurantId ? Number(restaurantId) || 0 : 0;
  } catch (error) {
    console.error('Error retrieving restaurantId:', error);
    return 0;
  }
};

export const getUserId = async (): Promise<number> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return userId ? Number(userId) || 0 : 0;
  } catch (error) {
    console.error('Error retrieving userId:', error);
    return 0;
  }
};
