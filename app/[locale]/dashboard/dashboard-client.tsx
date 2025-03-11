"use client";

import { useState, useEffect } from "react";
import { LocaleLink } from "@/components/locale-link";
import { removeTokens, isAuthenticated } from "@/lib/auth/token";

type DashboardClientProps = {
  locale: string;
  translations: {
    welcome: string;
    statsTitle: string;
    users: string;
    orders: string;
    revenue: string;
    growth: string;
    recentActivityTitle: string;
    noActivity: string;
    back: string;
    logout: string;
  };
};

// 用户数据类型
type UserData = {
  username: string;
  role: string;
  loginTime: number;
};

export default function DashboardClient({ locale, translations }: DashboardClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    username: "",
    role: "",
    loginTime: 0,
  });

  useEffect(() => {
    // 从 localStorage 加载用户数据
    const loadUserData = async () => {
      try {
        // 检查是否已登录
        if (!isAuthenticated()) {
          console.log("用户未登录，重定向到登录页");
          window.location.href = `/${locale}/login`;
          return;
        }

        // 从 localStorage 获取用户数据
        const storedUserData = localStorage.getItem("userData");

        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData) as UserData;
          console.log("从 localStorage 加载用户数据:", parsedUserData);

          // 检查数据是否过期（1小时）
          const now = Date.now();
          const isExpired = now - parsedUserData.loginTime > 3600000;

          if (isExpired) {
            console.log("用户数据已过期，重新获取");
            await fetchUserData();
          } else {
            setUserData(parsedUserData);
            setIsLoading(false);
          }
        } else {
          // 如果没有存储的用户数据，则获取新数据
          console.log("没有存储的用户数据，获取新数据");
          await fetchUserData();
        }
      } catch (error) {
        console.error("加载用户数据失败:", error);
        setIsLoading(false);
      }
    };

    // 模拟获取用户数据
    const fetchUserData = async () => {
      try {
        // 模拟API请求延迟
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 设置模拟用户数据
        const newUserData: UserData = {
          username: "Admin User",
          role: "Administrator",
          loginTime: Date.now(),
        };

        // 保存到 localStorage
        localStorage.setItem("userData", JSON.stringify(newUserData));
        console.log("用户数据已保存到 localStorage");

        setUserData(newUserData);
      } catch (error) {
        console.error("获取用户数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [locale]);

  // 处理登出
  const handleLogout = () => {
    // 使用 removeTokens 函数清除令牌
    removeTokens();

    // 清除 localStorage
    localStorage.removeItem("userData");

    // 重定向到首页
    window.location.href = `/${locale}`;
  };

  if (isLoading) {
    return <div className="flex h-24 items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {translations.welcome}, {userData.username}!
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Role: {userData.role}</p>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">
          {translations.statsTitle}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {translations.users}
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">1,234</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {translations.orders}
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">5,678</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {translations.revenue}
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">$12,345</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {translations.growth}
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">+12.3%</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">
          {translations.recentActivityTitle}
        </h3>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <div className="text-center text-gray-500 dark:text-gray-400">
            {translations.noActivity}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <LocaleLink
          href="/"
          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          {translations.back}
        </LocaleLink>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
        >
          {translations.logout}
        </button>
      </div>
    </div>
  );
}
