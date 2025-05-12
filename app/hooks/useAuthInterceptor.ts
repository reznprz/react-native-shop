// src/hooks/useAuthInterceptor.tsx

import React, { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axiosInstance from 'app/api/handlers/apiHandler';
import { refreshTokenApi } from 'app/api/services/authService';
import { updateAccessToken, clearAuthData } from 'app/redux/authSlice';
import { RootState } from 'app/redux/store';
import { isTokenExpired } from 'app/api/handlers/decodeJWT';

interface AxiosConfigWithMeta extends InternalAxiosRequestConfig {
  metadata?: { startTime: number };
  _retry?: boolean;
}

/** Single-flight refresh helper to avoid concurrent refresh calls */
function useSingleRefresh() {
  const promiseRef = useRef<Promise<string | null> | null>(null);

  return useCallback((fn: () => Promise<string | null>) => {
    if (!promiseRef.current) {
      promiseRef.current = (async () => {
        try {
          return await fn();
        } finally {
          promiseRef.current = null;
        }
      })();
    }
    return promiseRef.current;
  }, []);
}

export function useAuthInterceptor() {
  const dispatch = useDispatch();
  const authData = useSelector((s: RootState) => s.auth.authData);
  const singleRefresh = useSingleRefresh();
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);

  // Keep track of previous AppState to schedule auto-logout
  const prevAppState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (prevAppState.current === 'active' && nextState !== 'active') {
        // schedule auto-logout in 1 minute
        if (logoutTimer.current) clearTimeout(logoutTimer.current);
        logoutTimer.current = setTimeout(() => {
          console.log('Auto-logout triggered');
          dispatch(clearAuthData());
        }, 60 * 1000);
      }

      if (nextState === 'active' && logoutTimer.current) {
        clearTimeout(logoutTimer.current);
        logoutTimer.current = null;
      }

      prevAppState.current = nextState;
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      sub.remove();
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [dispatch]);

  useEffect(() => {
    // REQUEST interceptor
    const reqId = axiosInstance.interceptors.request.use(
      async (origConfig: AxiosConfigWithMeta) => {
        const config = origConfig;
        // attach timing metadata
        config.metadata = { startTime: Date.now() };

        // --- existing auth/header logic ---
        if (authData && config.headers) {
          const { accessToken, refreshToken, restaurantName, restaurantId, userId } = authData;
          config.headers['X-Restaurant-Name'] = restaurantName;
          config.headers['X-Restaurant-Id'] = String(restaurantId);
          config.headers['X-User-Id'] = String(userId);

          if (accessToken) {
            if (isTokenExpired(accessToken)) {
              if (!refreshToken) {
                dispatch(clearAuthData());
                throw new Error('No refresh token');
              }
              const fresh = await singleRefresh(() => refreshTokenApi(refreshToken));
              if (!fresh) {
                dispatch(clearAuthData());
                throw new Error('Refresh failed');
              }
              dispatch(updateAccessToken(fresh));
              config.headers.Authorization = `Bearer ${fresh}`;
            } else {
              config.headers.Authorization = `Bearer ${accessToken}`;
            }
          }
        }

        // --- logging request (without token) ---
        const method = (config.method ?? 'GET').toUpperCase();
        console.log(`[Request] ${method} ${config.url}`, config.data ?? '<no payload>');

        return config;
      },
      (err) => Promise.reject(err),
    );

    // RESPONSE interceptor
    const resId = axiosInstance.interceptors.response.use(
      (res: AxiosResponse) => {
        const config = res.config as AxiosConfigWithMeta;
        const duration = config.metadata ? Date.now() - config.metadata.startTime : NaN;
        const method = (config.method ?? 'GET').toUpperCase();
        console.log(`[Response] ${method} ${config.url} → ${res.status} (${duration}ms)`, res.data);
        return res;
      },
      async (error) => {
        const config = (error.config ?? {}) as AxiosConfigWithMeta;
        const duration = config.metadata ? Date.now() - config.metadata.startTime : NaN;
        const method = (config.method ?? 'GET').toUpperCase();

        if (error.response) {
          // HTTP error
          console.warn(
            `[Response Error] ${method} ${config.url} → ${error.response.status} (${duration}ms)`,
            error.response.data,
          );

          // attempt token refresh on 401
          if (error.response.status === 401 && !config._retry) {
            config._retry = true;
            const rt = authData?.refreshToken;
            if (!rt) {
              dispatch(clearAuthData());
              return Promise.reject(error);
            }
            try {
              const fresh = await singleRefresh(() => refreshTokenApi(rt));
              if (!fresh) throw new Error('Refresh failed');
              dispatch(updateAccessToken(fresh));
              config.headers.Authorization = `Bearer ${fresh}`;
              return axiosInstance(config);
            } catch (e) {
              dispatch(clearAuthData());
              return Promise.reject(e);
            }
          }
        } else {
          // Network or CORS error
          console.error(`[Network/Error] ${method} ${config.url}`, error.message);
        }

        dispatch(clearAuthData());
        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(reqId);
      axiosInstance.interceptors.response.eject(resId);
    };
  }, [authData, dispatch, singleRefresh]);
}

// Invisible component to mount at app root
export const SetupInterceptors: React.FC = () => {
  useAuthInterceptor();
  return null;
};
