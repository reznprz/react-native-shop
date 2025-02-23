export enum ApiStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum ErrorStatus {
  NETWORK = 'Network Error',
  SERVER_ERROR = 'Internal Server Error',
  CLIENT_ERROR = 'Client Error',
  UNKNOWN_ERROR = 'Unknown Error',
}

export interface ApiResponse<T> {
  status: ApiStatus; // "success" or "error"
  data: T | null; // Data for success or null for errors
  statusCode: number; // HTTP status code
  message: string; // Success or error message
}

export interface ApiResponse2 {
  status: ApiStatus; // "success" or "error"
  data: GetAllfoodRes | null; // Data for success or null for errors
  statusCode: number; // HTTP status code
  message: string; // Success or error message
}
