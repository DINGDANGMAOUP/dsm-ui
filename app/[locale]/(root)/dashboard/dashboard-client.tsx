"use client";

import { LocaleLink } from "@/components/locale-link";
import { useUser } from "@/hooks/useUser";

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

export default function DashboardClient({ locale, translations }: DashboardClientProps) {
  const { user, logout, isLoading } = useUser();

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      // 重定向到首页
      window.location.href = `/${locale}`;
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

  if (isLoading) {
    return <div className="flex h-24 items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {translations.welcome}, {user?.username || "用户"}!
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          角色: {user?.authorities?.join(", ") || "普通用户"}
        </p>
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
