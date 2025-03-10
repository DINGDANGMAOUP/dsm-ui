"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Permission, UserRole } from "@/lib/types";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">加载中...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white shadow dark:bg-gray-800">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">仪表盘</h1>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                    alt="用户头像"
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              >
                登出
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 所有用户都可以访问的卡片 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">基本信息</h2>
              <p className="text-gray-600 dark:text-gray-400">欢迎回来，{user?.username}！</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">您的角色是：{user?.role}</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                您的权限：{user?.permissions.join(", ")}
              </p>
            </div>

            {/* 需要写入权限的卡片 */}
            <PermissionGuard permissions={[Permission.WRITE]}>
              <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  内容管理
                </h2>
                <p className="text-gray-600 dark:text-gray-400">您可以创建和编辑内容。</p>
                <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
                  创建内容
                </button>
              </div>
            </PermissionGuard>

            {/* 需要管理员权限的卡片 */}
            <PermissionGuard permissions={[Permission.ADMIN]}>
              <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  系统管理
                </h2>
                <p className="text-gray-600 dark:text-gray-400">您可以管理系统设置和用户权限。</p>
                <button className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none">
                  系统设置
                </button>
              </div>
            </PermissionGuard>

            {/* 需要删除权限的卡片 */}
            <PermissionGuard permissions={[Permission.DELETE]}>
              <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  数据清理
                </h2>
                <p className="text-gray-600 dark:text-gray-400">您可以删除和归档数据。</p>
                <button className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none">
                  清理数据
                </button>
              </div>
            </PermissionGuard>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
