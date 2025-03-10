import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Permission, UserRole } from "@/lib/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: Permission[];
  roles?: UserRole[];
  redirectTo?: string;
}

/**
 * 路由保护组件
 * 用于保护需要认证的路由
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permissions = [],
  roles = [],
  redirectTo = "/login",
}) => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // 如果用户信息加载完成且未认证，重定向到登录页
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // 如果用户已认证，检查权限
    if (!isLoading && user) {
      // 检查角色权限
      const hasRequiredRole = roles.length === 0 || roles.includes(user.role);

      // 检查具体权限
      const hasRequiredPermissions =
        permissions.length === 0 ||
        permissions.every((permission) => user.permissions.includes(permission));

      // 如果不满足权限要求，重定向到登录页
      if (!hasRequiredRole || !hasRequiredPermissions) {
        router.push(redirectTo);
      }
    }
  }, [isLoading, isAuthenticated, user, roles, permissions, redirectTo, router]);

  // 如果正在加载用户信息，显示加载状态
  if (isLoading) {
    return <div>加载中...</div>;
  }

  // 如果未认证或不满足权限要求，不显示任何内容（等待重定向）
  if (!isAuthenticated) {
    return null;
  }

  // 如果已认证且满足权限要求，显示子元素
  return <>{children}</>;
};

export default ProtectedRoute;
