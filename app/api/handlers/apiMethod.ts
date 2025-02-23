import axiosInstance, { responseHandler, errorHandler } from './apiHandler';
import { AxiosRequestConfig } from 'axios';
import { ApiResponse } from './index';

const apiMethods = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.get<T>(url, config);
      return responseHandler<T>(response);
    } catch (error) {
      return errorHandler<T>(error);
    }
  },

  post: async <T>(
    url: string,
    payload: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post<T>(url, payload, config);
      return responseHandler<T>(response);
    } catch (error) {
      return errorHandler<T>(error);
    }
  },

  put: async <T>(
    url: string,
    payload: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.put<T>(url, payload, config);
      return responseHandler<T>(response);
    } catch (error) {
      return errorHandler<T>(error);
    }
  },

  patch: async <T>(
    url: string,
    payload: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.patch<T>(url, payload, config);
      return responseHandler<T>(response);
    } catch (error) {
      return errorHandler<T>(error);
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.delete<T>(url, config);
      return responseHandler<T>(response);
    } catch (error) {
      return errorHandler<T>(error);
    }
  },
};

export default apiMethods;
