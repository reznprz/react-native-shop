import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiStatus, ErrorStatus } from './index';
import { config } from 'app/config';

// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.baseURL, // Base URL from config
  timeout: 10000, // Timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Response handler middleware
export const responseHandler = <T>(response: AxiosResponse): ApiResponse<T> => {
  return {
    status: ApiStatus.SUCCESS,
    data: response.data,
    statusCode: response.status,
    message: response.statusText || 'Request succeeded',
  };
};

// Error handler middleware
export const errorHandler = <T>(error: any): ApiResponse<T> => {
  let status: ErrorStatus;
  let message: string;

  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status || 500;

    if (!error.response) {
      // Network-related errors
      status = ErrorStatus.NETWORK;
      message = 'Network Error: Please check your internet connection.';
    } else if (statusCode >= 500) {
      // Server-side errors (5xx)
      status = ErrorStatus.SERVER_ERROR;
      message = 'Internal Server Error: Please try again later.';
    } else if (statusCode >= 400) {
      // Client-side errors (4xx)
      status = ErrorStatus.CLIENT_ERROR;
      message = error.response?.data?.message || 'An error occurred.';
    } else {
      // Unexpected status code
      status = ErrorStatus.UNKNOWN_ERROR;
      message = 'An unexpected error occurred.';
    }

    return {
      status: ApiStatus.ERROR,
      data: null,
      statusCode,
      message,
    };
  }

  // Fallback for non-Axios errors
  return {
    status: ApiStatus.ERROR,
    data: null,
    statusCode: 500,
    message: 'Unexpected Error: Something went wrong.',
  };
};

export default axiosInstance;
