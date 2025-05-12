import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiStatus, ErrorStatus } from './index';
import { config } from 'app/config/config';

/**
 * A concurrency guard to avoid multiple simultaneous refresh calls.
 * If a refresh call is ongoing, other requests will await it.
 */
let refreshInProgress: Promise<string | null> | null = null;

// Create an Axios instance with default settings
const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.apiBaseURL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// /**
//  * REQUEST INTERCEPTOR
//  *
//  * 1) Reads authData from Redux (accessToken, refreshToken, user details).
//  * 2) Checks if `accessToken` is expired. If so, tries to refresh it BEFORE sending request.
//  * 3) Attaches up-to-date tokens & user info (e.g. restaurantId) as headers.
//  */
// axiosInstance.interceptors.request.use(
//   async (requestConfig) => {
//     try {
//       const state = store.getState();
//       const authData = state.auth?.authData;

//       if (!authData || !requestConfig.headers) {
//         // If no auth data or no headers object to modify, just return config as is
//         return requestConfig;
//       }

//       const { accessToken, refreshToken, restaurantName, restaurantId, userId } = authData;

//       // Attach extra info in headers
//       requestConfig.headers['X-Restaurant-Name'] = restaurantName;
//       requestConfig.headers['X-Restaurant-Id'] = String(restaurantId);
//       requestConfig.headers['X-User-Id'] = String(userId);

//       // If there's an access token, check expiration
//       if (accessToken) {
//         const expired = isTokenExpired(accessToken);

//         if (expired) {
//           // If token is expired, try to refresh
//           if (!refreshToken) {
//             // No refresh token => forced logout
//             store.dispatch(clearAuthData());
//             return Promise.reject(new Error('No refresh token available.'));
//           }

//           // If a refresh is already in progress, wait for it
//           if (refreshInProgress) {
//             const newToken = await refreshInProgress; // awaits the ongoing refresh
//             if (!newToken) throw new Error('Failed to refresh token.');
//             // Attach the new token to the request
//             requestConfig.headers.Authorization = `Bearer ${newToken}`;
//             return requestConfig;
//           }

//           // Otherwise, start a new refresh
//           refreshInProgress = (async () => {
//             try {
//               const newAccessToken = await refreshTokenApi(refreshToken);
//               store.dispatch(updateAccessToken(newAccessToken));
//               return newAccessToken;
//             } catch (err) {
//               store.dispatch(clearAuthData());
//               return null; // or rethrow, depending on your logic
//             } finally {
//               refreshInProgress = null;
//             }
//           })();

//           // Wait for refresh to complete
//           const freshToken = await refreshInProgress;
//           if (!freshToken) throw new Error('Refresh token request failed.');

//           // Attach newly refreshed token
//           requestConfig.headers.Authorization = `Bearer ${freshToken}`;
//           return requestConfig;
//         } else {
//           // If token isn't expired, just attach it
//           requestConfig.headers.Authorization = `Bearer ${accessToken}`;
//         }
//       }

//       return requestConfig;
//     } catch (error) {
//       console.error('Request interceptor error:', error);
//       // If something goes wrong in the interceptor logic, reject the request
//       return Promise.reject(error);
//     }
//   },
//   (error) => {
//     // Catch any error that occurs before request is made
//     console.error('Request interceptor error (outer):', error);
//     return Promise.reject(error);
//   },
// );

// /**
//  * RESPONSE INTERCEPTOR
//  *
//  * - As a fallback, if the server returns 401, we clear auth data (or you could attempt refresh).
//  * - Typically, we rely on the "pre-check" in the request interceptor, but
//  *   if the server forcibly invalidates the token, we handle it here.
//  */
// axiosInstance.interceptors.response.use(
//   // Pass through successful responses
//   (response) => response,

//   // Handle error responses
//   async (error) => {
//     const { response, config: originalRequest } = error;

//     // If there's no response or it's not 401, just reject
//     if (!response || response.status !== 401) {
//       return Promise.reject(error);
//     }

//     // Optionally check if we already retried once
//     if (!originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Attempt to refresh if we have a valid refresh token
//         const state = store.getState();
//         const refreshToken = state.auth?.authData?.refreshToken;
//         if (!refreshToken) {
//           // No refresh token => log out
//           store.dispatch(clearAuthData());
//           return Promise.reject(error);
//         }

//         // Refresh the token
//         const newAccessToken = await refreshTokenApi(refreshToken);
//         // Update Redux
//         store.dispatch(updateAccessToken(newAccessToken));

//         // Attach new token & retry the request
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // If the refresh also fails => log out
//         store.dispatch(clearAuthData());
//         return Promise.reject(refreshError);
//       }
//     } else {
//       // If we've already retried or there's some other issue, log out
//       store.dispatch(clearAuthData());
//       return Promise.reject(error);
//     }
//   },
// );

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
  let apiError: string;
  let statusCode: number = 500;

  if (axios.isAxiosError(error)) {
    statusCode = error.response?.status || 500;
    apiError = error.message || 'Internal Server Error: Please try again later';

    if (!error.response) {
      // Network error (e.g., no internet connection)
      status = ErrorStatus.NETWORK;
      message = 'Network Error: Please check your internet connection.';
    } else if (statusCode >= 500) {
      // Server error (5xx)
      status = ErrorStatus.SERVER_ERROR;
      message = apiError;
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
