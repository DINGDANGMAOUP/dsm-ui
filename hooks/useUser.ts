"use client";

import { useUserStore } from "@/store";
import { useEffect } from "react";

/**
 * 用户信息Hook
 * 用于在组件中使用用户状态
 */
export const useUser = () => {
  const { user, isLoading, isAuthenticated, error, login, logout, refreshUserInfo, setIsLoading } =
    useUserStore();

  // 初始化用户状态
  useEffect(() => {
    // 只在客户端执行
    if (typeof window === "undefined") return;

    const initUserState = async () => {
      // 避免重复初始化，如果已经加载了用户或者正在加载，则跳过
      if (user || isLoading) return;

      setIsLoading(true);
      try {
        // 检查是否已认证，如果没有用户信息但有token，则刷新用户信息
        if (!user && isAuthenticated) {
          console.log("用户已认证，但没有用户信息，获取用户信息");
          await refreshUserInfo();
        } else {
          console.log("用户认证状态:", isAuthenticated ? "已认证" : "未认证");
        }
      } catch (error) {
        console.error("初始化用户状态失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initUserState();
  }, []); // 只在组件挂载时执行一次

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    refreshUserInfo,
  };
};
