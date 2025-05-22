import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from 'axios';
import { Alert } from 'react-native';
import { store } from 'app/redux/store';
import { updateAccessToken, clearAuthData } from 'app/redux/authSlice';
import { refreshTokenApi } from '../services/authService';
import { isTokenExpired } from './decodeJWT';
import { AppConfig } from 'app/config/config';

// Extend Axios config to track retry state
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let queue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

function processQueue(error: any, token: string | null = null) {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token!)));
  queue = [];
}

/**
 * Configures API interceptors on the provided Axios instance.
 * - Logs requests/responses and payloads.
 * - Refreshes expired access tokens before requests.
 * - Retries on 401/403 with token refresh fallback.
 * - Alerts on failures and forces logout.
 */
export function setupApiInterceptors(api: AxiosInstance, appConfig: AppConfig) {
  // REQUEST interceptor
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const reqConfig = config;
      const method = reqConfig.method?.toUpperCase() ?? 'GET';
      const url = reqConfig.url ?? '';
      if (appConfig.debug) {
        console.log(`📤 [Request] ${method} ${url}`);
        console.log('🔍 [Request Payload]', reqConfig.data ?? {});
      }

      const { accessToken, refreshToken, restaurantName, restaurantId, userId } =
        store.getState().auth.authData ?? {};
      let tokenToUse = accessToken;

      if (accessToken && isTokenExpired(accessToken)) {
        if (appConfig.debug) {
          console.warn('⚠️ [Auth] Access token expired, refreshing...');
        }
        if (!refreshToken) {
          if (appConfig.debug) {
            console.error('❌ [Auth] No refresh token available');
          }
          Alert.alert('Session Expired', 'Please log in again.');
          store.dispatch(clearAuthData());
          return Promise.reject(new Error('No refresh token'));
        }
        if (isRefreshing) {
          try {
            tokenToUse = await new Promise<string>((resolve, reject) =>
              queue.push({ resolve, reject }),
            );
          } catch (e) {
            if (appConfig.debug) {
              console.error('❌ [Auth] Token refresh in queue failed', e);
            }
            Alert.alert('Session Error', 'Could not refresh session.');
            store.dispatch(clearAuthData());
            return Promise.reject(e);
          }
        } else {
          isRefreshing = true;
          try {
            if (appConfig.debug) {
              console.log('🔄 [Auth] Requesting new access token via refresh token');
            }
            const newToken = await refreshTokenApi(refreshToken);
            store.dispatch(updateAccessToken(newToken));
            if (appConfig.debug) {
              console.log('✅ [Auth] Token refreshed');
            }
            processQueue(null, newToken);
            tokenToUse = newToken;
          } catch (err) {
            if (appConfig.debug) {
              console.error('❌ [Auth] Token refresh failed', err);
            }
            processQueue(err, null);
            Alert.alert('Session Error', 'Failed to refresh session.');
            store.dispatch(clearAuthData());
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }
      }

      reqConfig.headers = AxiosHeaders.from({
        ...(reqConfig.headers as Record<string, string>),
        ...(tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {}),
        ...(restaurantName ? { 'X-Restaurant-Name': restaurantName } : {}),
        ...(restaurantId ? { 'X-Restaurant-Id': String(restaurantId) } : {}),
        ...(userId ? { 'X-User-Id': String(userId) } : {}),
      });
      return reqConfig;
    },
    (error: any) => {
      if (appConfig.debug) {
        console.error('❌ [Request Error]', error);
      }
      Alert.alert('Network Error', 'Failed to send request.');
      return Promise.reject(error);
    },
  );

  // RESPONSE interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      const method = response.config.method?.toUpperCase() ?? 'GET';
      const url = response.config.url ?? '';
      if (appConfig.debug) {
        console.log(`📥 [Response] ${method} ${url} → ${response.status}`);
        console.log('📦 [Response Payload]', response.data);
      }

      return response;
    },
    async (error: AxiosError & { config?: CustomAxiosRequestConfig }) => {
      const originalConfig = error.config as CustomAxiosRequestConfig;
      const method = originalConfig.method?.toUpperCase() ?? 'GET';
      const url = originalConfig.url ?? '';
      if (appConfig.debug) {
        console.error(
          `❌ [Error] ${method} ${url} → ${error.response?.status}`,
          error.response?.data,
        );
      }

      const status = error.response?.status;
      if ((status === 401 || status === 403) && !originalConfig._retry) {
        originalConfig._retry = true;
        const { refreshToken } = store.getState().auth.authData ?? {};
        if (!refreshToken) {
          if (appConfig.debug) {
            console.error('❌ [Auth] No refresh token for retry');
          }
          Alert.alert('Unauthorized', 'Please log in again.');
          store.dispatch(clearAuthData());
          return Promise.reject(error);
        }
        if (isRefreshing) {
          try {
            const token = await new Promise<string>((resolve, reject) =>
              queue.push({ resolve, reject }),
            );
            originalConfig.headers = AxiosHeaders.from({
              ...(originalConfig.headers as Record<string, string>),
              Authorization: `Bearer ${token}`,
            });
            return api(originalConfig);
          } catch (e) {
            if (appConfig.debug) {
              console.error('❌ [Auth] Queue retry failed', e);
            }
            return Promise.reject(e);
          }
        }
        isRefreshing = true;
        try {
          if (appConfig.debug) {
            console.log('🔄 [Auth] Refreshing token on 401/403');
          }
          const newToken = await refreshTokenApi(refreshToken);
          store.dispatch(updateAccessToken(newToken));
          processQueue(null, newToken);
          originalConfig.headers = AxiosHeaders.from({
            ...(originalConfig.headers as Record<string, string>),
            Authorization: `Bearer ${newToken}`,
          });
          return api(originalConfig);
        } catch (err) {
          if (appConfig.debug) {
            console.error('❌ [Auth] Refresh on error failed', err);
          }
          processQueue(err, null);
          Alert.alert('Session Error', 'Failed to refresh session.');
          store.dispatch(clearAuthData());
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      Alert.alert('Error', error.message || 'An error occurred.');
      return Promise.reject(error);
    },
  );
}
