"use client";

import React from "react";
import ProtectedRoute from "../../../../components/auth/ProtectedRoute";

interface DashboardProtectedProps {
  children: React.ReactNode;
  locale: string;
}

/**
 * 仪表盘保护组件
 * 用于保护仪表盘页面，只允许已登录用户访问
 */
export const DashboardProtected: React.FC<DashboardProtectedProps> = ({ children, locale }) => {
  return <ProtectedRoute redirectTo={`/${locale}/login`}>{children}</ProtectedRoute>;
};

/**
 * 管理员仪表盘保护组件
 * 用于保护管理员仪表盘页面，只允许管理员访问
 */
export const AdminDashboardProtected: React.FC<DashboardProtectedProps> = ({
  children,
  locale,
}) => {
  return (
    <ProtectedRoute authorities={["admin"]} redirectTo={`/${locale}/login`}>
      {children}
    </ProtectedRoute>
  );
};

export default DashboardProtected;
