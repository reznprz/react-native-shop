import { ApiResponse } from '../handlers';
import apiMethods from '../handlers/apiMethod';

export enum LoginEventType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export enum LoginStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum PlatformType {
  WEB = 'WEB',
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  UNKNOWN = 'UNKNOWN',
}

export enum DeviceType {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  UNKNOWN = 'UNKNOWN',
}

export enum DateRangeSelectionType {
  SINGLE_DATE = 'SINGLE_DATE',
  DATE_RANGE = 'DATE_RANGE',
}

export interface LoginActivity {
  id: number;
  userId?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  restaurantId?: number;
  restaurantName?: string;
  eventType: LoginEventType;
  status: LoginStatus;
  eventAt: string;
  ipAddress?: string;
  userAgent?: string;
  usernameAttempted?: string;
  failureReason?: string;
  sessionId?: string;
  appVersion?: string;
  platform?: PlatformType;
  deviceType?: DeviceType;
}

export interface LoginActivityFilterRequest {
  restaurantId: number;
  selectionType?: DateRangeSelectionType;
  singleDate?: string;
  startDate?: string;
  endDate?: string;
}

export const emptyLoginActivity: LoginActivity = {
  id: 0,
  eventType: LoginEventType.LOGIN,
  status: LoginStatus.SUCCESS,
  eventAt: '',
  userId: 0,
  username: '',
  firstName: '',
  lastName: '',
  restaurantId: 0,
  restaurantName: '',
  ipAddress: '',
  userAgent: '',
  usernameAttempted: '',
  failureReason: '',
  sessionId: '',
  appVersion: '',
  platform: PlatformType.UNKNOWN,
  deviceType: DeviceType.UNKNOWN,
};

const buildQueryString = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

export const getTodayLoginActivityApi = async (
  restaurantId: number,
): Promise<ApiResponse<LoginActivity[]>> => {
  return await apiMethods.get<LoginActivity[]>(
    `/api/login-activity/today?restaurantId=${restaurantId}`,
  );
};

export const getRecentLoginActivityApi = async (
  restaurantId: number,
): Promise<ApiResponse<LoginActivity[]>> => {
  return await apiMethods.get<LoginActivity[]>(
    `/api/login-activity/recent?restaurantId=${restaurantId}`,
  );
};

export const getLoginActivityByDateApi = async (
  restaurantId: number,
  singleDate: string,
): Promise<ApiResponse<LoginActivity[]>> => {
  const query = buildQueryString({
    restaurantId,
    selectionType: DateRangeSelectionType.SINGLE_DATE,
    singleDate,
  });

  return await apiMethods.get<LoginActivity[]>(`/api/login-activity?${query}`);
};

export const getLoginActivityByDateRangeApi = async (
  restaurantId: number,
  startDate: string,
  endDate: string,
): Promise<ApiResponse<LoginActivity[]>> => {
  const query = buildQueryString({
    restaurantId,
    selectionType: DateRangeSelectionType.DATE_RANGE,
    startDate,
    endDate,
  });

  return await apiMethods.get<LoginActivity[]>(`/api/login-activity?${query}`);
};

export const getLoginActivityApi = async (
  request: LoginActivityFilterRequest,
): Promise<ApiResponse<LoginActivity[]>> => {
  const query = buildQueryString({
    restaurantId: request.restaurantId,
    selectionType: request.selectionType ?? DateRangeSelectionType.SINGLE_DATE,
    singleDate: request.singleDate,
    startDate: request.startDate,
    endDate: request.endDate,
  });

  return await apiMethods.get<LoginActivity[]>(`/api/login-activity?${query}`);
};
