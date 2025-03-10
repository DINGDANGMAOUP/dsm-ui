import React from "react";
import { Permission, UserRole } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: Permission[];
  roles?: UserRole[];
  fallback?: React.ReactNode;
}

/**
 * 权限控制组件
 * 根据用户权限控制UI元素的显示
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions = [],
  roles = [],
  fallback = null,
}) => {
  const { user, isLoading } = useAuth();

  // 如果正在加载用户信息，不显示任何内容
  if (isLoading) {
    return null;
  }

  // 如果用户未登录，显示fallback
  if (!user) {
    return <>{fallback}</>;
  }

  // 检查角色权限
  const hasRequiredRole = roles.length === 0 || roles.includes(user.role);

  // 检查具体权限
  const hasRequiredPermissions =
    permissions.length === 0 ||
    permissions.every((permission) => user.permissions.includes(permission));

  // 如果满足权限要求，显示子元素，否则显示fallback
  return <>{hasRequiredRole && hasRequiredPermissions ? children : fallback}</>;
};

export default PermissionGuard;
