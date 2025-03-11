import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ApiResponse } from "../types";

// SpringBoot API的基础URL
export const SPRING_BOOT_API_URL = process.env.SPRING_BOOT_API_URL || "http://localhost:8080/api";

// 创建axios实例 - 用于服务端与SpringBoot通信
const serverApiClient: AxiosInstance = axios.create({
  baseURL: SPRING_BOOT_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 封装请求方法
export const serverApi = {
  get: async <T>(url: string, token?: string, config?: AxiosRequestConfig) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await serverApiClient.get<ApiResponse<T>>(url, {
        ...config,
        headers: {
          ...headers,
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error: any) {
      // 处理错误
      if (error.response) {
        // 服务器响应了，但状态码不在2xx范围内
        return error.response.data as ApiResponse<T>;
      } else {
        // 服务器没有响应或请求被取消
        return {
          code: 500,
          message: error.message || "服务器错误",
          success: false,
        } as ApiResponse<T>;
      }
    }
  },

  post: async <T>(url: string, data?: any, token?: string, config?: AxiosRequestConfig) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await serverApiClient.post<ApiResponse<T>>(url, data, {
        ...config,
        headers: {
          ...headers,
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data as ApiResponse<T>;
      } else {
        return {
          code: 500,
          message: error.message || "服务器错误",
          success: false,
        } as ApiResponse<T>;
      }
    }
  },

  put: async <T>(url: string, data?: any, token?: string, config?: AxiosRequestConfig) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await serverApiClient.put<ApiResponse<T>>(url, data, {
        ...config,
        headers: {
          ...headers,
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data as ApiResponse<T>;
      } else {
        return {
          code: 500,
          message: error.message || "服务器错误",
          success: false,
        } as ApiResponse<T>;
      }
    }
  },

  delete: async <T>(url: string, token?: string, config?: AxiosRequestConfig) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await serverApiClient.delete<ApiResponse<T>>(url, {
        ...config,
        headers: {
          ...headers,
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data as ApiResponse<T>;
      } else {
        return {
          code: 500,
          message: error.message || "服务器错误",
          success: false,
        } as ApiResponse<T>;
      }
    }
  },
};

export default serverApi;
