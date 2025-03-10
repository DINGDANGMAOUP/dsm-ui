"use client";
import React, { createContext, useEffect, useState } from "react";
import { User, LoginRequest } from "../types";
import api from "../api/client";
import { getAccessToken, isAuthenticated, removeTokens } from "./token";

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取用户信息
  const fetchUserInfo = async (): Promise<User | null> => {
    try {
      const response = await api.get<User>("/users/me");
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("获取用户信息失败", error);
      return null;
    }
  };

  // 刷新用户信息
  const refreshUserInfo = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userData = await fetchUserInfo();
      setUser(userData);
    } catch (error) {
      console.error("刷新用户信息失败", error);
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

      const response = await api.post("/auth/login", data);

      if (response.success && response.data) {
        // 令牌已由服务端设置到Cookie，但为了兼容性，也保存到localStorage
        if (
          typeof window !== "undefined" &&
          response.data.accessToken &&
          response.data.refreshToken
        ) {
          localStorage.setItem("access_token", response.data.accessToken);
          localStorage.setItem("refresh_token", response.data.refreshToken);
        }

        // 获取用户信息
        const userData = await fetchUserInfo();
        setUser(userData);
      } else {
        throw new Error(response.message || "登录失败");
      }
    } catch (error: any) {
      console.error("登录失败", error);
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

      // 清除localStorage中的令牌
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    } catch (error) {
      console.error("登出失败", error);
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
          // 获取用户信息
          const userData = await fetchUserInfo();
          setUser(userData);
        }
      } catch (error) {
        console.error("初始化认证状态失败", error);
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
