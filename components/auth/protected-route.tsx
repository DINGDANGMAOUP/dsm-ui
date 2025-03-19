import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: string[];
  authorities?: string[];
  redirectTo?: string;
}

/**
 * 路由保护组件
 * 用于保护需要认证的路由
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permissions = [],
  authorities = [],
  redirectTo,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useUser();

  // 获取当前语言
  const getCurrentLocale = () => {
    const segments = pathname.split("/");
    return segments[1] || "zh"; // 默认使用中文
  };

  // 构建重定向路径
  const getRedirectPath = () => {
    if (redirectTo) {
      // 如果提供了重定向路径，检查是否需要添加语言前缀
      if (redirectTo.startsWith("/")) {
        const segments = redirectTo.split("/");
        if (segments.length > 1 && segments[1].length === 2) {
          // 路径已经包含语言前缀，直接使用
          return redirectTo;
        }
        // 添加当前语言前缀
        return `/${getCurrentLocale()}${redirectTo}`;
      }
      return `/${getCurrentLocale()}/${redirectTo}`;
    }
    // 默认重定向到当前语言的登录页
    return `/${getCurrentLocale()}/login`;
  };

  useEffect(() => {
    // 如果用户信息加载完成且未认证，重定向到登录页
    if (!isLoading && !isAuthenticated) {
      const redirectPath = getRedirectPath();
      console.log(`用户未认证，重定向到: ${redirectPath}`);
      router.push(redirectPath);
      return;
    }

    // 如果用户已认证，检查权限
    if (!isLoading && user) {
      // 检查角色权限
      const hasRequiredAuthority =
        authorities.length === 0 ||
        authorities.some((authority) => user.authorities.includes(authority));

      // 检查具体权限
      const hasRequiredPermissions =
        permissions.length === 0 ||
        permissions.every((permission) => user.permissions.includes(permission));

      // 如果不满足权限要求，重定向到登录页
      if (!hasRequiredAuthority || !hasRequiredPermissions) {
        const redirectPath = getRedirectPath();
        console.log(`用户权限不足，重定向到: ${redirectPath}`);
        router.push(redirectPath);
      }
    }
  }, [isLoading, isAuthenticated, user, authorities, permissions, router, pathname]);

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
