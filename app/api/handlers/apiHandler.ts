import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiStatus, ErrorStatus } from './index';
import { config } from 'app/config';
import { getToken } from 'app/api/services/authService';

// Create an Axios instance with default settings
const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.apiBaseURL, // Base API URL from config
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor - Attaches JWT token to each request
 */
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error attaching token:', error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error),
);

/**
 * Response Handler - Standardizes API responses
 */
export const responseHandler = <T>(response: AxiosResponse): ApiResponse<T> => {
  return {
    status: ApiStatus.SUCCESS,
    data: response.data,
    statusCode: response.status,
    message: response.statusText || 'Request succeeded',
  };
};

/**
 * Error Handler - Handles API errors and categorizes them
 */
export const errorHandler = <T>(error: any): ApiResponse<T> => {
  let status: ErrorStatus;
  let message: string;
  let statusCode: number = 500;

  if (axios.isAxiosError(error)) {
    statusCode = error.response?.status || 500;

    if (!error.response) {
      // Network error (e.g., no internet connection)
      status = ErrorStatus.NETWORK;
      message = 'Network Error: Please check your internet connection.';
    } else if (statusCode >= 500) {
      // Server error (5xx)
      status = ErrorStatus.SERVER_ERROR;
      message = 'Internal Server Error: Please try again later.';
    } else if (statusCode >= 400) {
      // Client-side error (4xx)
      status = ErrorStatus.CLIENT_ERROR;
      message = error.response.data?.message || 'An error occurred.';
    } else {
      // Unexpected error
      status = ErrorStatus.UNKNOWN_ERROR;
      message = 'An unexpected error occurred.';
    }
  } else {
    // Non-Axios errors
    status = ErrorStatus.UNKNOWN_ERROR;
    message = error.message || 'Unexpected Error: Something went wrong.';
  }

  return {
    status: ApiStatus.ERROR,
    data: null,
    statusCode,
    message,
  };
};

export default axiosInstance;
