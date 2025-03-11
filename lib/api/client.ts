import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "../types";
import { getAccessToken, removeTokens } from "../auth/token";

// 创建axios实例 - 指向Next.js API路由
const apiClient: AxiosInstance = axios.create({
  // 指向Next.js API路由
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    console.error("API请求失败:", error);

    // 如果是401错误，重定向到登录页
    if (error.response?.status === 401) {
      // 清除本地存储的令牌
      removeTokens();

      // 如果在客户端，重定向到登录页
      if (typeof window !== "undefined") {
        // 获取当前语言
        const pathname = window.location.pathname;
        const segments = pathname.split("/");
        const locale = segments.length > 1 && segments[1].length === 2 ? segments[1] : "zh"; // 默认使用中文

        window.location.href = `/${locale}/login`;
      }
    }

    // 返回一个标准化的错误响应，而不是直接抛出错误
    return Promise.resolve({
      data: {
        code: error.response?.status || 500,
        message: error.message || "服务器错误",
        success: false,
        data: null,
      },
    });
  }
);

// 封装请求方法
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient
      .get<ApiResponse<T>>(url, config)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`GET ${url} 失败:`, error);
        return {
          code: 500,
          message: error.message || "请求失败",
          success: false,
          data: null as T,
        } as ApiResponse<T>;
      }),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient
      .post<ApiResponse<T>>(url, data, config)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`POST ${url} 失败:`, error);
        return {
          code: 500,
          message: error.message || "请求失败",
          success: false,
          data: null as T,
        } as ApiResponse<T>;
      }),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient
      .put<ApiResponse<T>>(url, data, config)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`PUT ${url} 失败:`, error);
        return {
          code: 500,
          message: error.message || "请求失败",
          success: false,
          data: null as T,
        } as ApiResponse<T>;
      }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient
      .delete<ApiResponse<T>>(url, config)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`DELETE ${url} 失败:`, error);
        return {
          code: 500,
          message: error.message || "请求失败",
          success: false,
          data: null as T,
        } as ApiResponse<T>;
      }),
};

export default api;
