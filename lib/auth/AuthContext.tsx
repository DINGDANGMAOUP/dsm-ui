"use client";
import React, { createContext, useEffect, useState } from "react";
import { UserInfo, LoginRequest, LoginResponse } from "../types";
import api from "../api/client";
import { getAccessToken, isAuthenticated, setAccessToken, setRefreshToken } from "./token";

interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
  error: string | null;
}

// 创建认证上下文
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  refreshUserInfo: async () => {},
  error: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

// 认证提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取用户信息
  const fetchUserInfo = async (): Promise<UserInfo | null> => {
    try {
      console.log("开始获取用户信息...");
      // 发起API请求获取用户信息
      const response = await api.get<UserInfo>("/users/me");
      if (response.success && response.data) {
        console.log("获取用户信息成功:", response.data);
        return response.data;
      }
      console.error("获取用户信息失败:", response.message);
      return null;
    } catch (error: any) {
      console.error("获取用户信息失败:", error);
      return null;
    }
  };

  // 刷新用户信息
  const refreshUserInfo = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userData = await fetchUserInfo();
      setUser(userData);
    } catch (error: any) {
      console.error("刷新用户信息失败:", error);
      setError("刷新用户信息失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 登录
  const login = async (data: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("开始登录请求...");
      const response = await api.post<LoginResponse>("/auth/login", data);
      console.log("登录响应:", response);

      if (!response) {
        throw new Error("登录请求失败，未收到响应");
      }

      if (response.success && response.data) {
        console.log("登录成功，保存令牌...");
        // 保存令牌
        if (response.data.accessToken && response.data.refreshToken) {
          setAccessToken(response.data.accessToken);
          setRefreshToken(response.data.refreshToken);
          console.log("令牌已保存");
        }

        // 登录成功后，获取用户信息
        console.log("登录成功，开始获取用户信息...");
        const userInfo = await fetchUserInfo();
        if (userInfo) {
          console.log("用户信息获取成功:", userInfo);
          setUser(userInfo);
        } else {
          console.error("用户信息获取失败");
          throw new Error("获取用户信息失败");
        }
      } else {
        console.error("登录失败:", response.message);
        throw new Error(response.message || "登录失败");
      }
    } catch (error: any) {
      console.error("登录过程中发生错误:", error);
      setError(error.message || "登录失败");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // 调用登出API
      await api.post("/auth/logout");

      // 清除用户信息
      setUser(null);
    } catch (error: any) {
      console.error("登出失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      try {
        // 检查是否已认证
        if (isAuthenticated()) {
          console.log("用户已认证，获取用户信息");
          // 获取用户信息
          const userData = await fetchUserInfo();
          if (userData) {
            console.log("初始化用户信息成功:", userData);
            setUser(userData);
          } else {
            console.log("获取用户信息失败，可能需要重新登录");
          }
        } else {
          console.log("用户未认证");
        }
      } catch (error: any) {
        console.error("初始化认证状态失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user && !!getAccessToken(),
    login,
    logout,
    refreshUserInfo,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
