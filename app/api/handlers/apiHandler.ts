import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiStatus, ErrorStatus } from './index';
import { setupApiInterceptors } from './interceptors';
import { config } from 'app/config/config';

// --- helpers ---
const isFormData = (data: any) =>
  typeof FormData !== 'undefined' &&
  (data instanceof FormData ||
    Object.prototype.toString.call(data) === '[object FormData]' ||
    data?.constructor?.name === 'FormData');

// Infer a sensible MIME if missing
export const guessMime = (name?: string, fallback = 'application/octet-stream') => {
  if (!name) return fallback;
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'pdf':
      return 'application/pdf';
    default:
      return fallback;
  }
};

// Create the instance (do NOT force Content-Type globally)
const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.apiBaseURL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    // DO NOT set 'Content-Type' here; it breaks FormData boundary
  },
});

// Request interceptor (Axios v1 uses InternalAxiosRequestConfig)
axiosInstance.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const isFD = isFormData(cfg.data);

  if (isFD) {
    // Remove any lingering JSON content-type so Axios sets multipart boundary
    const h: any = cfg.headers || {};
    delete h['Content-Type'];
    delete h['content-type'];
    cfg.headers = h;

    // Pass through body unchanged (no JSON stringify)
    cfg.transformRequest = [(data) => data];
  } else {
    // For non-FormData, set JSON Content-Type if not already set
    // (Don't force for all requests globally.)
    const h: any = cfg.headers || {};
    if (!h['Content-Type'] && !h['content-type']) {
      h['Content-Type'] = 'application/json';
    }
    cfg.headers = h;
  }

  return cfg;
});

// Keep your project-specific interceptors, but ensure they DON'T
// re-add 'application/json' for FormData payloads.
setupApiInterceptors(axiosInstance, config);

// ---- standard response handlers ----
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
    data: null as any,
    statusCode,
    message,
  };
};

export default axiosInstance;
